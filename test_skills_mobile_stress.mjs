import { spawn } from 'child_process';

async function runEmpiricalStressTests() {
  const chromePath =
    process.env.CHROME_PATH ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const port = 9226;
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
    // 1. Connect to Chrome CDP
    await new Promise((r) => setTimeout(r, 1200));

    let versionData;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 300));
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

    console.log('--- NAVIGATING TO http://localhost:5173 ---');
    await send('Page.navigate', { url: 'http://localhost:5173' });

    // Wait for page to be ready
    let ready = false;
    for (let i = 0; i < 40; i++) {
      const { result } = await send('Runtime.evaluate', {
        expression: 'document.readyState === "complete" && document.querySelectorAll("section").length >= 5',
        returnByValue: true,
      });
      if (result && result.value) {
        ready = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    record('Page Ready & Sections Mounted', ready, 'Found 5+ sections');

    await new Promise((r) => setTimeout(r, 2000));

    // =========================================================================
    // SUITE 1: SKILLS CATEGORY FILTERING & LAYOUT STABILITY
    // =========================================================================
    console.log('\n--- SUITE 1: SKILLS CATEGORY FILTERING & LAYOUT STABILITY ---');

    // Scroll to #skills
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelector("#skills");
        if (s) s.scrollIntoView({ behavior: "instant" });
      })()`,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Check all 5 filter chips exist
    const { result: chipsInfo } = await send('Runtime.evaluate', {
      expression: `(() => {
        const chips = Array.from(document.querySelectorAll('#skills button[role="tab"]'));
        return {
          count: chips.length,
          labels: chips.map(c => c.textContent.trim())
        };
      })()`,
      returnByValue: true,
    });
    record(
      'Skills Filter Chips Mounted',
      chipsInfo.value?.count === 5,
      `Labels: ${JSON.stringify(chipsInfo.value?.labels)}`
    );

    const categoriesToTest = [
      {
        name: 'All',
        expectedGroupCount: 4,
        expectedSkills: ['Kotlin 2.x', 'Kotlin Multiplatform (KMP)', 'Code Shrinking & R8', 'UI/UX Design Engineering'],
      },
      {
        name: 'Core Android & UI',
        expectedGroupCount: 1,
        expectedSkills: ['Kotlin 2.x', 'Jetpack Compose', 'Performance & Profiling', 'Android Studio IDE & Tools', 'Java & Platform Interop'],
      },
      {
        name: 'Architecture & Data',
        expectedGroupCount: 1,
        expectedSkills: ['Architecture & Lifecycle', 'Kotlin Multiplatform (KMP)', 'Room SQLite', 'AndroidX Media3', 'Firebase Cloud Platform'],
      },
      {
        name: 'Tooling & Release',
        expectedGroupCount: 1,
        expectedSkills: ['Tooling & Build Automation', 'Code Shrinking & R8', 'GitHub Actions & CI/CD', 'Git Version Control'],
      },
      {
        name: 'AI & Systems',
        expectedGroupCount: 1,
        expectedSkills: ['UI/UX Design Engineering', 'AI-Integrated Mobile Workflows', 'Figma to Compose'],
      },
      {
        name: 'All',
        expectedGroupCount: 4,
        expectedSkills: ['Kotlin 2.x', 'Room SQLite', 'GitHub Actions & CI/CD', 'AI-Integrated Mobile Workflows'],
      },
    ];

    for (const testCase of categoriesToTest) {
      // 1. Click target filter chip
      await send('Runtime.evaluate', {
        expression: `(() => {
          const chips = Array.from(document.querySelectorAll('#skills button[role="tab"]'));
          const target = chips.find(c => c.textContent.includes("${testCase.name}"));
          if (target) target.click();
        })()`,
      });

      // Wait 150ms for React re-render
      await new Promise((r) => setTimeout(r, 150));

      // 2. Query state after render
      const { result: stateRes } = await send('Runtime.evaluate', {
        expression: `(() => {
          const chips = Array.from(document.querySelectorAll('#skills button[role="tab"]'));
          const target = chips.find(c => c.textContent.includes("${testCase.name}"));
          const isSelected = target ? target.getAttribute('aria-selected') === 'true' : false;

          const groups = Array.from(document.querySelectorAll('#skills .grid > div'));
          const groupTitles = groups.map(g => {
            const h3 = g.querySelector('h3');
            return h3 ? h3.textContent.trim() : '';
          });

          const skillElements = Array.from(document.querySelectorAll('#skills .space-y-3 > div'));
          const skillNames = skillElements.map(s => {
            const span = s.querySelector('.text-sm');
            return span ? span.textContent.trim() : '';
          });

          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;

          return {
            targetFound: !!target,
            isSelected,
            groupCount: groups.length,
            groupTitles,
            skillCount: skillNames.length,
            skillNames,
            hasHorizontalOverflow: scrollWidth > clientWidth,
            scrollWidth,
            clientWidth
          };
        })()`,
        returnByValue: true,
      });

      const res = stateRes.value;
      const groupsOk = res.groupCount === testCase.expectedGroupCount;
      const skillsMatch = testCase.expectedSkills.every(s =>
        res.skillNames.some(sn => sn.includes(s))
      );
      const noOverflow = !res.hasHorizontalOverflow;
      const selectedOk = res.isSelected;

      record(
        `Filter Chip Click: "${testCase.name}"`,
        groupsOk && skillsMatch && noOverflow && selectedOk,
        `Groups: ${res.groupCount}/${testCase.expectedGroupCount}, Skills: ${res.skillCount}, Overflow: ${res.hasHorizontalOverflow}`
      );
    }

    // Rapid toggle stress test (20 clicks, 50ms interval)
    const { result: rapidStressResult } = await send('Runtime.evaluate', {
      expression: `(async () => {
        const chips = Array.from(document.querySelectorAll('#skills button[role="tab"]'));
        const labels = ['Core Android & UI', 'Architecture & Data', 'Tooling & Release', 'AI & Systems', 'All'];
        for (let i = 0; i < 20; i++) {
          const label = labels[i % labels.length];
          const chip = chips.find(c => c.textContent.includes(label));
          if (chip) chip.click();
          await new Promise(r => setTimeout(r, 50));
        }
        await new Promise(r => setTimeout(r, 200));
        return {
          finalScrollWidth: document.documentElement.scrollWidth,
          finalClientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          activeGroupCount: document.querySelectorAll('#skills .grid > div').length
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    record(
      'Skills Rapid Filter Stress (20 iterations)',
      !rapidStressResult.value.hasHorizontalOverflow && rapidStressResult.value.activeGroupCount === 4,
      `Final groups: ${rapidStressResult.value.activeGroupCount}, Overflow: ${rapidStressResult.value.hasHorizontalOverflow}`
    );

    // =========================================================================
    // SUITE 2: MOBILE 390PX VIEWPORT ERGONOMICS & DEVTERMINAL
    // =========================================================================
    console.log('\n--- SUITE 2: MOBILE 390PX ERGONOMICS & DEVTERMINAL ---');

    // Switch to 390x844 mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      hasTouch: true,
    });
    await new Promise((r) => setTimeout(r, 500));

    // Measure page scrollWidth at 390px
    const { result: mobilePageOverflow } = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > 390
      })`,
      returnByValue: true,
    });
    const pageMetrics = JSON.parse(mobilePageOverflow.value);
    record(
      'Mobile 390px Page Overflow Check',
      !pageMetrics.hasOverflow && pageMetrics.scrollWidth <= 390,
      `scrollWidth=${pageMetrics.scrollWidth}px, innerWidth=390px`
    );

    // Check DevTerminal floating trigger button before open
    const { result: triggerBtnMetrics } = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('aside[aria-label="Developer Telemetry Console"] button');
        if (!btn) return { found: false };
        const rect = btn.getBoundingClientRect();
        return {
          found: true,
          width: parseFloat(rect.width.toFixed(1)),
          height: parseFloat(rect.height.toFixed(1)),
          top: parseFloat(rect.top.toFixed(1)),
          left: parseFloat(rect.left.toFixed(1)),
          isAtLeast48: rect.height >= 48
        };
      })()`,
      returnByValue: true,
    });
    const trigger = triggerBtnMetrics.value;
    record(
      'DevTerminal Floating Trigger Target Size >= 48px',
      trigger.found && trigger.isAtLeast48,
      `width=${trigger.width}px, height=${trigger.height}px (>=48px: ${trigger.isAtLeast48})`
    );

    // Click trigger to open DevTerminal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('aside[aria-label="Developer Telemetry Console"] button');
        if (btn) btn.click();
      })()`,
    });
    // Wait for panel animation
    await new Promise((r) => setTimeout(r, 600));

    // Verify DevTerminal panel structure on mobile 390px
    const { result: panelEval } = await send('Runtime.evaluate', {
      expression: `(() => {
        const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
        if (!panel) return { found: false, error: 'Panel not found in DOM' };
        const rect = panel.getBoundingClientRect();
        const styles = window.getComputedStyle(panel);
        
        // Find drag pill (sm:hidden pt-2 pb-1 shrink-0 flex justify-center bg-black/40)
        const pillDiv = panel.querySelector('[aria-hidden="true"]');
        const pillRect = pillDiv ? pillDiv.getBoundingClientRect() : null;

        const docScrollWidth = document.documentElement.scrollWidth;

        return {
          found: true,
          width: parseFloat(rect.width.toFixed(1)),
          height: parseFloat(rect.height.toFixed(1)),
          bottom: parseFloat(rect.bottom.toFixed(1)),
          left: parseFloat(rect.left.toFixed(1)),
          position: styles.position,
          hasDragPill: !!pillDiv,
          pillWidth: pillRect ? parseFloat(pillRect.width.toFixed(1)) : 0,
          pillHeight: pillRect ? parseFloat(pillRect.height.toFixed(1)) : 0,
          docScrollWidth,
          isDockedBottom: Math.abs(rect.bottom - window.innerHeight) <= 2,
          isFullWidth: Math.abs(rect.width - 390) <= 2,
          noDocOverflow: docScrollWidth <= 390
        };
      })()`,
      returnByValue: true,
    });

    const panel = panelEval.value;
    record(
      'DevTerminal Mobile Bottom Sheet Docked',
      panel.found && panel.isDockedBottom && panel.isFullWidth,
      `width=${panel.width}px, bottom=${panel.bottom}px (vh: 844)`
    );
    record(
      'DevTerminal Mobile Drag Pill Present & Visible',
      panel.hasDragPill && panel.pillWidth > 0 && panel.pillHeight > 0,
      `Pill dims: ${panel.pillWidth}x${panel.pillHeight}px`
    );
    record(
      'DevTerminal Open Zero Horizontal Overflow (scrollWidth <= 390)',
      panel.noDocOverflow,
      `docScrollWidth=${panel.docScrollWidth}px`
    );

    // Measure all interactive touch targets inside open DevTerminal
    const { result: touchTargetsRes } = await send('Runtime.evaluate', {
      expression: `(() => {
        const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
        if (!panel) return [];
        const interactiveElements = Array.from(panel.querySelectorAll('button, input, [role="tab"]'));
        return interactiveElements.map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim().slice(0, 20),
            label: el.getAttribute('aria-label') || el.getAttribute('title') || '',
            width: parseFloat(rect.width.toFixed(1)),
            height: parseFloat(rect.height.toFixed(1)),
            isAtLeast48Height: rect.height >= 48,
            isAtLeast36Height: rect.height >= 36,
            isAtLeast32Height: rect.height >= 32
          };
        });
      })()`,
      returnByValue: true,
    });

    console.log('\nDevTerminal Mobile Touch Targets Audit:');
    touchTargetsRes.value.forEach(t => {
      console.log(`  - [${t.label || t.text}]: ${t.width}x${t.height}px (>=48h: ${t.isAtLeast48Height}, >=36h: ${t.isAtLeast36Height})`);
    });

    // Check tabs in DevTerminal: Logcat, Telemetry, CLI
    const { result: tabsSwitchRes } = await send('Runtime.evaluate', {
      expression: `(async () => {
        const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
        const buttons = Array.from(panel.querySelectorAll('button'));
        const telemetryBtn = buttons.find(b => b.textContent.includes('Telemetry'));
        if (telemetryBtn) telemetryBtn.click();
        await new Promise(r => setTimeout(r, 150));
        const hasHeap = !!panel.textContent.includes('JVM Heap');
        
        const cliBtn = buttons.find(b => b.textContent.includes('Interactive CLI'));
        if (cliBtn) cliBtn.click();
        await new Promise(r => setTimeout(r, 150));
        const input = panel.querySelector('input');
        const hasCli = !!input;

        // Test CLI inspect looply
        if (input) {
          const prototypeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          prototypeSetter.call(input, 'inspect looply');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, 50));
          const form = panel.querySelector('form');
          if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
            else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }

        await new Promise(r => setTimeout(r, 300));
        const modal = document.querySelector('div[role="dialog"][aria-modal="true"]');
        const modalVisible = !!modal;
        const modalTitle = modal ? (modal.querySelector('h2')?.textContent || modal.querySelector('#project-modal-title')?.textContent || '') : '';

        // Close modal
        if (modal) {
          const closeBtn = modal.querySelector('button[aria-label="Close dialog"]');
          if (closeBtn) closeBtn.click();
        }

        return { hasHeap, hasCli, modalVisible, modalTitle };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    record(
      'DevTerminal CLI "inspect looply" triggers ProjectModal',
      tabsSwitchRes.value.modalVisible && tabsSwitchRes.value.modalTitle?.toLowerCase().includes('looply'),
      `Modal Title: "${tabsSwitchRes.value.modalTitle}"`
    );
    record(
      'DevTerminal Tab Switching (Logcat -> Telemetry -> CLI)',
      tabsSwitchRes.value.hasHeap && tabsSwitchRes.value.hasCli,
      `Telemetry loaded: ${tabsSwitchRes.value.hasHeap}, CLI loaded: ${tabsSwitchRes.value.hasCli}`
    );

    // =========================================================================
    // SUITE 3: TOUCH EVENT ISOLATION & VIDEO SCRUBBING
    // =========================================================================
    console.log('\n--- SUITE 3: TOUCH EVENT ISOLATION & VIDEO SCRUBBING ---');

    // Test 3.1: Video scrubbing baseline outside DevTerminal
    // Close DevTerminal first
    await send('Runtime.evaluate', {
      expression: `(() => {
        const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
        if (panel) {
          const closeBtn = panel.querySelector('button[aria-label="Close console"]');
          if (closeBtn) closeBtn.click();
        }
      })()`,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Dispatch touch sequence outside DevTerminal (on window/body)
    const { result: baselineScrubRes } = await send('Runtime.evaluate', {
      expression: `(() => {
        const video = document.querySelector('video');
        if (!video) return { error: 'No video element' };
        
        let moveReceivedOnWindow = false;
        const spy = () => { moveReceivedOnWindow = true; };
        window.addEventListener('touchmove', spy, { passive: true, once: true });

        const initialTime = video.currentTime;

        // Dispatch touchstart at clientX: 50
        const touchStart = new Touch({
          identifier: 101,
          target: document.body,
          clientX: 50,
          clientY: 300,
        });
        window.dispatchEvent(new TouchEvent('touchstart', {
          touches: [touchStart],
          targetTouches: [touchStart],
          changedTouches: [touchStart],
          bubbles: true,
          cancelable: true
        }));

        // Dispatch touchmove at clientX: 200 (delta = +150px)
        const touchMove = new Touch({
          identifier: 101,
          target: document.body,
          clientX: 200,
          clientY: 300,
        });
        window.dispatchEvent(new TouchEvent('touchmove', {
          touches: [touchMove],
          targetTouches: [touchMove],
          changedTouches: [touchMove],
          bubbles: true,
          cancelable: true
        }));

        const timeAfter = video.currentTime;

        window.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          targetTouches: [],
          changedTouches: [touchMove],
          bubbles: true,
          cancelable: true
        }));

        return {
          moveReceivedOnWindow,
          initialTime,
          timeAfter
        };
      })()`,
      returnByValue: true,
    });
    record(
      'Baseline Window Touchmove Received Outside Terminal',
      baselineScrubRes.value.moveReceivedOnWindow,
      `initialTime=${baselineScrubRes.value.initialTime?.toFixed(3)}s, after=${baselineScrubRes.value.timeAfter?.toFixed(3)}s`
    );

    // Reopen DevTerminal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const trigger = document.querySelector('aside[aria-label="Developer Telemetry Console"] button');
        if (trigger) trigger.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test 3.2: Touch move INSIDE open DevTerminal
    // Must NOT reach window touchmove listener due to onTouchMove stopPropagation
    const { result: isolationRes } = await send('Runtime.evaluate', {
      expression: `(() => {
        const video = document.querySelector('video');
        const panel = document.querySelector('aside[aria-label="Developer Telemetry Panel"]');
        if (!panel || !video) return { error: 'Panel or video not found' };

        let windowReceivedTouchMove = false;
        const windowSpy = () => { windowReceivedTouchMove = true; };
        window.addEventListener('touchmove', windowSpy);

        const timeBefore = video.currentTime;

        // Target an inner element inside DevTerminal (e.g. logcat list or form)
        const innerTarget = panel.querySelector('form') || panel.firstElementChild;

        const touchStart = new Touch({
          identifier: 202,
          target: innerTarget,
          clientX: 50,
          clientY: 500,
        });
        innerTarget.dispatchEvent(new TouchEvent('touchstart', {
          touches: [touchStart],
          targetTouches: [touchStart],
          changedTouches: [touchStart],
          bubbles: true,
          cancelable: true
        }));

        // Dispatch touchmove with +200px delta
        const touchMove = new Touch({
          identifier: 202,
          target: innerTarget,
          clientX: 250,
          clientY: 500,
        });
        innerTarget.dispatchEvent(new TouchEvent('touchmove', {
          touches: [touchMove],
          targetTouches: [touchMove],
          changedTouches: [touchMove],
          bubbles: true,
          cancelable: true
        }));

        const timeAfter = video.currentTime;

        innerTarget.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          targetTouches: [],
          changedTouches: [touchMove],
          bubbles: true,
          cancelable: true
        }));

        window.removeEventListener('touchmove', windowSpy);

        return {
          windowReceivedTouchMove,
          timeBefore,
          timeAfter,
          videoUntouched: timeBefore === timeAfter
        };
      })()`,
      returnByValue: true,
    });
    const iso = isolationRes.value;
    record(
      'Touch Event Isolation Inside DevTerminal (stopPropagation)',
      !iso.windowReceivedTouchMove && iso.videoUntouched,
      `windowReceivedTouchMove=${iso.windowReceivedTouchMove}, timeBefore=${iso.timeBefore?.toFixed(3)}s, timeAfter=${iso.timeAfter?.toFixed(3)}s`
    );

    // =========================================================================
    // SUITE 4: CONSOLE ERROR & EXCEPTION CHECK
    // =========================================================================
    console.log('\n--- SUITE 4: CONSOLE ERROR & EXCEPTION CHECK ---');
    const { result: consoleErrorsRes } = await send('Runtime.evaluate', {
      expression: 'window.__consoleErrors',
      returnByValue: true,
    });
    const consoleErrors = consoleErrorsRes.value || [];
    record(
      'Zero Console Errors Recorded',
      Array.isArray(consoleErrors) && consoleErrors.length === 0,
      `Errors: ${JSON.stringify(consoleErrors)}`
    );

    // Summary
    console.log('\n======================================================');
    console.log('STRESS TEST SUMMARY');
    console.log('======================================================');
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    console.log(`Passed: ${passedCount} / ${totalCount}`);
    testResults.forEach(r => {
      console.log(`${r.passed ? '  [PASS]' : '  [FAIL]'} ${r.name}`);
    });

  } finally {
    if (ws) {
      try {
        ws.close();
      } catch {}
    }
    chromeProcess.kill();
  }
}

runEmpiricalStressTests().catch(err => {
  console.error('Stress test execution error:', err);
  process.exit(1);
});
