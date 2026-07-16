# Handoff — T2 B0 完成、B1 codex 停在 spec 矛盾待 resume

- **類型**：continuation
- **Repo**：cinematic-video-hero（獨立 git repo，勿併回外層 workshop repo）
- **分工**：Claude = 規劃 + review + commit；codex = 實作（用戶指定）
- **Base branch**：`spike/design-tokens`

## ⚠ 更新（B1 已完成）

- **B1 完成並 merge**（`b1fcaf4` on `spike/design-tokens`）：4 Section 元件（section.hero/full-bleed-video/marquee/footer）+ id 遷移 + safeHrefSchema + unit tests。三綠、worktree 已清。下方「B1 blocked」段落為歷史紀錄。
- **進行中**：B2（TestimonialCarousel/SplitVideoScrub/MasonryGrid/QuoteParallax）已派 codex。**新 spec 已預先納入 B1 教訓**（exportPage.ts/exportTemplates.ts/smoke.ts/tests/spike-validate 一開始就列入允許改），避免再卡 resume。
- **剩餘**：B2 review + B3–B7（doc §9）。

## 狀態摘要（≤10 行）

- **B0 已完成並 commit（`2b2e4ba` on `spike/design-tokens`）**：PageSpec 雙掛點（section `enhancements` 寫法 A + page `behaviors` 寫法 C）、validatePageSpec scope/allowlist/strict/dedup 驗證（安全核心，手寫）、behaviorRegistry 骨架（4 behavior，render 留 stub）、componentRegistry 補 useWhen/avoidWhen/allowedEnhancements、searchComponents 吐 useWhen。build+lint+smoke 綠、9 條 behavior 驗證全過。
- **設計單一來源**：`docs/t2-component-taxonomy.md`（36 demo → 3 層 canonical：Section 14+2 / Behavior 4 / Surface 3；每 entity 帶 useWhen/avoidWhen；§9 有 B0–B7 分批表）。
- **6 決策全拍板**：三層全做、3 卡片堆分開、每 entity 帶選用 metadata、Behavior 寫法 A+C 並存、id 改 `section.*` 扁平命名。
- **B1 已派給 codex 但停住（未改任何檔）**：worktree `.worktrees/t2-b1-sections`（branch `t2/b1-sections`），spec 在該 worktree `.codex-task/spec.md`。codex 正確地停在 3 個許可矛盾（見下），沒硬幹。

## B1 codex 回報的 3 個矛盾（resume 前必須在 spec 補掉）

1. **`mcp/tools/exportPage.ts` 硬編碼舊 id / 元件名 / 路徑**，但不在允許範圍——不改它 `section.*` 的 `export_page` 必掛。→ **把 `mcp/tools/exportPage.ts` 加進允許改範圍**。
2. **worktree `AGENTS.md` 要求新行為要加 unit test**，但 spec 只允許新增 `Footer.tsx`。→ **允許新增對應測試檔**（依 repo 慣例放置），或在 resume 指示中明確豁免此 AGENTS 條款（擇一，建議允許加測試）。
3. **舊 id 還散落在 samples / scripts / export 測試**（如 `scripts/validate-pagespec-spike.ts`、可能的 generated-pages 範例）。→ **明確界定**：grep 全庫舊 id，除 `generated-pages/*.json`（測試殘留、勿碰）外全部遷移；把 `scripts/validate-pagespec-spike.ts` 列入允許改範圍。

## 下一步（新 session 從這裡接）

1. **修 B1 spec**：把上述 3 點寫成 resume 指示檔（新檔，如 `.worktrees/t2-b1-sections/.codex-task/resume-1.md`），內容＝原 spec 未變 + 明確補：允許改 `mcp/tools/exportPage.ts` 與 `scripts/validate-pagespec-spike.ts`、允許新增測試檔、界定舊 id 遷移範圍（排除 generated-pages/*.json）。
2. **resume codex**：`/Users/reed/.claude/skills/codex-agent/run-codex-task.sh --resume /Users/reed/Projects/claude-code-workshop/cinematic-video-hero/.worktrees/t2-b1-sections <resume 指示檔絕對路徑>`（背景跑）。
3. **review**（只讀 `last-message.txt` + `git -C <worktree> diff --stat spike/design-tokens`）→ **Claude 自跑** `npm run build && npm run lint && npm run mcp:smoke`（別信 codex 自報）→ 挑高風險 diff：schema `.strict()`、footer `safeHrefSchema`（擋 javascript:/data:）、marquee gif-rail 的 asset allowlist（不得加遠端 host）。
4. 過 → Claude 自己 commit（先 `git branch --show-current`）；worktree 分支後續 merge 回 `spike/design-tokens`。
5. **後續批次**（doc §9）：B2 TestimonialCarousel/SplitVideoScrub/MasonryGrid/QuoteParallax、B3 五個 scroll 系、B4 FeatureGrid+Card(nested)、B5 Surface(Glass/Button/ZLayering)、B6 behavior section-scope(inview-entrance/pointer-magnet)、B7 behavior page-scope(pointer-overlay/scroll-director)。每批一份 spec、worktree 隔離、同樣 review 紀律。

## B1 四元件契約（doc §5.1/5.2/5.3/5.16，codex 照抄勿自由發揮）

- `section.hero`（←hero-reveal）：加 `layout:'cinematic'|'editorial'`、`body?`；enhancements `['inview-entrance']`。
- `section.full-bleed-video`（←video-loop）：加 `focalY(-30..40)`、`interaction:'none'|'scrub'`、`fallback:'radial-glow'|'solid'`。
- `section.marquee`（←scroll-marquee）：zod discriminatedUnion `content:'text'|'gif-rail'`；gif items 走 `allowedImagePathSchema`。
- `section.footer`（新）：`columns/links` + `safeHrefSchema`（只允許 https/#anchor//path）。
- 硬規則：顏色/字級走**語意 token**（`bg-inverted`/`text-display`…），**禁硬色碼**；demo 只借佈局與互動邏輯。

## 已知狀態 / 雷

- `generated-pages/codex-e2e.json`、`smoke-e2e.json` 為測試殘留（untracked），勿 commit。
- 現有 registry 仍混用舊命名（depth-carousel/pricing 未改）——遷移中間態，B2–B4 才處理，允許。
- `EXPORT_TEMPLATES` 是 exhaustive `Record<ComponentId>`：改/加 id 必同步，否則 build 紅。
- codex worktree AGENTS.md 與 `.codex-task/` 已被 run-codex-task.sh 用 info/exclude 排除，勿 commit。
- 相關 memory：[[cinematic-video-hero-page-builder]]、[[codex-agent-nogit-mode]]、[[prefer-single-bash-commands]]。

## codex-agent 回填（B1 首跑 verdict）

```
[codex-agent] T2 B1 Section 元件（Hero/FullBleedVideo/Marquee/Footer）
- run: initial，exit=0，sandbox=workspace-write（斷網預設）
- diff: 0 files changed（codex 正確停在 spec 矛盾，未改檔）
- 驗收: 未跑（codex 未動工）
- verdict: resume 修正（spec 3 處許可矛盾：exportPage.ts 未列入允許改、AGENTS 要求測試但 spec 未允許加測試檔、舊 id 遷移範圍未界定）
- worktree: /Users/reed/Projects/claude-code-workshop/cinematic-video-hero/.worktrees/t2-b1-sections
```
