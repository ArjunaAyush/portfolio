import { spawn } from 'child_process';

async function runM3AdversarialTest() {
  const chromePath =
    process.env.CHROME_PATH ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const port = 9222;
  const chromeProcess = spawn(chromePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-background-networking',
    '--disable-extensions',
    '--disable-sync',
  ]);

  let ws = null;
  const testResults = [];

  function record(name, passed, detail = '') {
    testResults.push({ name, passed, detail });
    const badge = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${badge}: ${name} ${detail ? `(${detail})` : ''}`);
  }

  try {
    await new Promise((r) => setTimeout(r, 1500));

    let versionData;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    if (!versionData) {
      throw new Error(`Could not connect to Chrome CDP at http://127.0.0.1:${port}`);
    }

    const newTargetRes = await fetch(`http://127.0.0.1:${port}/json/new`, { method: 'PUT' });
    const targetData = await newTargetRes.json();
    const wsUrl = targetData.webSocketDebuggerUrl;

    ws = new WebSocket(wsUrl);

    let idCounter = 1;
    const pending = new Map();

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((r) => (ws.onopen = r));

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('--- Connecting to http://localhost:5173 ---');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await new Promise((r) => setTimeout(r, 1200));

    // Wait for ready
    let pageLoaded = false;
    for (let i = 0; i < 60; i++) {
      const { result } = await send('Runtime.evaluate', {
        expression: 'document.readyState === "complete" && document.querySelectorAll("section").length >= 5',
        returnByValue: true,
      });
      if (result && result.value) {
        pageLoaded = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    if (!pageLoaded) throw new Error('Page failed to load 5+ sections');

    async function evaluate(code) {
      const response = await send('Runtime.evaluate', {
        expression: code,
        returnByValue: true,
      });
      if (response.exceptionDetails) {
        console.error('Runtime.evaluate exception:', response.exceptionDetails);
      }
      return response.result?.value;
    }

    async function checkConsoleCleanliness(stage) {
      const errs = await evaluate('window.__consoleErrors');
      if (!Array.isArray(errs)) {
        record(`Console errors array check @ ${stage}`, false, `Not an array: ${typeof errs}`);
        return false;
      }
      if (errs.length > 0) {
        record(`Console clean @ ${stage}`, false, `${errs.length} errors: ${JSON.stringify(errs)}`);
        return false;
      }
      record(`Console clean @ ${stage}`, true, '0 errors');
      return true;
    }

    await checkConsoleCleanliness('Initial Load');

    // ==========================================
    // 1. DEV TERMINAL HUD TRIGGER & OPENING
    // ==========================================
    console.log('\n--- TEST 1: DevTerminal Trigger & Opening ---');
    const triggerFound = await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label="Open Android Telemetry Console and Logcat HUD"]');
      if (!btn) return { ok: false };
      const rect = btn.getBoundingClientRect();
      btn.click();
      return { ok: true, left: rect.left, bottom: window.innerHeight - rect.bottom };
    })()`);
    record('DevTerminal HUD Button Docked in Bottom-Left', triggerFound.ok && triggerFound.left < 100, `left: ${triggerFound.left}px`);

    await new Promise((r) => setTimeout(r, 400));

    const panelState = await evaluate(`(() => {
      const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
      if (!panel) return { open: false };
      const rect = panel.getBoundingClientRect();
      const zIndex = window.getComputedStyle(panel).zIndex;
      return { open: true, width: rect.width, left: rect.left, right: rect.right, zIndex };
    })()`);
    record('DevTerminal Panel Opened', panelState.open);
    record('DevTerminal z-index is 30', panelState.zIndex === '30', `zIndex: ${panelState.zIndex}`);
    record('DevTerminal Strictly Constrained to Left (<700px)', panelState.right <= 700, `right edge: ${panelState.right}px`);

    // ==========================================
    // 2. TAB NAVIGATION & LOGCAT CONTROLS
    // ==========================================
    console.log('\n--- TEST 2: Tab Navigation & Logcat Controls ---');
    // Verify default active tab is Logcat
    const logcatVisible = await evaluate(`(() => {
      const body = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
      const text = (body?.innerText || '').toLowerCase();
      return text.includes('logcat') && text.includes('level:') && text.includes('looply');
    })()`);
    record('Default Tab is Logcat with Stream', logcatVisible);

    // Test Log Level Filter buttons
    const filterRes = await evaluate(`(() => {
      const lvlBtns = Array.from(document.querySelectorAll('aside[aria-label="Developer Telemetry Panel"] button'));
      const warnBtn = lvlBtns.find(b => b.innerText.trim() === 'WARN');
      if (!warnBtn) return { ok: false, error: 'WARN button not found' };
      warnBtn.click();
      return { ok: true };
    })()`);
    record('Filter Logcat by Level WARN', filterRes.ok);
    await new Promise((r) => setTimeout(r, 200));

    // Test Pause / Resume Toggle
    const pauseToggleRes = await evaluate(`(() => {
      const pauseBtn = document.querySelector('button[aria-label="Pause Logcat stream"]');
      if (!pauseBtn) return { ok: false };
      pauseBtn.click();
      return { ok: true };
    })()`);
    await new Promise((r) => setTimeout(r, 250));
    const resumeBtnFound = await evaluate(`!!document.querySelector('button[aria-label="Resume Logcat stream"]')`);
    record('Logcat Pause / Resume Toggle', pauseToggleRes.ok && resumeBtnFound);

    // Test Clear Button
    const clearRes = await evaluate(`(() => {
      const clearBtn = document.querySelector('button[aria-label="Clear Logcat logs"]');
      if (!clearBtn) return { ok: false };
      clearBtn.click();
      return { ok: true };
    })()`);
    await new Promise((r) => setTimeout(r, 250));
    const emptyTextFound = await evaluate(`(() => {
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '';
      return text.includes('No logcat entries match filter');
    })()`);
    record('Logcat Clear Button Clears Logs', clearRes.ok && emptyTextFound);

    // Switch to ALL levels again
    await evaluate(`(() => {
      const allBtn = Array.from(document.querySelectorAll('aside[aria-label="Developer Telemetry Panel"] button')).find(b => b.innerText.trim() === 'ALL');
      if (allBtn) allBtn.click();
    })()`);

    // ==========================================
    // 3. TELEMETRY TAB
    // ==========================================
    console.log('\n--- TEST 3: Telemetry Tab ---');
    const teleTabClick = await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('aside[aria-label="Developer Telemetry Panel"] button'));
      const tel = tabs.find(b => b.innerText.includes('Telemetry'));
      if (!tel) return false;
      tel.click();
      return true;
    })()`);
    record('Switch to Telemetry Tab', teleTabClick);
    await new Promise((r) => setTimeout(r, 250));

    const teleContent = await evaluate(`(() => {
      const text = (document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '').toLowerCase();
      return {
        hasDevice: text.includes('google pixel 8 pro') && text.includes('api 35'),
        hasEngine: text.includes('jetpack compose 1.7.5') && text.includes('skiko / vulkan'),
        hasHeap: text.includes('jvm heap allocation') && text.includes('192 mb'),
        hasFps: text.includes('120') && text.includes('frame render budget'),
        hasGradle: text.includes('build successful in 1.48s')
      };
    })()`);
    record('Telemetry Tab: Pixel 8 Pro & Vulkan Meta', teleContent.hasDevice && teleContent.hasEngine);
    record('Telemetry Tab: Dynamic JVM Heap & 120 FPS Budget', teleContent.hasHeap && teleContent.hasFps && teleContent.hasGradle);


    // ==========================================
    // 4. INTERACTIVE CLI TAB & COMMANDS
    // ==========================================
    console.log('\n--- TEST 4: Interactive CLI Commands ---');
    const cliTabClick = await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('aside[aria-label="Developer Telemetry Panel"] button'));
      const cli = tabs.find(b => b.innerText.includes('Interactive CLI'));
      if (!cli) return false;
      cli.click();
      return true;
    })()`);
    record('Switch to Interactive CLI Tab', cliTabClick);
    await new Promise((r) => setTimeout(r, 200));

    async function runCliCommand(commandText) {
      return await evaluate(`(() => {
        const input = document.querySelector('input[aria-label="Terminal command input"]');
        const form = input?.closest('form');
        if (!input || !form) return { ok: false, error: 'Input/form not found' };
        
        // Use native value setter for React
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, ${JSON.stringify(commandText)});
        input.dispatchEvent(new Event('input', { bubbles: true }));

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return { ok: true };
      })()`);
    }

    // Command: help
    await runCliCommand('help');
    await new Promise((r) => setTimeout(r, 200));
    const helpOutput = await evaluate(`(() => {
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '';
      return text.includes('Diagnostic Commands:') && text.includes('inspect <id>');
    })()`);
    record('CLI Command: "help"', helpOutput);

    // Command: projects
    await runCliCommand('projects');
    await new Promise((r) => setTimeout(r, 200));
    const projectsOutput = await evaluate(`(() => {
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '';
      return text.includes('Looply') && text.includes('StatSync') && text.includes('Amurot');
    })()`);
    record('CLI Command: "projects"', projectsOutput);

    // Command: inspect looply -> Triggers modal!
    console.log('\n--- TEST 5: CLI "inspect looply" triggers ProjectModal ---');
    await runCliCommand('inspect looply');
    await new Promise((r) => setTimeout(r, 400));

    const looplyModalOpen = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!dialog) return { open: false };
      const title = document.getElementById('project-modal-title')?.innerText?.trim();
      const zIndex = window.getComputedStyle(dialog).zIndex;
      return { open: true, title, zIndex };
    })()`);
    record('CLI "inspect looply" Successfully Opens ProjectModal', looplyModalOpen.open && looplyModalOpen.title === 'Looply');
    record('ProjectModal z-index is 50', looplyModalOpen.zIndex === '50', `zIndex: ${looplyModalOpen.zIndex}`);

    // Dismiss modal via Escape key
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 27, code: 'Escape', key: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 27, code: 'Escape', key: 'Escape' });
    await new Promise((r) => setTimeout(r, 300));

    const modalClosedAfterEsc = await evaluate(`!document.querySelector('[role="dialog"]')`);
    record('Escape Key Closes Modal while Terminal Stays Open', modalClosedAfterEsc);

    // Command: inspect statsync -> Triggers modal!
    await runCliCommand('inspect statsync');
    await new Promise((r) => setTimeout(r, 400));
    const statsyncModalOpen = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      return dialog ? document.getElementById('project-modal-title')?.innerText?.trim() === 'StatSync' : false;
    })()`);
    record('CLI "inspect statsync" Successfully Opens ProjectModal', statsyncModalOpen);

    // Close via close button
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close project specifications modal"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));

    // Command: inspect amurot -> Triggers modal!
    await runCliCommand('inspect amurot');
    await new Promise((r) => setTimeout(r, 400));
    const amurotModalOpen = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      return dialog ? document.getElementById('project-modal-title')?.innerText?.trim().includes('Amurot') : false;
    })()`);
    record('CLI "inspect amurot" Successfully Opens ProjectModal', amurotModalOpen);

    // Close via backdrop
    await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) dialog.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));

    // Command: inspect invalid_project -> Should print error without opening modal
    await runCliCommand('inspect invalid_project');
    await new Promise((r) => setTimeout(r, 200));
    const invalidInspect = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '';
      return { modalOpened: !!dialog, hasError: text.includes('Unknown project: "invalid_project"') };
    })()`);
    record('CLI "inspect invalid_project" Handles Unknown Gracefully', !invalidInspect.modalOpened && invalidInspect.hasError);

    // Command: metrics, whoami, adb devices, gradle build
    await runCliCommand('metrics');
    await runCliCommand('whoami');
    await runCliCommand('adb devices');
    await runCliCommand('gradle build');
    await new Promise((r) => setTimeout(r, 300));

    const extraCommandsOutput = await evaluate(`(() => {
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"]')?.innerText || '';
      return {
        hasMetrics: text.includes('Device Telemetry Snapshot:'),
        hasWhoami: text.includes('Ayush Kumar (Arjuna Ayush)'),
        hasAdb: text.includes('emulator-5554'),
        hasGradle: text.includes('BUILD SUCCESSFUL in 1.48s')
      };
    })()`);
    record('CLI Command Outputs: metrics, whoami, adb, gradle', extraCommandsOutput.hasMetrics && extraCommandsOutput.hasWhoami && extraCommandsOutput.hasAdb && extraCommandsOutput.hasGradle);

    // Command: clear
    await runCliCommand('clear');
    await new Promise((r) => setTimeout(r, 200));
    const clearedCli = await evaluate(`(() => {
      const text = document.querySelector('aside[aria-label="Developer Telemetry Panel"] .flex-1.overflow-y-auto')?.innerText || '';
      return text.trim() === '';
    })()`);
    record('CLI Command: "clear" Clears Terminal Content', clearedCli);

    await checkConsoleCleanliness('After Terminal & CLI Operations');

    // ==========================================
    // 6. SKILLS CATEGORY FILTER CHIPS
    // ==========================================
    console.log('\n--- TEST 6: Material 3 Skills Filter Chips ---');
    await evaluate(`(() => {
      const el = document.querySelector("#skills");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    async function filterSkillsCategory(catName) {
      return await evaluate(`(() => {
        const chips = Array.from(document.querySelectorAll('#skills [role="tab"]'));
        const target = chips.find(c => c.innerText.includes(${JSON.stringify(catName)}));
        if (!target) return { ok: false, error: 'Chip not found' };
        target.click();
        return { ok: true };
      })()`);
    }

    // Filter: Core Android & UI
    await filterSkillsCategory('Core Android & UI');
    await new Promise((r) => setTimeout(r, 200));
    const coreCount = await evaluate(`document.querySelectorAll('#skills .dynamic-content-container .grid > div').length`);
    record('Skills Filter: "Core Android & UI" displays 1 category', coreCount === 1, `count: ${coreCount}`);

    // Filter: Architecture & Data
    await filterSkillsCategory('Architecture & Data');
    await new Promise((r) => setTimeout(r, 200));
    const archCount = await evaluate(`document.querySelectorAll('#skills .dynamic-content-container .grid > div').length`);
    record('Skills Filter: "Architecture & Data" displays 1 category', archCount === 1, `count: ${archCount}`);

    // Filter: Tooling & Release
    await filterSkillsCategory('Tooling & Release');
    await new Promise((r) => setTimeout(r, 200));
    const toolCount = await evaluate(`document.querySelectorAll('#skills .dynamic-content-container .grid > div').length`);
    record('Skills Filter: "Tooling & Release" displays 1 category', toolCount === 1, `count: ${toolCount}`);

    // Filter: AI & Systems
    await filterSkillsCategory('AI & Systems');
    await new Promise((r) => setTimeout(r, 200));
    const aiCount = await evaluate(`document.querySelectorAll('#skills .dynamic-content-container .grid > div').length`);
    record('Skills Filter: "AI & Systems" displays 1 category', aiCount === 1, `count: ${aiCount}`);

    // Filter: All -> Displays 4 categories
    await filterSkillsCategory('All');
    await new Promise((r) => setTimeout(r, 200));
    const allCount = await evaluate(`document.querySelectorAll('#skills .dynamic-content-container .grid > div').length`);
    record('Skills Filter: "All" displays 4 categories', allCount === 4, `count: ${allCount}`);

    // Check senior competencies content
    const seniorSkillsContent = await evaluate(`(() => {
      const text = document.getElementById('skills')?.innerText || '';
      return {
        hasPerfetto: text.includes('Systrace & Perfetto'),
        hasProfiler: text.includes('Memory Profiler'),
        hasKmp: text.includes('Kotlin Multiplatform (KMP)'),
        hasWal: text.includes('WAL mode'),
        hasR8: text.includes('R8 ProGuard full-mode')
      };
    })()`);
    record('Skills: Senior Android Competencies Present', seniorSkillsContent.hasPerfetto && seniorSkillsContent.hasProfiler && seniorSkillsContent.hasKmp && seniorSkillsContent.hasWal && seniorSkillsContent.hasR8);

    // ==========================================
    // 7. MOBILE 390px RESPONSIVE ERGONOMICS
    // ==========================================
    console.log('\n--- TEST 7: Mobile 390px Viewport Ergonomics ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 400));

    const mobileTerminalState = await evaluate(`(() => {
      const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
      if (!panel) return { open: false, hasDragPill: false, scrollWidth: 999 };
      const dragPill = Array.from(panel.querySelectorAll('div')).find(d => d.className.includes('w-10') && d.className.includes('rounded-full'));
      const scrollWidth = document.documentElement.scrollWidth;
      return {
        open: true,
        hasDragPill: !!dragPill,
        scrollWidth
      };
    })()`);

    record('Mobile Terminal Has Mobile Drag Pill', mobileTerminalState.hasDragPill);
    record('Mobile Terminal Fits 390px Viewport without Overflow', mobileTerminalState.scrollWidth <= 390, `scrollWidth: ${mobileTerminalState.scrollWidth}px`);

    // Minimize mobile terminal
    await evaluate(`(() => {
      const minBtn = document.querySelector('button[aria-label="Minimize console"]');
      if (minBtn) minBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));

    const mobilePostCloseOverflow = await evaluate(`document.documentElement.scrollWidth <= 390`);
    record('Mobile Post-Terminal Overflow Check (<=390px)', mobilePostCloseOverflow);

    // Restore desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await checkConsoleCleanliness('Final State');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('\n==========================================');
    console.log('       M3 EMPIRICAL TEST RUN SUMMARY');
    console.log('==========================================');
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;
    console.log(`Passed: ${passedCount} / ${totalCount} tests`);

    if (passedCount !== totalCount) {
      console.error('FAILED TESTS:');
      testResults.filter((r) => !r.passed).forEach((r) => console.error(` - ${r.name}: ${r.detail}`));
      process.exitCode = 1;
    } else {
      console.log('ALL M3 ADVERSARIAL TESTS PASSED PERFECTLY!');
    }
  } finally {
    if (ws) {
      try {
        ws.close();
      } catch {}
    }
    chromeProcess.kill();
  }
}

runM3AdversarialTest().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
