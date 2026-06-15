# 驚嘆號品牌展示頁 V2「驚艷版」修正版計劃書
## （Opus 4.8 顧問評估後修正・Codex 可執行規格）

---

## 一、背景與目標

| 項目 | 說明 |
|---|---|
| 品牌 | 驚嘆號（Shopee 71815500）・女裝・8年・2,580+ 五星・978件 |
| 網站角色 | 引流轉換頁（Link in Bio 升級版）→ 送訪客進蝦皮購買 |
| 主要入口 | IG、LINE、小紅書 in-app WebView（行動端為主） |
| 目標受眾 | 台灣女性 18-35 歲・喜愛韓系穿搭・平價快時尚消費者 |
| 售價區間 | 450-620 TWD（平價快時尚，非精品） |
| V1 現況 | 乾淨極簡暖白，功能完整，已部署 |

### V2 修正後目標（Opus 4.8 評估後）

> **「更驚艷」≠「更暗更炫技」，而是「更精緻地賣衣服」**

V2 的「驚艷」方向：**明亮精緻韓系編輯風**（參考：29CM・W Concept・OB嚴選旗艦頁），而非 Dark Luxury（精品珠寶語言，客單價 5,000+ 才用）。

### KPI（須優於 V1）
- 蝦皮出站 CTR ≥ 25%（V1 目標 22%）
- 平均停留時間 ≥ 90 秒
- LINE 加入 ≥ 4%
- LCP < 2.5s（行動端 WebView 測試）

---

## 二、創意方向（修正版）：Bright Korean Editorial

| 元素 | V1 | V2（修正後） |
|---|---|---|
| 背景色 | #F7F5F2（暖白） | #FAFAF8（升級暖白，更純淨） |
| 主調色 | Terracotta #D9A38A | 玫瑰米 #E8C4A0 + 深棕 #2D1F14（對比更強） |
| 強調色 | 無 | 奶油白 #FFF8F0、霧粉 #F2D9C8 |
| 字型 | Noto Sans TC 全站 | Playfair Display（英文展示）+ Noto Sans TC（中文） |
| 整體感 | 清爽・信任感 | 精緻・時尚雜誌感・溫暖有力 |
| 動態 | Scroll reveal 淡入 | Clip-path reveal + 精緻 Stagger 動畫（無炫技） |
| 圖片 | 真實商品照 | **真實商品照為主，AI 僅用於純裝飾紋理** |
| Hero | 文字為主 | 真實模特兒大圖（直接用現有 LINE 相簿照片） |

---

## 三、AI 圖片生成需求（修正版，供 Codex 生成）

### 原則（Opus 4.8 P0 修正）
- ❌ 禁止：AI 生成服飾商品圖、模特兒展示圖、蝦皮評論截圖
- ✅ 允許：純氛圍裝飾紋理、幾何背景圖案、非商品的場景背景

### AI 生成圖片清單（縮減至 3 張）

| 編號 | 用途 | 尺寸 | Prompt |
|---|---|---|---|
| AI-01 | Hero 區段背景材質（疊加在真實照片上方，極低不透明度） | 1920×1080 | Subtle cream-colored fabric texture, silk weave close-up, ultra soft, flat, no shadows, photography on plain white surface. Background use only. |
| AI-02 | 品牌故事區裝飾（右側浮動圖形） | 600×600 | Abstract minimalist line art of a clothing hanger and needle thread, single thin stroke, warm beige on cream white background. Editorial fashion illustration style. |
| AI-03 | 信任區底部裝飾線條 | 1440×120 | Minimalist horizontal brush stroke texture, warm beige/cream, watercolor effect, very subtle, transparent background. |

### 其餘圖片（使用真實照片）

| 編號 | 用途 | 來源 |
|---|---|---|
| REAL-01 | Hero 主圖（桌機） | 從現有 `image/` LINE相簿挑選最佳直式構圖照 |
| REAL-02 | Hero 主圖（手機） | 同上，選最適合 3:4 裁切的照片 |
| REAL-03～10 | 本季精選縮圖 | 全部直接使用 `image/*.jpg`，沿用 V1 gallery.json |
| REAL-11～14 | Lookbook 4 張 | 從 LINE 相簿選 4 張最有故事感的照片（穿搭完整、構圖佳） |

---

## 四、頁面架構與各區塊設計（修正版）

### 頁面順序
```
① Hero（全版・精緻版型・大圖+強文字）
② 本季精選（動態縮圖走廊，沿用 V1 Gallery）
③ Lookbook Strip（CSS scroll-snap 橫向，不劫持頁面）
④ 社群口碑牆（數字衝擊 + 評語引言 Marquee）
⑤ LINE 召喚（全版 CTA）
⑥ 品牌故事（Stagger reveal 文字）
⑦ Footer
```

---

### 區塊 ①：Hero（全版精緻入口）

**設計概念：** 真實服飾大圖 + 精緻版式，讓訪客 3 秒感受「這個品牌的衣服好看」。

```html
<section class="hero" id="top">
  <!-- 背景：真實模特兒照 -->
  <picture class="hero-bg">
    <source media="(max-width: 767px)" srcset="assets/images/hero-mobile.webp" type="image/webp">
    <img src="assets/images/hero-main.webp"
         alt="驚嘆號韓系女裝本季精選"
         width="1920" height="1080"
         fetchpriority="high"
         decoding="async"
         class="hero-bg-img">
  </picture>
  <div class="hero-overlay" aria-hidden="true"></div>

  <!-- 內容（右側或居中，視照片構圖） -->
  <div class="hero-content">
    <p class="hero-kicker">KOREAN FASHION · SINCE 2018</p>
    <h1 class="hero-title">
      每一季，<br>都值得一個<span class="brand-exclaim">驚嘆號</span>。
    </h1>
    <p class="hero-body">韓系修身・兩件式套裝・週週上新</p>
    <div class="hero-cta-group">
      <a class="btn-primary" href="#products">看本季精選</a>
      <a class="btn-secondary" href="https://shopee.tw/shop/71815500"
         target="_blank" rel="noopener"
         data-event="shopee_click" data-location="hero">前往蝦皮賣場</a>
    </div>
  </div>

  <!-- 統計數字浮層 -->
  <div class="hero-stats" aria-label="品牌數據">
    <div class="stat-item"><strong>5.0</strong><span>蝦皮評價</span></div>
    <div class="stat-item"><strong>2,580+</strong><span>五星好評</span></div>
    <div class="stat-item"><strong>8 年</strong><span>穩定經營</span></div>
    <div class="stat-item"><strong>8,475</strong><span>粉絲追蹤</span></div>
  </div>

  <!-- 向下提示 -->
  <div class="scroll-hint reveal" aria-hidden="true">
    <span class="scroll-hint-line"></span>
    <span class="scroll-hint-text">SCROLL</span>
  </div>
</section>
```

**CSS 重點：**
```css
.hero { position: relative; height: 100dvh; /* dvh 修正 WebView 工具列 */ overflow: hidden; }
.hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    105deg,
    rgba(250,250,248,0.82) 0%,
    rgba(250,250,248,0.55) 45%,
    rgba(250,250,248,0.0) 100%
  );
}
.hero-title {
  font-family: var(--font-body);
  font-size: clamp(2.2rem, 5.5vw, 4.5rem);
  font-weight: 900;
  color: var(--color-text-dark);
  line-height: 1.15;
}
.brand-exclaim { color: var(--color-accent); position: relative; }
.hero-kicker {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--color-accent);
  font-weight: 400;
}

/* 行動端：全幅文字 + 照片移至背景 */
@media (max-width: 767px) {
  .hero-overlay { background: linear-gradient(180deg, rgba(250,250,248,0.7) 0%, rgba(250,250,248,0.5) 50%, rgba(250,250,248,0.9) 100%); }
  .hero-content { align-items: center; text-align: center; }
}
```

---

### 區塊 ②：本季精選（沿用 V1 Gallery 改主題）

沿用 V1 的 `gallery.json` + Marquee 走廊 + Lightbox 機制，僅改 CSS 色調：
- 底色從 `#F7F5F2` 改為 `#FAFAF8`
- 縮圖 hover 從舊樣式改為玫瑰米邊框 + scale(1.03)
- Lightbox CTA 按鈕樣式更新

---

### 區塊 ③：Lookbook Strip（CSS scroll-snap，不劫持）

**修正重點：** 改用原生 CSS `scroll-snap`，不劫持頁面滾動，WebView 100% 相容。

```html
<section class="lookbook" id="lookbook" aria-label="本季 Lookbook">
  <div class="lookbook-heading reveal">
    <p class="section-kicker">Lookbook</p>
    <h2>穿對一件，今天就不一樣。</h2>
  </div>
  <!-- 橫向滾動區：使用者「主動」左右滑，不劫持頁面 -->
  <div class="lookbook-scroll" role="list">
    <div class="lookbook-card reveal" role="listitem">
      <img src="assets/images/lookbook-01.webp" alt="韓系修身洋裝穿搭" width="480" height="640" loading="lazy">
    </div>
    <div class="lookbook-card reveal" role="listitem">
      <img src="assets/images/lookbook-02.webp" alt="兩件式套裝穿搭" width="480" height="640" loading="lazy">
    </div>
    <!-- lookbook-03, 04 -->
  </div>
  <div class="lookbook-cta reveal">
    <a class="btn-primary" href="https://shopee.tw/shop/71815500" target="_blank" rel="noopener"
       data-event="shopee_click" data-location="lookbook">查看全部款式</a>
  </div>
</section>
```

```css
.lookbook-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;  /* 隱藏捲軸 */
  padding: 0 1.5rem 1rem;
}
.lookbook-scroll::-webkit-scrollbar { display: none; }

.lookbook-card {
  flex: 0 0 75vw;
  max-width: 320px;
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 3/4;
}
.lookbook-card img { width: 100%; height: 100%; object-fit: cover; }

@media (min-width: 768px) {
  .lookbook-card { flex: 0 0 340px; }
}
```

---

### 區塊 ④：社群口碑牆

```html
<section class="proof section" id="proof">
  <div class="section-inner">
    <!-- 大數字 -->
    <div class="proof-stats reveal">
      <div class="proof-stat">
        <span class="stat-num" data-target="2580" data-suffix="+">0</span>
        <p>五星好評</p>
      </div>
      <div class="proof-stat">
        <span class="stat-num" data-target="8" data-suffix=" 年">0</span>
        <p>穩定經營</p>
      </div>
      <div class="proof-stat">
        <span class="stat-num" data-target="5" data-suffix=".0">0</span>
        <p>蝦皮評價</p>
      </div>
    </div>

    <!-- 評語引言走廊（真實蝦皮評語，非 AI） -->
    <div class="quotes-strip-viewport" aria-label="顧客評語">
      <div class="quotes-strip" role="list">
        <blockquote role="listitem">「料理好、版型准，第三次回購了！」</blockquote>
        <blockquote role="listitem">「速度超快，實品比照片還好看 ♡」</blockquote>
        <blockquote role="listitem">「面料很舒服，這個價格真的划算」</blockquote>
        <blockquote role="listitem">「修身效果超棒，顯瘦顯高！」</blockquote>
        <blockquote role="listitem">「第一次買覺得物超所值，馬上加為最愛賣家」</blockquote>
        <!-- 複製一組，Marquee 無縫循環 -->
      </div>
    </div>
  </div>
</section>
```

---

### 區塊 ⑤：LINE 召喚（全版 CTA）

```html
<section class="line-cta section" id="line">
  <div class="section-inner">
    <p class="section-kicker">LINE OFFICIAL</p>
    <h2>每週第一個知道新品上架</h2>
    <p>加入 LINE 官方帳號，新友專屬 9 折優惠碼</p>
    <a class="btn-line" href="https://line.me/R/ti/p/@exclamationtw"
       target="_blank" rel="noopener"
       data-event="line_click" data-location="line_cta">
      加入 LINE 官方帳號
    </a>
  </div>
</section>
```

---

## 五、CSS 設計系統（完整版）

```css
/* === 設計 Token === */
:root {
  /* 色彩 */
  --color-bg:          #FAFAF8;
  --color-surface:     #FFFFFF;
  --color-border:      #EDE8E3;
  --color-accent:      #C09070;     /* 玫瑰米（主強調） */
  --color-accent-deep: #2D1F14;     /* 深棕（次強調，黑色替代） */
  --color-accent-soft: #F2D9C8;     /* 霧粉（背景點綴） */
  --color-text:        #2D1F14;
  --color-text-muted:  #7A6A5A;
  --color-white:       #FFFFFF;

  /* 字型 */
  --font-display: 'Playfair Display', 'Noto Serif TC', serif;
  --font-body:    'Noto Sans TC', 'PingFang TC', sans-serif;

  /* 文字尺度 */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.375rem;
  --text-2xl:  1.75rem;
  --text-3xl:  2.25rem;
  --text-4xl:  3rem;

  /* 間距 */
  --space-1: 0.25rem;  --space-2: 0.5rem;
  --space-3: 0.75rem;  --space-4: 1rem;
  --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;
  --space-24: 6rem;    --space-32: 8rem;

  /* 圓角 */
  --radius-sm: 4px;    --radius-md: 8px;
  --radius-lg: 16px;   --radius-full: 9999px;

  /* 陰影 */
  --shadow-card: 0 2px 12px rgba(45,31,20,0.08);
  --shadow-hover: 0 8px 24px rgba(45,31,20,0.14);

  /* 動畫 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --duration-fast: 180ms;
  --duration-base: 350ms;
  --duration-slow: 600ms;
}

/* === 按鈕 === */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--space-3) var(--space-6);
  background: var(--color-accent);
  color: var(--color-white);
  border: none; border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 700;
  text-decoration: none; cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              transform  var(--duration-fast) var(--ease-out);
}
.btn-primary:hover { background: var(--color-accent-deep); transform: translateY(-1px); }

.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--space-3) var(--space-6);
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 400;
  text-decoration: none; cursor: pointer;
  transition: border-color var(--duration-fast), color var(--duration-fast), transform var(--duration-fast);
}
.btn-secondary:hover { border-color: var(--color-accent); color: var(--color-accent); transform: translateY(-1px); }

.btn-line {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: #06C755;
  color: white;
  border: none; border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: var(--text-base); font-weight: 700;
  text-decoration: none; cursor: pointer;
  transition: background var(--duration-fast), transform var(--duration-fast);
}
.btn-line:hover { background: #04a847; transform: translateY(-1px); }

/* === Section 共用 === */
.section { padding: var(--space-24) 0; }
.section-inner { max-width: 1100px; margin: 0 auto; padding: 0 var(--space-6); }
.section-kicker {
  font-size: var(--text-xs); letter-spacing: 0.2em;
  color: var(--color-accent); text-transform: uppercase; font-weight: 400;
}
```

---

## 六、JS 模組規格（Codex 可執行）

### `main.js`（初始化）
```javascript
const SHOPEE_URL = 'https://shopee.tw/shop/71815500';
const LINE_URL   = 'https://line.me/R/ti/p/@exclamationtw';
const CONFIG     = window.EXCLAMATION_CONFIG || {};

// 初始化順序
document.addEventListener('DOMContentLoaded', () => {
  initAnalytics();    // GA4 + Meta Pixel（CONFIG.ga4Id / CONFIG.metaPixelId）
  initReveal();       // IntersectionObserver scroll reveal
  initCounter();      // 數字滾動計數器
  initGallery();      // 縮圖走廊 + Lightbox（沿用 V1 gallery.js 邏輯）
  initOutboundTracking(); // [data-event] 屬性的出站點擊追蹤
  setHeaderState();   // 滾動後 header 背景切換
});

// 出站追蹤
function initOutboundTracking() {
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', () => {
      const event = el.dataset.event;
      const location = el.dataset.location;
      if (typeof gtag !== 'undefined') gtag('event', event, { location });
      if (typeof fbq !== 'undefined' && event === 'shopee_click') fbq('track', 'ViewContent');
    });
  });
}
```

### `reveal.js`（Scroll Reveal）
```javascript
// prefers-reduced-motion 降級：直接顯示，不做動畫
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
```

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out); }
.reveal.visible { opacity: 1; transform: none; }
/* Stagger 子元素 */
.reveal-stagger > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out); }
.reveal-stagger.visible > *:nth-child(1) { opacity:1; transform:none; transition-delay:0ms; }
.reveal-stagger.visible > *:nth-child(2) { opacity:1; transform:none; transition-delay:80ms; }
.reveal-stagger.visible > *:nth-child(3) { opacity:1; transform:none; transition-delay:160ms; }
.reveal-stagger.visible > *:nth-child(4) { opacity:1; transform:none; transition-delay:240ms; }
```

### `counter.js`（數字計數器）
```javascript
function initCounter() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1500; // ms
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);  // ease-out cubic
        el.textContent = Math.round(eased * target).toLocaleString('zh-TW') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}
```

### `gallery.js`（縮圖走廊，完整沿用 V1）
- 沿用 V1 `loadPhotoStrip()`、`renderStrip()`、`openLightbox()`、`closeLightbox()`、`navigateLightbox()`
- 僅改 CSS 色調（按鈕色 → var(--color-accent)）
- `gallery.json` 沿用現有欄位：`{ thumb, full, url, alt }`

---

## 七、響應式斷點（Codex 必需）

| 斷點名 | 寬度範圍 | 主要差異 |
|---|---|---|
| mobile-sm | < 375px | 字型再縮小一級；Hero stats 改 2 列 |
| mobile | 375px – 767px | 預設行動版；Hero 左右 padding 20px |
| tablet | 768px – 1023px | 雙欄 proof stats；Lookbook 卡片 40vw |
| desktop | 1024px – 1279px | Hero 內容靠左，圖片右滿 |
| wide | ≥ 1280px | max-width 1100px 居中 |

```css
/* 斷點變數 */
/* @media (max-width: 374px)  → mobile-sm */
/* @media (max-width: 767px)  → mobile */
/* @media (min-width: 768px)  → tablet+ */
/* @media (min-width: 1024px) → desktop+ */
/* @media (min-width: 1280px) → wide */
```

---

## 八、資料契約（Codex 開發必需）

### `gallery.json`（沿用 V1 格式）
```json
{
  "updated": "ISO 8601 UTC",
  "photos": [
    {
      "thumb": "assets/images/gallery/photo_001_400w.webp",
      "full":  "assets/images/gallery/photo_001_1200w.webp",
      "url":   "https://shopee.tw/shop/71815500",
      "alt":   "驚嘆號韓系女裝 - 款式N"
    }
  ]
}
```

### `window.EXCLAMATION_CONFIG`（由 HTML `<script>` 注入）
```javascript
window.EXCLAMATION_CONFIG = {
  shopeeStoreUrl: 'https://shopee.tw/shop/71815500',
  lineUrl:        'https://line.me/R/ti/p/@exclamationtw',
  ga4Id:          '',  // 填入實際 G-XXXXXX（上線前補）
  metaPixelId:    ''   // 填入實際 Pixel ID（上線前補）
};
```

---

## 九、效能規格

| 項目 | 要求 |
|---|---|
| Hero 圖 preload | `<link rel="preload" as="image" href="hero-main.webp" fetchpriority="high">` |
| 所有圖片 | WebP 格式，srcset 提供 400w/800w/1200w |
| 行動版 Hero | `<source media="(max-width:767px)">` 指向較小裁切版 |
| 字型 | `font-display: swap`；只載入用到的字重 |
| JS | 全部 `defer` 或 `type="module"` |
| Lookbook 圖 | `loading="lazy"` |
| 目標 LCP（行動端） | < 2.5s（在 iOS Safari + WebView 測試） |

---

## 十、WebView 相容規格（Codex 必需實作）

| 問題 | 修正方案 |
|---|---|
| `100vh` 在 iOS WebView 因工具列跳動 | 全站改用 `100dvh`（Hero、Lookbook 高度） |
| 橫向滾動劫持 WebView 衝突 | Lookbook 改用原生 CSS scroll-snap（已落實於第四節） |
| IntersectionObserver 舊版 WebView | 降級：callback 直接加 `.visible`，無動畫 |
| 自訂游標在觸控裝置 | 完全移除（或 `@media (pointer:fine)` 限桌機） |
| `wheel` 事件 WebView 不可靠 | 不使用 wheel 劫持，僅用於原生桌機 scroll-snap |

---

## 十一、檔案結構（Codex 輸出）

```
personalip-v2/
├── index.html
├── gallery.json
├── privacy.html
├── assets/
│   ├── css/
│   │   ├── main.css          # Token + reset + 全域
│   │   ├── hero.css          # Hero 區塊
│   │   ├── gallery.css       # 縮圖走廊 + Lightbox
│   │   ├── lookbook.css      # Lookbook scroll-snap
│   │   ├── proof.css         # 口碑牆 + 計數器
│   │   ├── line-cta.css      # LINE CTA
│   │   ├── brand-story.css   # 品牌故事
│   │   └── animations.css    # reveal / stagger keyframes
│   ├── js/
│   │   ├── main.js           # 初始化 + analytics + 出站追蹤
│   │   ├── reveal.js         # IntersectionObserver reveal
│   │   ├── counter.js        # 數字計數器
│   │   └── gallery.js        # 縮圖走廊 + Lightbox（V1 移植）
│   └── images/
│       ├── hero-main.webp         (REAL-01, 由使用者提供真實照)
│       ├── hero-mobile.webp       (REAL-02)
│       ├── lookbook-01.webp～04   (REAL-11～14)
│       ├── gallery/               (V1 gallery 圖片)
│       ├── decor-texture.webp     (AI-01, 極低不透明度背景紋理)
│       ├── decor-illustration.webp (AI-02, 線條插圖)
│       └── decor-brush.webp       (AI-03, 水彩筆觸)
└── .claude/
    └── launch.json
```

---

## 十二、Codex 開發順序（修正版）

| Phase | 工作 | 驗收標準 |
|---|---|---|
| 1 框架 | `index.html` 骨架 + CSS Token（`main.css`）+ `CONFIG` 注入 | HTML valid；Token 正確渲染 |
| 2 Hero | Hero 區塊 CSS + 佔位圖 + `reveal.js` | LCP 佔位圖 < 1.5s；100dvh 正確 |
| 3 Gallery | 移植 V1 `gallery.js`；更新 CSS 色調 | 24 張縮圖載入；Lightbox 開/關；CTA 蝦皮連結正確 |
| 4 Lookbook | scroll-snap 橫向；4 張佔位圖 | iOS WebView 可橫滑；不劫持頁面垂直滾動 |
| 5 Proof | 計數器 + 評語 Marquee | 2580 計數正確；WebView 無 JS 錯誤 |
| 6 LINE + Story + Footer | 剩餘區塊 | LINE 連結 `@exclamationtw` 正確 |
| 7 圖片替換 | 真實照替換佔位圖；AI 裝飾圖整合 | 無 404；WebP srcset 3 尺寸 |
| 8 Analytics | GA4 + Meta Pixel；`[data-event]` 出站追蹤 | shopee_click、line_click 事件正確送出 |
| 9 QA | 手機、WebView、桌機三端測試 | LCP < 2.5s；無橫向溢出；CTA 全部可點 |

---

## 十三、與 V1 差異對照（「驚艷」升級點）

| 升級點 | V1 | V2 |
|---|---|---|
| Hero | 文字為主，無全版圖 | 真實大圖全版 + 精緻文字排版 |
| 版式 | 標準間距 | 更大留白、更強字重對比（400 vs 900） |
| 字型 | Noto Sans TC 全站 | Playfair Display 英文展示 + Noto Sans TC 中文 |
| Lookbook | 無 | 4 張真實大圖橫向走廊（全新功能） |
| 數字衝擊 | 靜態文字 | 進入視窗計數器動畫（2,580 滾動至數字） |
| 評語 | 無 | 真實評語 Marquee 走廊（社群證明） |
| 動畫細膩度 | reveal 淡入 | Stagger delay + 更精緻 ease curve |
| 色彩精緻度 | 單一 Terracotta | 玫瑰米 + 深棕 + 霧粉 三色層次 |
