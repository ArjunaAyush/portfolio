import { spawn } from 'child_process';
import fs from 'fs';

async function runModalStressTest() {
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

  function recordResult(name, passed, detail = '') {
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

    // Wait for page ready
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
    if (!pageLoaded) {
      const diag = await send('Runtime.evaluate', {
        expression: 'JSON.stringify({ readyState: document.readyState, sections: document.querySelectorAll("section").length })',
        returnByValue: true
      });
      throw new Error(`Page failed to load: ${diag.result?.value}`);
    }

    // Grant clipboard permissions or hook navigator.clipboard
    await send('Browser.grantPermissions', {
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    }).catch(() => {});

    // Spy on clipboard to capture written text faithfully
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.__copiedText = null;
        if (!navigator.clipboard) {
          navigator.clipboard = {};
        }
        const originalWrite = navigator.clipboard.writeText;
        navigator.clipboard.writeText = async (text) => {
          window.__copiedText = text;
          if (originalWrite) return originalWrite.call(navigator.clipboard, text);
        };
      })()`,
    });

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

    async function checkConsoleErrors(stage) {
      const errs = await evaluate('window.__consoleErrors');
      if (!Array.isArray(errs)) {
        throw new Error(`Console errors object invalid at stage ${stage}: ${errs}`);
      }
      if (errs.length > 0) {
        recordResult(`Console Cleanliness @ ${stage}`, false, `${errs.length} errors: ${JSON.stringify(errs)}`);
        return false;
      }
      recordResult(`Console Cleanliness @ ${stage}`, true, '0 errors');
      return true;
    }

    await checkConsoleErrors('Initial Page Load');

    // Scroll to projects section
    await evaluate(`(() => {
      const el = document.querySelector("#projects");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    // ==========================================
    // TEST 1: LOOPLY MODAL, TABS, COPY & CLOSE BUTTON
    // ==========================================
    console.log('\n--- TEST 1: Looply Modal & Close Button ---');
    const looplyOpenRes = await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label="Open architecture and tech specs for Looply"]');
      if (!btn) return { ok: false, error: 'Looply trigger button not found' };
      btn.click();
      return { ok: true };
    })()`);
    recordResult('Open Looply Modal Click', looplyOpenRes.ok, looplyOpenRes.error || 'Trigger clicked');

    await new Promise((r) => setTimeout(r, 300));

    // Check modal open and title
    const looplyModalState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!dialog) return { open: false };
      const title = document.getElementById('project-modal-title')?.innerText?.trim();
      const bodyOverflow = document.body.style.overflow;
      return { open: true, title, bodyOverflow };
    })()`);
    recordResult('Looply Modal Opened in DOM', looplyModalState.open && looplyModalState.title === 'Looply', `Title: ${looplyModalState.title}`);
    recordResult('Body Scroll Locked (overflow: hidden)', looplyModalState.bodyOverflow === 'hidden', `overflow: ${looplyModalState.bodyOverflow}`);

    // Check Tab 1: Architecture content
    const archContent = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasArchitecture: bodyText.includes('Clean Architecture + MVI') || bodyText.includes('Clean Architecture'),
        hasPresentation: bodyText.includes('Presentation Layer') && bodyText.includes('Jetpack Compose'),
        hasDomain: bodyText.includes('Domain Layer') && bodyText.includes('UseCases'),
        hasData: bodyText.includes('Data Layer') && bodyText.includes('Media3')
      };
    })()`);
    recordResult('Tab 1: Architecture Content Displayed', archContent.hasArchitecture && archContent.hasPresentation && archContent.hasData, 'Layers verified');

    // Click Tab 2: Telemetry & Benchmarks
    const telemetryTabClick = await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const telTab = tabs.find(b => b.innerText.includes('Telemetry & Benchmarks'));
      if (!telTab) return false;
      telTab.click();
      return true;
    })()`);
    recordResult('Click Tab 2 (Telemetry & Benchmarks)', telemetryTabClick);
    await new Promise((r) => setTimeout(r, 200));

    const telemetryContent = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasStartup: bodyText.includes('412 ms TTID'),
        hasJank: bodyText.includes('< 0.16% (120 FPS)'),
        hasPss: bodyText.includes('48 MB PSS'),
        hasApk: bodyText.includes('8.2 MB')
      };
    })()`);
    recordResult('Tab 2: Telemetry & KPI Metrics', telemetryContent.hasStartup && telemetryContent.hasJank && telemetryContent.hasPss && telemetryContent.hasApk, '412ms TTID, <0.16% Jank, 48MB PSS, 8.2MB APK');

    // Click Tab 3: Engineering Challenges
    const challengesTabClick = await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const chTab = tabs.find(b => b.innerText.includes('Engineering Challenges'));
      if (!chTab) return false;
      chTab.click();
      return true;
    })()`);
    recordResult('Click Tab 3 (Engineering Challenges)', challengesTabClick);
    await new Promise((r) => setTimeout(r, 200));

    const challengesContent = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasChallenge1: bodyText.includes('MediaCodec Surface Recycling'),
        hasChallenge2: bodyText.includes('Cold Startup Latency with Jetpack Compose')
      };
    })()`);
    recordResult('Tab 3: Real Engineering Challenges Breakdown', challengesContent.hasChallenge1 && challengesContent.hasChallenge2, 'MediaCodec & Baseline Profiles verified');

    // Test Copy Clone Command
    const copyClick = await evaluate(`(() => {
      const copyBtn = document.querySelector('button[aria-label="Copy Git clone command to clipboard"]');
      if (!copyBtn) return { ok: false, error: 'Copy button missing' };
      copyBtn.click();
      return { ok: true };
    })()`);
    recordResult('Click "Copy Clone Command"', copyClick.ok);
    await new Promise((r) => setTimeout(r, 300));

    const copyFeedback = await evaluate(`(() => {
      const copyBtn = document.querySelector('button[aria-label="Copy Git clone command to clipboard"]');
      const text = copyBtn?.innerText || '';
      const copiedText = window.__copiedText;
      return {
        hasCopiedLabel: text.includes('Copied clone command'),
        copiedText
      };
    })()`);
    recordResult('Copy Visual Feedback ("✓ Copied clone command")', copyFeedback.hasCopiedLabel);
    recordResult('Copied Clone String Correctness', copyFeedback.copiedText === 'git clone https://github.com/ArjunaAyush/Looply.git', copyFeedback.copiedText);

    // Dismissal 1: Close Button Click
    const closeBtnClick = await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close project specifications modal"]');
      if (!closeBtn) return false;
      closeBtn.click();
      return true;
    })()`);
    recordResult('Click Close Button', closeBtnClick);
    await new Promise((r) => setTimeout(r, 300));

    const looplyClosedState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const bodyOverflow = document.body.style.overflow;
      return { closed: !dialog, bodyOverflow };
    })()`);
    recordResult('Modal Dismissed via Close Button', looplyClosedState.closed);
    recordResult('Body Scroll Restored after Close Button', looplyClosedState.bodyOverflow !== 'hidden', `overflow: "${looplyClosedState.bodyOverflow}"`);

    await checkConsoleErrors('After Looply Modal Flow');

    // ==========================================
    // TEST 2: STATSYNC MODAL, TABS, COPY & ESCAPE KEY
    // ==========================================
    console.log('\n--- TEST 2: StatSync Modal & Escape Key ---');
    const statSyncOpenRes = await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label="Open architecture and tech specs for StatSync"]');
      if (!btn) return { ok: false, error: 'StatSync trigger button not found' };
      btn.click();
      return { ok: true };
    })()`);
    recordResult('Open StatSync Modal Click', statSyncOpenRes.ok);
    await new Promise((r) => setTimeout(r, 300));

    const statSyncModalState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!dialog) return { open: false };
      const title = document.getElementById('project-modal-title')?.innerText?.trim();
      return { open: true, title };
    })()`);
    recordResult('StatSync Modal Opened in DOM', statSyncModalState.open && statSyncModalState.title === 'StatSync', `Title: ${statSyncModalState.title}`);

    // Switch to Telemetry tab for StatSync
    await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const telTab = tabs.find(b => b.innerText.includes('Telemetry & Benchmarks'));
      if (telTab) telTab.click();
    })()`);
    await new Promise((r) => setTimeout(r, 200));

    const statSyncTelemetry = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasStartup: bodyText.includes('365 ms TTID'),
        hasJank: bodyText.includes('< 0.12% (120 FPS)'),
        hasPss: bodyText.includes('42 MB PSS'),
        hasApk: bodyText.includes('6.4 MB')
      };
    })()`);
    recordResult('StatSync Telemetry Tab Verification', statSyncTelemetry.hasStartup && statSyncTelemetry.hasJank && statSyncTelemetry.hasPss && statSyncTelemetry.hasApk, '365ms TTID, <0.12% Jank, 42MB PSS, 6.4MB APK');

    // Switch to Challenges tab for StatSync
    await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const chTab = tabs.find(b => b.innerText.includes('Engineering Challenges'));
      if (chTab) chTab.click();
    })()`);
    await new Promise((r) => setTimeout(r, 200));

    const statSyncChallenges = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasChallenge1: bodyText.includes('SQLite Vector Clocks'),
        hasChallenge2: bodyText.includes('Android 14/15 Doze Mode')
      };
    })()`);
    recordResult('StatSync Challenges Tab Verification', statSyncChallenges.hasChallenge1 && statSyncChallenges.hasChallenge2, 'Vector clocks & Doze mode verified');

    // Copy Clone Command for StatSync
    await evaluate(`(() => {
      const copyBtn = document.querySelector('button[aria-label="Copy Git clone command to clipboard"]');
      if (copyBtn) copyBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));
    const statSyncCopyText = await evaluate(`window.__copiedText`);
    recordResult('StatSync Copied Clone String Correctness', statSyncCopyText === 'git clone https://github.com/ArjunaAyush/StatSync.git', statSyncCopyText);

    // Dismissal 2: Escape Key
    console.log('Dispatching Escape key press via CDP...');
    await send('Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      windowsVirtualKeyCode: 27,
      code: 'Escape',
      key: 'Escape',
    });
    await send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      windowsVirtualKeyCode: 27,
      code: 'Escape',
      key: 'Escape',
    });
    await new Promise((r) => setTimeout(r, 300));

    const statSyncClosedState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const bodyOverflow = document.body.style.overflow;
      return { closed: !dialog, bodyOverflow };
    })()`);
    recordResult('Modal Dismissed via Escape Key', statSyncClosedState.closed);
    recordResult('Body Scroll Restored after Escape Key', statSyncClosedState.bodyOverflow !== 'hidden', `overflow: "${statSyncClosedState.bodyOverflow}"`);

    await checkConsoleErrors('After StatSync Modal Flow');

    // ==========================================
    // TEST 3: AMUROT MODAL, TABS, COPY & BACKDROP CLICK
    // ==========================================
    console.log('\n--- TEST 3: Amurot Modal & Backdrop Click ---');
    const amurotOpenRes = await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label="Open architecture and tech specs for Amurot Open Source Hub"]');
      if (!btn) return { ok: false, error: 'Amurot trigger button not found' };
      btn.click();
      return { ok: true };
    })()`);
    recordResult('Open Amurot Modal Click', amurotOpenRes.ok);
    await new Promise((r) => setTimeout(r, 300));

    const amurotModalState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!dialog) return { open: false };
      const title = document.getElementById('project-modal-title')?.innerText?.trim();
      return { open: true, title };
    })()`);
    recordResult('Amurot Modal Opened in DOM', amurotModalState.open && amurotModalState.title.includes('Amurot'), `Title: ${amurotModalState.title}`);

    // Switch to Telemetry tab for Amurot
    await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const telTab = tabs.find(b => b.innerText.includes('Telemetry & Benchmarks'));
      if (telTab) telTab.click();
    })()`);
    await new Promise((r) => setTimeout(r, 200));

    const amurotTelemetry = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasStartup: bodyText.includes('390 ms TTID'),
        hasJank: bodyText.includes('< 0.14% (120 FPS)'),
        hasPss: bodyText.includes('36 MB PSS'),
        hasApk: bodyText.includes('5.1 MB')
      };
    })()`);
    recordResult('Amurot Telemetry Tab Verification', amurotTelemetry.hasStartup && amurotTelemetry.hasJank && amurotTelemetry.hasPss && amurotTelemetry.hasApk, '390ms TTID, <0.14% Jank, 36MB PSS, 5.1MB APK');

    // Switch to Challenges tab for Amurot
    await evaluate(`(() => {
      const tabs = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const chTab = tabs.find(b => b.innerText.includes('Engineering Challenges'));
      if (chTab) chTab.click();
    })()`);
    await new Promise((r) => setTimeout(r, 200));

    const amurotChallenges = await evaluate(`(() => {
      const bodyText = document.querySelector('[role="dialog"] .overflow-y-auto')?.innerText || '';
      return {
        hasChallenge1: bodyText.includes('Gradle Configuration Cache'),
        hasChallenge2: bodyText.includes('Multi-Module Clean Dependency Boundaries')
      };
    })()`);
    recordResult('Amurot Challenges Tab Verification', amurotChallenges.hasChallenge1 && amurotChallenges.hasChallenge2, 'Gradle cache & clean boundaries verified');

    // Copy Clone Command for Amurot
    await evaluate(`(() => {
      const copyBtn = document.querySelector('button[aria-label="Copy Git clone command to clipboard"]');
      if (copyBtn) copyBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));
    const amurotCopyText = await evaluate(`window.__copiedText`);
    recordResult('Amurot Copied Clone String Correctness', amurotCopyText === 'git clone https://github.com/ArjunaAyush/AmurotOpenSource.git', amurotCopyText);

    // Dismissal 3: Backdrop Click
    // Backdrop is the outer [role="dialog"] container outside the inner content box
    const backdropClickRes = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return false;
      // Click directly on the backdrop element
      dialog.click();
      return true;
    })()`);
    recordResult('Click Backdrop Overlay', backdropClickRes);
    await new Promise((r) => setTimeout(r, 300));

    const amurotClosedState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const bodyOverflow = document.body.style.overflow;
      return { closed: !dialog, bodyOverflow };
    })()`);
    recordResult('Modal Dismissed via Backdrop Click', amurotClosedState.closed);
    recordResult('Body Scroll Restored after Backdrop Click', amurotClosedState.bodyOverflow !== 'hidden', `overflow: "${amurotClosedState.bodyOverflow}"`);

    await checkConsoleErrors('After Amurot Modal Flow');

    // ==========================================
    // TEST 4: MOBILE VIEWPORT & TOUCH ISOLATION (390x844)
    // ==========================================
    console.log('\n--- TEST 4: Mobile Viewport (390x844) & Touch Event Isolation ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Scroll to projects and open Looply modal on mobile
    await evaluate(`(() => {
      const el = document.querySelector("#projects");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label="Open architecture and tech specs for Looply"]');
      if (btn) {
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        btn.click();
      }
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    const mobileModalInfo = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const dragIndicator = dialog ? Array.from(dialog.querySelectorAll('div')).find(d => d.className.includes('w-12') && d.className.includes('rounded-full')) : null;
      const scrollWidth = document.documentElement.scrollWidth;
      return {
        open: !!dialog,
        hasDragIndicator: !!dragIndicator,
        scrollWidth
      };
    })()`);
    recordResult('Mobile Bottom-Sheet Open', mobileModalInfo?.open);
    recordResult('Mobile Drag Pill Indicator Rendered', mobileModalInfo?.hasDragIndicator);
    recordResult('Mobile Modal Horizontal Overflow Check (<=390px)', mobileModalInfo ? mobileModalInfo.scrollWidth <= 390 : false, `scrollWidth: ${mobileModalInfo?.scrollWidth}px`);

    // Close modal on mobile
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close project specifications modal"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 300));

    const mobilePostCloseOverflow = await evaluate(`document.documentElement.scrollWidth <= 390`);
    recordResult('Mobile Post-Modal Overflow Check (<=390px)', mobilePostCloseOverflow);

    // Restore desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await checkConsoleErrors('Final State');

    // ==========================================
    // SUMMARY REPORT
    // ==========================================
    console.log('\n==========================================');
    console.log('       EMPIRICAL TEST RUN SUMMARY');
    console.log('==========================================');
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;
    console.log(`Passed: ${passedCount} / ${totalCount} tests`);

    if (passedCount !== totalCount) {
      console.error('FAILED TESTS:');
      testResults.filter((r) => !r.passed).forEach((r) => console.error(` - ${r.name}: ${r.detail}`));
      process.exitCode = 1;
    } else {
      console.log('ALL EMPIRICAL TESTS PASSED PERFECTLY!');
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

runModalStressTest().catch((err) => {
  console.error('Stress test harness failure:', err);
  process.exit(1);
});
