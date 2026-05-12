# StatPlay

**JA** | 参考書の数式で止まった——そんな統計学習者のための、直感を取り戻す可視化ラボ。スライダーを動かすと、式の意味が絵で見えてくる。式が見えたら、参考書に戻ってください。
**EN** | A visualization lab for statistics learners who got stuck at the formulas in a textbook. Move a slider and the meaning behind the equation comes into view — then go back to the textbook.

インタラクティブに触って理解する、サイバーパンク調の統計学習ビジュアライザ。
A cyberpunk-themed interactive visualizer for learning statistics by doing.

- バニラ JS + Canvas 2D のみ。ランタイム依存ゼロ / Zero runtime dependencies
- 日英バイリンガル / Bilingual JA ⇄ EN
- ダーク（サイバーパンク）& ライトモード対応 / Dark & light theme
- PWA — オフラインで動作 / Works offline
- 検索エンジンが各トピックを個別にインデックスできる per-page 構成（sitemap / hreflang / JSON-LD 付き）

## Demo

ローカル HTTP サーバを立てて `index.html` を開くだけ。ビルド不要・依存なし・ネットワーク通信なし（ES modules を使用するので `file://` 直開きではなく HTTP 配信が必要）。

Just start a local HTTP server and open `index.html`. No build step, no dependencies, no network calls. (ES modules require HTTP — `file://` won't work.)

```bash
python3 -m http.server 8080
# → http://localhost:8080/
```

GitHub Pages にそのまま置いても動作します（`Settings → Pages → main / root`）。
Also works out of the box on GitHub Pages (`Settings → Pages → main / root`).

## Topics / トピック一覧

| #  | Slug       | JA | EN |
|----|------------|----|----|
| 1  | `stdnorm`  | 標準正規分布 | Standard Normal Distribution |
| 2  | `normal`   | 正規分布と標準化（μ・σ の役割） | Normal Distribution & Standardization |
| 3  | `prob`     | 確率の基本法則（ベン図） | Probability Rules (Venn Diagrams) |
| 4  | `bayes`    | ベイズ定理（陽性的中率） | Bayes' Theorem (Positive Predictive Value) |
| 5  | `morep`    | 二項分布・ポアソン分布・指数分布 | Binomial, Poisson & Exponential Distributions |
| 6  | `clt`      | 中心極限定理 | Central Limit Theorem |
| 7  | `lln`      | 大数の法則 | Law of Large Numbers |
| 8  | `ci`       | 信頼区間（95% の意味） | Confidence Intervals (What 95% Really Means) |
| 9  | `test`     | 仮説検定（p 値・α・棄却域） | Hypothesis Testing (Reject Regions & p-values) |
| 10 | `proptest` | 母比率の検定と推定 | Proportion Testing & Estimation |
| 11 | `dists`    | t 分布・χ² 分布・F 分布 | The Three Test Distributions (t, χ², F) |
| 12 | `chitest`  | カイ二乗検定（適合度・独立性） | Chi-Squared Test (Goodness-of-Fit & Independence) |
| 13 | `anova`    | 分散分析（ANOVA） | One-Way ANOVA |
| 14 | `corr`     | 相関係数（散布図と r） | Correlation (r Through Scatter Plots) |
| 15 | `reg`      | 単回帰分析（最小二乗法） | Simple Linear Regression (OLS Visualized) |
| 16 | `mreg`     | 重回帰分析（交絡の制御・3D） | Multiple Regression (Control Confounders, 3D) |

### Columns / コラム

| Slug | JA | EN |
|------|----|----|
| `deviation`         | 偏差値って何？ | What Is Hensachi? — Japan's School Score Is a Rescaled z-Score |
| `birthday`          | 誕生日のパラドックス（23 人で 50% 超え？） | The Birthday Paradox — 23 People, 50%+ Chance |
| `standardization`   | 標準化って何？（「ふつう」を比べる翻訳機） | What Is Standardization? — The Universal Translator for "Normal" |
| `income_prediction` | あなたの年収は、統計でどこまで当てられるか | How Far Can Statistics Predict Your Income? |
| `error_types`       | 第一種・第二種の過誤って何が違うの？ | Type I vs Type II Errors — One 2×2 Table Sorts It Out |
| `se_vs_sd`          | 標準偏差と標準誤差の違い（1 枚の絵で見分ける） | Standard Deviation vs Standard Error — SD and SE in One Picture |

統計表（標準正規分布表 / t 表 / χ² 表 / F 表）は `tables/index.html`（JA）と `en/tables/index.html`（EN）。

## Project Structure / プロジェクト構成

```
index.html                    Hub page / ハブページ
about.html  en/about.html      About page (JA / EN)
topics/<slug>.html             Per-topic pages (JA) × 16
en/topics/<slug>.html          Per-topic pages (EN) × 16
columns/<slug>.html            Columns (JA) × 6
en/columns/<slug>.html         Columns (EN) × 6
tables/index.html              Statistical tables (JA)
en/tables/index.html           Statistical tables (EN)
css/
  stat_cyber.css               Stylesheet (dark + light) / スタイルシート
js/
  main.js                      Entry point (type="module") / エントリポイント
  utils.js                     Shared utilities ($, TAU, normCDF, drawGrid, …)
  katex-render.js              KaTeX math rendering
  modules/
    ├── Topics ────────────────────────────────────
    stdnorm.js  normal.js  prob.js  bayes.js  morep.js
    clt.js  lln.js  ci.js  htest.js  proptest.js
    dist.js  dist_t.js  dist_chi2.js  dist_f.js
    chitest.js  chitest_common.js  chitest_gof.js  chitest_independence.js
    anova.js  corr.js  reg.js  mreg.js  errs.js  descriptive.js
    ├── Columns ───────────────────────────────────
    deviation.js  birthday.js  income_prediction.js  error_types.js  se_vs_sd.js
    ├── UI / Infra ────────────────────────────────
    hero.js  theme.js  prefs.js  nav.js  toc.js  anchor.js
    reveal.js  autorun.js  scrolltop.js  tables.js  graphDrag.js
    a11y.js  pwa.js  version.js  lang.js  share.js  urlParams.js
content/
  topics.json                  Master metadata for all topics & columns (single source of truth)
  partials/                     Reusable content blocks injected at build time
scripts/
  build_topics.py              Per-topic build (pages + sitemap.xml + robots.txt + sw.js slugs)
  bump_version.py              Version bump (package.json + version.js)
  minify.mjs                   Minify JS/CSS into dist/
  test_routing.mjs             jsdom: routing / SEO / structure
  test_math.mjs                jsdom: math-function precision
  test_a11y_map.mjs  test_a11y_canvas.mjs  test_a11y_aria.mjs   jsdom a11y checks
  test_content_guards.mjs      jsdom: prose-tone regression guards
  test_cf_function.mjs         CloudFront viewer-request function tests
  test_layout.mjs              Playwright: computed-CSS layout tests
  test_a11y.mjs                axe-core accessibility scan
  test_e2e.mjs                 Playwright end-to-end smoke tests
  publish_opensource.sh        Push a release to the public repo
icons/                         PWA icons (192 / 512 / maskable)
sw.js                          Service Worker (precache + runtime cache)
manifest.webmanifest           PWA manifest
sitemap.xml  robots.txt        Auto-generated by build_topics.py
```

## Development / 開発

```bash
# Dev server (ES modules require HTTP)
python3 -m http.server 8080

# Lint
npm run lint

# Build (per-topic pages + sitemap + robots + sw.js cache bump)
npm run build

# Tests
npm run test              # jsdom suite (routing, math, a11y maps, content guards, CF function)
npm run test:layout       # Playwright layout tests
npm run test:a11y         # axe-core accessibility scan
npm run test:e2e          # Playwright end-to-end smoke tests

# Full CI pipeline (lint → build → test → test:layout → test:a11y → test:e2e)
npm run ci

# Production build (build + minify → dist/)
npm run build:prod

# Version bump
npm run bump              # auto-detect level from commit messages
npm run bump -- --level patch   # explicit level
```

Requires Node >= 20. Dev dependencies: `eslint`, `jsdom`, `@playwright/test`, `@axe-core/playwright`, `terser`, `clean-css-cli`.

---

## License & Copyright

© 2026 Sasai Lab

Licensed under [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

This project was created with assistance from Anthropic Claude. Human creative direction (content structure, pedagogical approach, design, iteration, and review) is by the copyright holder.
