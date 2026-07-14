# Handoff — page builder 決策拍板 + T3/T4/T5 實作

- **類型**：continuation
- **Repo**：cinematic-video-hero（**獨立 git repo**，勿併回外層 workshop repo）
- **Branch**：`spike/design-tokens`
- **Open PR**：無

## 狀態摘要（≤10 行）

- 6 個 pending decisions 全拍板：①元件粒度=允許 nested primitives ②asset=domain allowlist ③token 覆寫=只 page 層 theme enum、不開 section 覆寫 ④頁面存 repo JSON ⑤export=固定模板生成 React ⑥權限暫一套 Codex read-only。
- T1（schema #1/#2/#3）實測=**免動**：nested children + domain allowlist 早在 spike 實作，#3 決定保持簡單。
- T3 `export_page`（codex，`10dab76`）：第 7 個 write tool，固定 per-component JSX 模板，props 走 `JSON.stringify` 無 raw-code 注入，限 `exported-pages/`。
- T4 motion token 雙通道（codex，`ad02668`）：`MOTION` JS 物件（Framer）+ `--motion-*` CSS 變數（Tailwind），值原封抽出、行為不變。
- T5 Latin 字體自架（`2e2f6ca`）：9 woff2 進 `public/fonts` @font-face；studio 去 PP 商用字體改 Instrument Serif/Inter；Noto TC(CJK) 暫留 Google CDN。
- 三支全併入 `spike/design-tokens`，合併後 `npm run build` 綠；worktree/分支已清。

## 必讀檔案

- `docs/handoff/2026-07-14-component-only-mcp-page-builder.md` — 原始架構規劃、PageSpec/registry 設計、待討論決策全文（本 session 拍板的來源）。
- `src/page-builder/validatePageSpec.ts` — 安全核心；nested children + allowedChildren + topLevel 驗證都在此，改 registry/schema 前必讀。
- `src/component-library/registry.ts` + `schemas.ts` — 目前只有 5 個代表元件；**T2 要在此擴到 36 卡**。
- `src/App.tsx` — 36 卡的抽取來源（5 presets、feature registry、prompt/script/validations、mini demos 都在這，檔案很大）。
- `mcp/tools/exportPage.ts` + `exportTemplates.ts` — T3 產物，新增元件時模板要同步。
- `src/component-library/themes/index.ts` — `MOTION`（T4）+ studio 字體 vars + `THEME_FONT_CSS_URLS`（T5，studio 已空、claude2code 仍 CJK CDN）。

## 下一步

1. **T2 = 36 張卡全量進 registry**（本 backlog 最後一支、體量最大）：從 `App.tsx` 逐 preset 抽出元件 → 建 propsSchema（strict + asset allowlist）+ registry entry（topLevel/allowedChildren）+ 同步 `exportTemplates.ts` 與 `componentImports`。建議用 codex-agent skill 分批（每 preset 一份 spec），驗收 `npm run lint / build / mcp:smoke`（smoke 應列出 36 卡）。
2. **T5 尾巴**：claude2code 內容定稿後，用 fonttools subset Noto Serif/Sans TC → 自架、清掉 `themes/index.ts` 最後一條 Google URL。
3. 可選：`spike/design-tokens` 開 PR（目前無 remote PR）。

## 已知問題

- `generated-pages/codex-e2e.json` 為 e2e 測試殘留（untracked），非產物，勿 commit。
- `App.tsx:558`/`:1189` 仍有 PP 字體參照——demo prompt 文字 + Viktor Oddy mini demo fallback（會 fallback 到已自架的 Instrument Serif），非 token 鏈，T5 未動。
- Kanit 只自架 400/600/700（原 @import 是 300-900）；如 demo 用到其他 weight 會 fallback。
- 相關 memory：[[cinematic-video-hero-page-builder]]、[[codex-agent-nogit-mode]]、[[prefer-single-bash-commands]]。
