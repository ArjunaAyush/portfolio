import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chromePath =
    process.env.CHROME_PATH ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const chromeProcess = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--disable-background-networking',
    '--disable-extensions',
    '--disable-sync',
  ]);

  let ws = null;

  try {
    // Wait for Chrome CDP to be available
    await new Promise((r) => setTimeout(r, 1500));

    let versionData;
    for (let i = 0; i < 15; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9222/json/version');
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    if (!versionData) {
      throw new Error('Could not connect to Chrome CDP at http://127.0.0.1:9222');
    }

    // Create new target/tab
    const newTargetRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
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

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });

    // Fail-fast connection & loading check: Poll for document readyState and at least 5 sections
    let pageLoaded = false;
    for (let i = 0; i < 30; i++) {
      const { result } = await send('Runtime.evaluate', {
        expression: 'document.querySelectorAll("section").length >= 5',
        returnByValue: true,
      });
      if (result && result.value) {
        pageLoaded = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!pageLoaded) {
      const { result: diagResult } = await send('Runtime.evaluate', {
        expression: `JSON.stringify({
          readyState: document.readyState,
          sectionCount: document.querySelectorAll("section").length,
          title: document.title,
          bodySnippet: document.body ? document.body.innerText.slice(0, 200) : ''
        })`,
        returnByValue: true,
      }).catch(() => ({ result: { value: '{}' } }));

      throw new Error(
        `ERR_CONNECTION_REFUSED or timeout: Portfolio failed to load 5+ sections on http://localhost:5173 within timeout. ` +
        `Diagnostics: ${diagResult?.value || 'unknown'}. Ensure Vite dev server is running on port 5173.`
      );
    }

    const { result: countRes } = await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll("section").length',
      returnByValue: true,
    });
    console.log(`Page loaded successfully with ${countRes?.value || 0} sections.`);

    // Wait for typewriter and initial pills to appear
    await new Promise((r) => setTimeout(r, 2500));

    async function takeScreenshot(path) {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${path}`);
    }

    async function scrollTo(y) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${y}, behavior: 'instant' });`,
      });
      // Wait for damped lerp to interpolate (0.085 factor reaches 99% in ~500ms)
      await new Promise((r) => setTimeout(r, 650));
    }

    async function scrollToSelector(selector) {
      const { result } = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector("${selector}");
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            return true;
          }
          return false;
        })()`,
        returnByValue: true,
      });
      if (!result?.value) {
        throw new Error(`Target section selector "${selector}" not found in DOM`);
      }
      // Wait for damped lerp to interpolate (0.085 factor reaches 99% in ~500ms)
      await new Promise((r) => setTimeout(r, 650));
    }

    const { result: scrollMetrics } = await send('Runtime.evaluate', {
      expression: `JSON.stringify({ scrollHeight: document.documentElement.scrollHeight, innerHeight: window.innerHeight })`,
      returnByValue: true,
    });
    const { scrollHeight, innerHeight } = JSON.parse(scrollMetrics.value);
    console.log(`Page metrics: scrollHeight=${scrollHeight}, innerHeight=${innerHeight}`);

    // Scenario 1: Top (Hero)
    await scrollTo(0);
    await takeScreenshot('/tmp/scenario_1_hero.png');

    // Scenario 2: About (DOM anchor scroll)
    await scrollToSelector('#about');
    await takeScreenshot('/tmp/scenario_2_about.png');

    // Scenario 3: Projects (DOM anchor scroll)
    await scrollToSelector('#projects');
    await takeScreenshot('/tmp/scenario_3_projects.png');

    // Scenario 3.5: Showcase (Horizontal Swiping section)
    await scrollToSelector('#showcase');
    await takeScreenshot('/tmp/scenario_showcase.png');

    // Scenario 4: Skills & Hackathons (DOM anchor scroll)
    await scrollToSelector('#skills');
    await takeScreenshot('/tmp/scenario_4_skills_hackathons.png');

    // Scenario 5: Contact & Footer (DOM anchor scroll)
    await scrollToSelector('#contact');
    await takeScreenshot('/tmp/scenario_5_contact.png');

    // Scenario 6: Scroll back to top
    await scrollToSelector('#hero');
    await takeScreenshot('/tmp/scenario_6_returned_hero.png');

    // Scenario 7: Mobile Viewport (390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await scrollTo(0);
    await new Promise((r) => setTimeout(r, 500));
    await takeScreenshot('/tmp/scenario_7_mobile_hero.png');

    // Mobile horizontal overflow check at hero
    const { result: heroOverflowRes } = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > 390
      })`,
      returnByValue: true,
    });
    const heroOverflow = JSON.parse(heroOverflowRes.value);
    console.log(`Mobile hero overflow check: scrollWidth=${heroOverflow.scrollWidth}px, innerWidth=${heroOverflow.innerWidth}px`);
    if (heroOverflow.hasOverflow) {
      throw new Error(
        `Mobile viewport overflow error: document.documentElement.scrollWidth (${heroOverflow.scrollWidth}px) exceeds 390px at hero section.`
      );
    }

    // Scroll to about on mobile
    await scrollToSelector('#about');
    await takeScreenshot('/tmp/scenario_7_mobile_about.png');

    // Mobile horizontal overflow check after scroll
    const { result: scrollOverflowRes } = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > 390
      })`,
      returnByValue: true,
    });
    const scrollOverflow = JSON.parse(scrollOverflowRes.value);
    console.log(`Mobile scroll overflow check: scrollWidth=${scrollOverflow.scrollWidth}px, innerWidth=${scrollOverflow.innerWidth}px`);
    if (scrollOverflow.hasOverflow) {
      throw new Error(
        `Mobile viewport overflow error: document.documentElement.scrollWidth (${scrollOverflow.scrollWidth}px) exceeds 390px after scrolling.`
      );
    }

    // Restore desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Check console errors
    const { result: errResult } = await send('Runtime.evaluate', {
      expression: 'window.__consoleErrors',
      returnByValue: true,
    });
    console.log('Console errors recorded:', errResult.value);

    // Strict assertion: window.__consoleErrors must be an Array with ZERO errors
    if (!Array.isArray(errResult.value)) {
      throw new Error(
        `Console error assertion failed: expected window.__consoleErrors to be an Array, but received ${typeof errResult.value} (${errResult.value}). Ensure error tracking is initialized in index.html.`
      );
    }

    if (errResult.value.length > 0) {
      throw new Error(
        `Console error assertion failed: recorded ${errResult.value.length} error(s):\n` +
        errResult.value.map((err, i) => `  [${i + 1}] ${typeof err === 'object' ? JSON.stringify(err) : err}`).join('\n')
      );
    }

    console.log('Verification completed successfully! All assertions passed.');
  } finally {
    if (ws) {
      try {
        ws.close();
      } catch {}
    }
    chromeProcess.kill();
  }
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
