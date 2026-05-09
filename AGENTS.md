# AGENTS.md - StatPlay

Codex は StatPlay を変更する前にこのファイルを読むこと。`CLAUDE.md` にはより詳しい履歴と引き継ぎメモがあるため、アーキテクチャ、公開方針、SEO、テスト、プロジェクト方針に関わる作業では併せて読む。

## プロジェクトの目的

StatPlay は、統計学を独習する人が概念を直感的に理解し、参考書へ戻れるようにするためのインタラクティブ可視化サイトです。

目的は大きく2つです。

- 笹井淳平の実装力、教育的編集力、研究者としてのブランドを公開実績として示すこと。
- 数式で詰まっている学習者に、視覚的な理解の足場を提供すること。

オーナーから明示されない限り、収益化、広告、有料化、アフィリエイト、競合比較、PV最大化のための記事量産は提案しない。SEO は「良いページが見つかる状態を保つ」ための範囲に限る。

## 優先順位

1. 統計的正確性と教育的妥当性。
2. デスクトップ・モバイル両方での技術的安定性。
3. 範囲を限定した、技術的に正しい SEO。
4. 既存のサイバーパンク調デザインを守った UI / デザイン改善。

## 技術スタックと構成

- Vanilla JavaScript、ES modules、Canvas 2D。
- 静的サイト / PWA。
- メインのハブ: `index.html`
- トピックページ: `topics/<slug>.html` と `en/topics/<slug>.html`
- コラム: `columns/<slug>.html` と `en/columns/<slug>.html`
- スタイル: `css/stat_cyber.css`
- モジュール: `js/modules/`
- 共通ユーティリティ: `js/utils.js`
- トピック定義: `content/topics.json`
- ビルドとテスト: `scripts/`

## コマンド

実際のコマンドは `package.json` を正とする。よく使うコマンドは以下。

```bash
npm run build
npm run lint
npm run test
npm run test:layout
npm run ci
```

ローカル表示には HTTP サーバーを使うこと。`file://` では ES modules が正しく動かない。

## コーディング規約

- 周辺のページがその形式を使っている場合、HTML は `data-lang="ja"` と `data-lang="en"` のバイリンガル構造を保つ。
- 新しいセクションは `<section id="<slug>" class="reveal">`、`.sec-title`、`.sec-desc` の定型に従う。
- Canvas は描画前に `resizeCanvas(c)` を呼ぶ。
- ドラッグ可能な Canvas では、既存の `a11y.js` のパターンに従ってアクセシブルな slider セマンティクスを付ける。
- 通常のページ作業で新しいフレームワーク依存を増やさない。
- 色は既存の CSS カスタムプロパティを使い、デザインシステムから不用意に外れない。
- HTML にアプリバージョンをハードコードしない。`js/modules/version.js` がバージョンの基準。

## SEO とコンテンツ

- トピックやコラムの追加・変更は、可能な限り `content/topics.json` を通して行い、その後に生成ページを再ビルドする。
- 新しい公開 HTML ページには、必要に応じて canonical、hreflang ja/en/x-default、Open Graph、Twitter Card、JSON-LD を入れる。
- 文章は、謙虚で、正確で、学習者の目線に近いトーンを保つ。
- 「自明」「容易」「当然」など、読者を置いていく表現を避ける。
- 特定の試験・資格の対策ガイドとして位置づけない。試験名・出題範囲・受験者ペルソナをサイト本文に持ち込まない。
- StatPlay 本体（コラム・トピック・パーシャル・index / about 等）では一人称主語（「自分は」「私は」、英語の "I"）を使わない。現象の描写、読者への問いかけ、主語不在の状態描写で書く。詳細は `CLAUDE.md` §5.5「主語表現ポリシー」を参照。`qiita-articles/` 配下の Qiita 記事は対象外。

## 検証

- 小さな JavaScript やコンテンツ変更では、まず関係する最小限のテストを走らせる。
- トピック定義、ページ生成、SEO、Service Worker、複数ページに影響する変更では、可能なら `npm run ci` を走らせる。
- レイアウトや Canvas に関わる変更では、Playwright のレイアウト確認と、可能な範囲で対象ページの目視確認を行う。
- プリキャッシュ対象のアセットを変えた場合は、`sw.js` のキャッシュバージョン更新が必要か確認する。

## 既知のハマりどころ

- 大きな HTML / JS / JSON 編集では、過去にファイル末尾が欠けたことがある。小さなパッチで編集し、構文確認を行う。
- ファイルが突然パースできなくなった場合、末尾に null バイトが混入していないか確認する。
- `package.json` を編集したら JSON として検証する。
- `scripts/build_topics.py` を編集したら、ビルド前に Python の構文確認を行う。
