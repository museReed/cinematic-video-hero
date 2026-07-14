# T2 — 元件分類與 registry 設計（codex 實作的單一來源）

- **類型**：design spec（Claude 規劃，codex 依此分批實作）
- **Repo**：cinematic-video-hero（獨立 git repo）
- **Branch base**：`spike/design-tokens`
- **前置**：讀 `docs/handoff/2026-07-14-page-builder-decisions-t3-t5.md`（6 決策）與本檔。

## 0. 這份文件解決什麼

把 `src/App.tsx` 的 36 個 demo「打破網頁概念」重新分類：不照 5 個假品牌頁（Cinematic Hero / Creator Portfolio / Fashion Archive / AI Image Product / Viktor Oddy Studio）分，而是照**元件實際在做什麼**分，去掉重複、變體變 props，並讓每個 entity 帶「適用場景」metadata 供 AI 組頁自動選用。

## 1. 三層模型

| 層 | 是什麼 | 進 PageSpec 的形式 | 收斂後數量 |
|---|---|---|---|
| **Section** | 可堆疊內容區塊 | registry section（topLevel）/ child | 26 demo → 14 top + 2 child |
| **Behavior** | 套在 section 上的動作/互動契約 | section 的 `enhancements: []`（見 §3） | 7 demo → 4 |
| **Surface** | 樣式/token 原語 | tokens/CSS class + 1 primitive 元件 | 3 demo → 3 |

## 2. 已拍板的架構決策

1. **三層全做**（Section + Surface + Behavior）。
2. **3 個 scroll 卡片堆保留分開**（sticky-stack / studio-projects / viewport-scale-cards），靠 useWhen/avoidWhen 消歧義。
3. **每個 entity 帶選用 metadata**（見 §4）。
4. **Behavior 用「寫法 A」**：掛在 section 底下的 `enhancements` 陣列（見 §3）。

## 3. Behavior 掛載機制（寫法 A + C 並存）— 動到安全核心，Claude 自己改，不丟 codex

**已拍板**：兩個掛點並存——section 層 `enhancements`（貼單一 section）+ page 層 `behaviors`（罩整頁）。每個 behavior 在 registry 標 `scope: 'section' | 'page'`，只能掛在對應的掛點。

`PageSpec` 兩處新增 optional 欄位：

```ts
// PageSpec.ts
// (A) section 型別新增：
enhancements?: Array<{ component: string; props: Record<string, unknown> }>
// (C) page 頂層新增：
behaviors?: Array<{ component: string; props: Record<string, unknown> }>
```

`validatePageSpec.ts` 新增驗證：

```ts
// 對每個 section.enhancements（寫法 A）：
// 1. component 存在於 behaviorRegistry
// 2. behaviorRegistry[id].scope === 'section'
// 3. component 在該 section 的 entry.allowedEnhancements 白名單內
// 4. props 依 behaviorRegistry[id].propsSchema strict 驗證

// 對 page.behaviors（寫法 C）：
// 1. component 存在於 behaviorRegistry
// 2. behaviorRegistry[id].scope === 'page'
// 3. props strict 驗證
// 4. 同一 behavior id 不可重複
```

新增 `behaviorRegistry`（與 componentRegistry 平行，`src/behavior-library/registry.ts`）：

```ts
type BehaviorEntry = {
  scope: 'section' | 'page'                     // 決定掛哪個掛點
  wrapper: (props) => (children) => ReactNode    // 或 hook/overlay，見各 behavior
  propsSchema: ZodSchema                         // strict
  description: string
  useWhen: string[]
  avoidWhen?: string[]
}
```

**Claude 負責的核心改動（不丟 codex）**：`PageSpec.ts`、`validatePageSpec.ts`、registry 型別擴充、`behaviorRegistry` 骨架 + 兩套白名單/scope 驗證。codex 只填 behavior wrapper/overlay 實作與各 section 元件。

## 4. 每個 entity 的選用 metadata（AI 自動選用依據）

registry / behaviorRegistry entry 一律帶：

| 欄位 | 作用 |
|---|---|
| `description` | 是什麼 |
| `useWhen: string[]` | 什麼情境選它（AI 選用主依據） |
| `avoidWhen?: string[]` | 什麼情境別選（消歧義） |
| `variantGuidance?: Record<variantValue, string>` | 選了元件後，哪個 variant 配哪種情境 |

---

## 5. Section 清單（26 demo → canonical）

> 欄位：canonical / 收斂自 / 是什麼 / 關鍵 props（草案，per-batch spec 收緊 zod 上限）/ 變體 / useWhen / avoidWhen / topLevel·children·allowedEnhancements

### 5.1 Hero
- **收斂自**：`hero-reveal`(cinematic) + `studio-hero`(studio)
- **是什麼**：置中編排的開場 hero（eyebrow/logo、標題、內文、CTA）
- **props**：`eyebrow` ≤40、`title` ≤80、`body?` ≤200、`ctaLabel?` ≤24、`layout: 'cinematic'|'editorial'`
- **variantGuidance**：cinematic→深底大字氣勢開場；editorial→窄欄白底 serif 品牌調
- **useWhen**：頁面開場、單一主視覺、要立刻建立品牌調性
- **avoidWhen**：頁面中段的次要區塊（用一般標題即可）
- topLevel ✓ / children — / enhancements: inview-entrance

### 5.2 FullBleedVideo
- **收斂自**：`video-fade-loop` + `mouse-scrub-gaze`（+ `focal-shift`、`media-fallback` 收成 props）
- **是什麼**：全螢幕背景影片區塊
- **props**：`src`(allowlist url)、`caption?` ≤80、`focalY: -30..40`、`interaction: 'none'|'scrub'`、`fallback: 'radial-glow'|'solid'`
- **variantGuidance**：interaction=none→純氛圍循環；scrub→角色隨游標轉頭（需密 keyframe 素材）
- **useWhen**：需要沉浸式動態背景、影片是主角
- **avoidWhen**：行動裝置為主、頻寬受限、內容以文字為主
- topLevel ✓ / children — / enhancements: —（自帶 fallback）

### 5.3 Marquee
- **收斂自**：`scroll-marquee`(creator) + `studio-marquee`(studio)
- **是什麼**：橫向無限跑馬燈
- **props**：`content: 'image-rows'|'gif-rail'`、`items`(image path allowlist, 上限筆數)、`direction`、`speed: 'slow'|'normal'|'fast'`、`rows: 1|2`
- **variantGuidance**：image-rows→雙排反向、scroll 驅動的文字/圖牆；gif-rail→單排等速無縫作品縮圖
- **useWhen**：展示一整排素材（logo 牆、作品縮圖）、填滿寬度的動態節奏
- **avoidWhen**：需要使用者停下細讀每一項時
- topLevel ✓ / children — / enhancements: —

### 5.4 DepthCarousel（已存在，補 metadata）
- **收斂自**：`depth-role-carousel`
- **是什麼**：四圖 role-based 深度輪播
- **props**：現有（title、images tuple×4、autoAdvanceMs?）
- **useWhen**：4 個並列角色/風格要以 3D 深度感輪替呈現
- **avoidWhen**：項目數不固定、或需要精準閱讀每項細節
- topLevel ✓

### 5.5 TestimonialCarousel
- **收斂自**：`studio-carousel`
- **是什麼**：自動前進、hover 暫停、無限置中的評價輪播
- **props**：`items`(quote/author/company，上限)、`autoAdvanceMs`、`cardWidth?`
- **useWhen**：多則客戶好評/推薦，要連續滑動輪播
- **avoidWhen**：只有 1–2 則（用靜態卡片）
- topLevel ✓ / enhancements: —（自帶 auto-advance）

### 5.6 SplitVideoScrub
- **收斂自**：`dual-video-scrub` + `dead-zone-switcher`
- **是什麼**：左右分割、指標位置 scrub 的雙影片檢視器
- **props**：`left`/`right`(video allowlist)、`mode: 'independent'|'dead-zone'`、`deadZone?: {left,right}`
- **variantGuidance**：independent→各半各自 scrub；dead-zone→中央中性帶內保留上次選邊
- **useWhen**：兩支影片要並列對比、由指標互動探索
- **avoidWhen**：行動裝置為主（改 poster fallback）
- topLevel ✓ / enhancements: —

### 5.7 MasonryGrid
- **收斂自**：`procedural-archive-grid`
- **是什麼**：變高度瀑布流磚牆（放進最短欄）
- **props**：`items`(image allowlist + 每項 aspect)、`columns: {mobile:2, desktop:3}`
- **useWhen**：大量不等高圖像要平衡填排（archive/gallery）
- **avoidWhen**：項目少、或需固定網格對齊
- topLevel ✓ / enhancements: inview-entrance

### 5.8 ScrollScaleCards
- **收斂自**：`viewport-scale-cards`
- **是什麼**：依與視窗中心距離縮放/淡出的卡片列
- **props**：`items`、`scaleRange?`
- **useWhen**：滑動中要「近大遠小」聚焦當前卡片
- **avoidWhen**：卡片彼此無主次、或需同時清楚看到全部
- topLevel ✓

### 5.9 StickyCardStack
- **收斂自**：`sticky-stack`
- **是什麼**：卡片 sticky 釘住、後者到來時壓縮前者
- **props**：`items`、`offsetPx?`
- **useWhen**：作品/步驟**有先後堆疊敘事**、要逐張壓上去
- **avoidWhen**：卡片彼此無先後關係（改 ScrollScaleCards 或一般 grid）
- topLevel ✓

### 5.10 ProjectStack
- **收斂自**：`studio-projects`
- **是什麼**：資料驅動的作品垂直堆疊，每項獨立進場
- **props**：`items`(name/description/image allowlist)
- **useWhen**：數個作品各自成段、要逐一獨立淡入
- **avoidWhen**：要壓縮堆疊感（用 StickyCardStack）或近大遠小（用 ScrollScaleCards）
- topLevel ✓ / enhancements: inview-entrance

### 5.11 QuoteParallax
- **收斂自**：`studio-parallax`
- **是什麼**：大字編輯級引言 + 隨 scroll 輕移的肖像
- **props**：`quote` ≤200、`author`、`companies?`(≤3)、`portrait`(image allowlist)
- **useWhen**：單則重量級引言/證言、要 parallax 氛圍
- **avoidWhen**：多則評價（用 TestimonialCarousel）
- topLevel ✓ / enhancements: —（自帶 parallax）

### 5.12 ScrollCharacterReveal
- **收斂自**：`animated-text`
- **是什麼**：依閱讀進度逐字提亮的段落
- **props**：`text` ≤400
- **useWhen**：一段宣言/理念要隨 scroll 逐字揭示
- **avoidWhen**：長篇正文、或需一眼讀完
- topLevel ✓

### 5.13 GradientHeading
- **收斂自**：`gradient-type`
- **是什麼**：漸層裁字的巨型顯示標題
- **props**：`text` ≤60、`from?`/`to?`(hex)
- **useWhen**：需要一個把字當視覺材料的巨型標題
- **avoidWhen**：一般段落標題
- topLevel ✓ / enhancements: inview-entrance

### 5.14 FeatureGrid（parent）+ FeatureCard（child）
- **收斂自**：`core-features-section`（parent）+ `prompt-suggestion-card`/`api-access-card`/`project-library-card`（child variant×3）
- **FeatureGrid props**：`badge?`、`title` ≤60、`subtitle?` ≤120（1–3 columns 響應式）
- **FeatureCard props**：`variant: 'prompt'|'api'|'library'`、`title`、視 variant 需要的 asset（allowlist）
- **variantGuidance**：prompt→提示強化說明卡；api→網路連線視覺卡；library→素材庫卡
- **useWhen**：產品「核心功能」三欄卡片區
- **avoidWhen**：非功能展示（用一般 grid）
- FeatureGrid: topLevel ✓ / allowedChildren: FeatureCard(1–3) ；FeatureCard: topLevel ✗

### 5.15 Pricing + PricingCard（已存在，補 metadata）
- **收斂自**：`studio-pricing`
- **useWhen**：1–3 個方案並列比較
- **avoidWhen**：只有單一方案（用 CTA 區塊）

### 5.16 Footer
- **收斂自**：`studio-footer-nav`
- **是什麼**：分組連結 + 版權 + 常駐底部轉換 pill
- **props**：`links`(分組, url allowlist)、`company`、`location`、`ctaLabel`
- **useWhen**：頁尾收束、需要導覽 + 轉換
- **avoidWhen**：頁面中段
- topLevel ✓ / enhancements: —

---

## 6. Behavior 清單（7 demo → 4）

### 6.1 inview-entrance ✅ 完美適配寫法 A
- **收斂自**：`fade-in`(creator) + `studio-stagger`(studio)
- **是什麼**：進入視窗一次性淡入 + 子項 stagger
- **props**：`delay?`、`y?`(default 30)、`x?`、`duration?`(default .7)
- **useWhen**：任何 section 進場要淡入
- **avoidWhen**：已自帶進場動畫的 section（Hero 除外由 host 決定）

### 6.2 pointer-magnet ✅ 完美適配寫法 A
- **收斂自**：`magnet`
- **是什麼**：元素在指標靠近時輕微跟隨、離開回彈
- **props**：`strength?`(default 3)、`radiusPx?`(default 150)
- **useWhen**：肖像/CTA 想要磁吸互動感（fine pointer）
- **avoidWhen**：coarse pointer（自動停用）、大面積區塊

### 6.3 pointer-overlay（`scope: 'page'`，掛 page 層 behaviors）
- **收斂自**：`custom-cursor` + `studio-mouse-trail`
- **variant**：`cursor`（自訂游標）| `trail`（滑鼠拖尾縮圖）
- **props**：`variant`、`items?`(trail 用，image allowlist)
- **useWhen**：整頁要編輯級指標回饋（fine pointer）
- **avoidWhen**：coarse pointer（自動停用）、reduced-motion
- **形式**：page 層 overlay，render 在所有 section 之上；不屬任何單一 section

### 6.4 scroll-director（`scope: 'page'`，掛 page 層 behaviors）
- **收斂自**：`scroll-phase-director` + `scroll-outro`
- **是什麼**：單一 scroll 進度源，派生 intro/archive/exit 階段給多個子 section
- **props**：`phases?`（範圍設定）
- **useWhen**：整頁要單一 scroll 編排（多 section 依階段轉場、含 outro 收尾）
- **avoidWhen**：各 section 已自帶獨立 scroll 行為
- **形式**：page 層協調器，擁有多個 section 的 transform（單一 progress owner）

---

## 7. Surface 清單（3 demo → 3）

### 7.1 Glass
- **收斂自**：`liquid-glass` + `masked-border`（masked-border 是 liquid-glass 的 `::before` 邊框層，同一個表面）
- **形式**：`index.css` 的 `.glass` class（含 `::before` 遮罩邊框）+ 必要 token
- **useWhen**：需要借用背後動態內容的半透明玻璃表面

### 7.2 Button
- **收斂自**：`studio-buttons`
- **形式**：primitive 元件 `Button`，`variant: 'primary'|'secondary'|'tertiary'`、支援 `href`
- **用途**：section 內部共用（非 topLevel）
- **useWhen**：任何 CTA/連結按鈕

### 7.3 ZLayering
- **收斂自**：`exclusion-ui`
- **形式**：`tokens.ts` 的 z-index token（content 10 / panel 30 / chrome 50）
- **useWhen**：固定 chrome（header/footer）要壓在動態 panel 之上

---

## 8. 兩種 scope 已解決（寫法 A + C 並存，全 4 個 Behavior 本輪都做）

- **section scope（寫法 A，掛 `section.enhancements`）**：inview-entrance、pointer-magnet
- **page scope（寫法 C，掛頂層 `page.behaviors`）**：pointer-overlay、scroll-director

拍板結果：**現在就加 page 層機制**，4 個 Behavior 一次做齊。B0 的核心改動因此同時涵蓋 §3 的 (A) + (C) 兩處掛點與 scope 驗證。

---

## 9. codex 分批計畫（Section 為主體）

> 每批一份 spec（複製 codex-agent skill 的 spec-template），worktree 隔離，驗收 `npm run lint && npm run build && npm run mcp:smoke`（smoke 應列出所有 registry entry）。Claude 先做 §3 核心改動，再開批。

| 批 | 內容 | 產物 |
|---|---|---|
| **B0（Claude 自己）** | PageSpec（section `enhancements` + page `behaviors`）/validatePageSpec（雙掛點 + scope 驗證）/registry 型別擴充（useWhen/avoidWhen/allowedEnhancements）+ behaviorRegistry 骨架（含 scope） | 型別 + 驗證核心 |
| **B1** | Section：Hero / FullBleedVideo / Marquee / Footer | 4 元件 + schema + registry + export 模板 |
| **B2** | Section：TestimonialCarousel / SplitVideoScrub / MasonryGrid / QuoteParallax | 4 |
| **B3** | Section：ScrollScaleCards / StickyCardStack / ProjectStack / ScrollCharacterReveal / GradientHeading | 5 |
| **B4** | Section nested：FeatureGrid + FeatureCard(variant×3) | 1 parent + 1 child |
| **B5** | Surface：Glass(css) / Button(primitive) / ZLayering(token) | token + primitive |
| **B6** | Behavior section-scope：inview-entrance / pointer-magnet | 2 wrapper + schema |
| **B7** | Behavior page-scope：pointer-overlay(cursor/trail) / scroll-director | 2 overlay/orchestrator + schema |

每批 review：`last-message.txt` + `diff --stat` + Claude 自跑驗收 + 高風險 diff（asset allowlist、strict schema、enhancements 驗證）。

## 10. 已知既有狀態

- 現有 registry 已有 hero-reveal/video-loop/depth-carousel/scroll-marquee/pricing/pricing-card——B1–B4 會**重構取代**（改名/合併），不是純新增；spec 要寫清楚哪些既有 id 併入哪個 canonical。
- `EXPORT_TEMPLATES`（exportTemplates.ts）每加/改一個 registry id 要同步。
- `generated-pages/codex-e2e.json` 是測試殘留，勿 commit。
