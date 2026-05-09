import { chromium } from 'playwright';
import path from 'path';

const OUT = 'C:/Users/junpe/Desktop/sasai-lab-projects/qiita_images';
const BASE = 'http://localhost:8080';

const CONFIGS = [
  { dist: 'exp', n: 1,  label: 'exp_n1'  },
  { dist: 'exp', n: 5,  label: 'exp_n5'  },
  { dist: 'exp', n: 15, label: 'exp_n15' },
  { dist: 'exp', n: 30, label: 'exp_n30' },
  { dist: 'exp', n: 50, label: 'exp_n50' },
  { dist: 'uniform', n: 1,  label: 'uniform_n1'  },
  { dist: 'uniform', n: 12, label: 'uniform_n12' },
  { dist: 'uniform', n: 30, label: 'uniform_n30' },
  { dist: 'bimodal', n: 1,  label: 'bimodal_n1'  },
  { dist: 'bimodal', n: 5,  label: 'bimodal_n5'  },
  { dist: 'bimodal', n: 30, label: 'bimodal_n30' },
  { dist: 'bimodal', n: 50, label: 'bimodal_n50' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const results = [];

  for (const cfg of CONFIGS) {
    // Fresh page load for each config to avoid accumulation
    await page.goto(`${BASE}/topics/clt.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Select distribution
    await page.selectOption('#cltDist', cfg.dist);
    await page.waitForTimeout(300);

    // Set n via slider
    await page.evaluate((n) => {
      const slider = document.getElementById('cltN');
      slider.value = n;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, cfg.n);
    await page.waitForTimeout(300);

    // Run simulation
    await page.click('#cltRun');

    // Wait until count reaches 3000 (poll every 500ms, up to 15s)
    await page.waitForFunction(() => {
      const el = document.getElementById('cltCount');
      return el && parseInt(el.textContent.replace(/,/g,'')) >= 3000;
    }, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);

    // Extract displayed values
    const data = await page.evaluate(() => ({
      count: document.getElementById('cltCount')?.textContent?.trim(),
      mean:  document.getElementById('cltMean')?.textContent?.trim(),
      sd:    document.getElementById('cltSD')?.textContent?.trim(),
      se:    document.getElementById('cltSE')?.textContent?.trim(),
    }));

    results.push({ ...cfg, ...data });
    console.log(`${cfg.label}: count=${data.count} mean=${data.mean} sd=${data.sd} se=${data.se}`);

    // Screenshot the canvas
    const canvas = await page.$('#cltCanvas');
    if (canvas) {
      await canvas.screenshot({ path: path.join(OUT, `clt_${cfg.label}.png`) });
    }

    // Full panel screenshot
    const section = await page.$('.panel');
    if (section) {
      await section.screenshot({ path: path.join(OUT, `clt_${cfg.label}_full.png`) });
    }
  }

  console.log('\n=== RESULTS ===');
  console.log('| dist | n | count | mean | sd | se |');
  console.log('|------|---|-------|------|----|----|');
  for (const r of results) {
    console.log(`| ${r.dist} | ${r.n} | ${r.count} | ${r.mean} | ${r.sd} | ${r.se} |`);
  }

  await browser.close();
})();
