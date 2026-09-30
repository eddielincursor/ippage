# 知行 — 個人知識品牌網站

用 Astro + Markdown 做的靜態站。視覺與資訊架構靠近台灣常見的知識型個人站：分類導覽、卡片文章、首頁先說明「我可以怎麼幫你」。

目前三個欄位：**程式設計**、**金融**、**好書分享**。

線上預覽：<https://eddielincursor.github.io/ippage/>

## 本機開發

```sh
npm install
npm run dev
```

瀏覽器打開 `http://localhost:4321/ippage/`。

## 常用指令

| 指令 | 作用 |
| --- | --- |
| `npm run dev` | 本機預覽 |
| `npm run build` | 產出靜態檔到 `dist/` |
| `npm run preview` | 預覽正式建置 |
| `npm run check` | 型別檢查 |
| `npm test` | 單元測試（JSON-LD 逸出、時區、OG 檔名、sitemap 日期） |
| `npm run smoke` | 建置後確認子資料夾文章與分享圖有產出 |

## 改內容

1. **署名、定位、信箱、網址**：只改 [`src/config.ts`](src/config.ts)。`siteOrigin` 與 `basePath` 是單一來源。
2. **新文章**：在 `src/content/essays/` 新增 Markdown。檔名會變成網址；可以放子資料夾，例如 `notes/keep-scripts-near-the-mess.md` 會變成 `/essays/notes/keep-scripts-near-the-mess/`。
3. **主題**：在 `src/config.ts` 的 `topics` 增減；文章 frontmatter 的 `topics` 用對應 `slug`。

文章 frontmatter 範例：

```md
---
title: 標題
description: 一句摘要，給列表與 SEO 用
pubDate: 2026-05-20
updatedDate: 2026-09-10   # 選填，改過內容再加
topics:
  - books
---
```

`topics` 只接受 `src/config.ts` 裡定義過的 slug，打錯字會直接讓建置失敗。`updatedDate` 會同時寫進頁面、JSON-LD 的 `dateModified` 與 sitemap 的 `lastmod`。

## SEO

- **結構化資料**：文章頁輸出 `BlogPosting` 與 `BreadcrumbList`，主題頁輸出 `CollectionPage`，首頁與關於頁輸出 `WebSite` 與 `Person`。寫入頁面時會把 `<` 逸出成 `\u003c`。
- **社群分享圖**：每篇文章與每個主題在建置時自動產生 1200×630 PNG。文章圖走 `/og/essay/...`，避免檔名 `site.md` 蓋掉全站圖。
- **sitemap `lastmod`**：只讀 frontmatter 的 `updatedDate`（沒有就用 `pubDate`），含子資料夾。
- **日期**：畫面顯示固定 `Asia/Taipei`。
- **字型**：頁面用系統黑體。分享圖才在建置時讀取 Noto Sans TC。

推上 `main` 之後，GitHub Actions 會建置並發佈到 GitHub Pages。

## 部署

建置指令：`npm run build`  
輸出目錄：`dist`  
Node 版本：22 以上

## 第一版刻意沒做

留言、會員、課程購物車。訂閱先用 RSS。
