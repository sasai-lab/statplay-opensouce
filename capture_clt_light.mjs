import { chromium } from 'playwright';
import path from 'path';

const OUT = 'C:/Users/junpe/Desktop/sasai-lab-projects/qiita_images';
const BASE = 'http://localhost:8080';

const CONFIGS = [
  { dist: 'exp',     n: 1,  label: 'exp_n1'  },
  { dist: 'exp',     n: 5,  label: 'exp_n5'  },
  { dist: 'exp',     n: 15, label: 'exp_n15' },
  { dist: 'exp',     n: 30, label: 'exp_n30' },
  { dist: 'exp',     n: 50, label: 'exp_n50' },
  { dist: 'uniform', n: 1,  label: 'uniform_n1'  },
  { dist: 'uniform', n: 5,  label: 'uniform_n5'  },
  { dist: 'uniform', n: 12, label: 'uniform_n12' },
  { dist: 'bimodal', n: 1,  label: 'bimodal_n1'  },
  { dist: 'bimodal', n: 5,  label: 'bimodal_n5'  },
  { dist: 'bimodal', n: 15, label: 'bimodal_n15' },
  { dist: 'bimodal', n: 30, label: 'bimodal_n30' },
  { dist: 'bimodal', n: 50, label: 'bimodal_n50' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  for (const cfg of CONFIGS) {
    await page.goto(`${BASE}/topics/clt.html?theme=light`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Select distribution
    await page.selectOption('#cltDist', cfg.dist);
    await page.waitForTimeout(500);

    // Set n via slider
    await page.evaluate((n) => {
      const slider = document.getElementById('cltN');
      slider.value = n;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, cfg.n);
    await page.waitForTimeout(500);

    // Run simulation
    await page.click('#cltRun');

    // Wait until count reaches 3000
    await page.waitForFunction(() => {
      const el = document.getElementById('cltCount');
      return el && parseInt(el.textContent.replace(/,/g, '')) >= 3000;
    }, { timeout: 30000 }).catch(() => {
      console.log(`  warning: ${cfg.label} may not have reached 3000`);
    });

    // Wait for canvas to fully render after simulation completes
    await page.waitForTimeout(2000);

    // Click the "画像保存" download button
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      page.click('button.share-btn.dl[data-share="cltCanvas"]'),
    ]);

    const dest = path.join(OUT, `clt_${cfg.label}.png`);
    await download.saveAs(dest);
    console.log(`saved: clt_${cfg.label}.png`);
  }

  await browser.close();
  console.log('done');
})();
