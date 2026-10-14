# 小工具集

純前端工具網站，直接以瀏覽器開啟 `index.html` 即可使用。

## 檔案結構

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 首頁，列出所有工具卡片（可拖曳調整順序） |
| `style.css` | 全站共用外觀：主題色、版面、元件、內嵌模式 |
| `common.js` | 全站共用行為：主題切換、分頁容器、iframe 內嵌與高度同步 |
| `*_tool.html`、`txtcompare.html`、`table_compare.html` | 各工具頁 |
| `image_suite.html` | 「圖片處理與編輯」整合頁（內嵌 `image_tool.html`、`photo_editor.html`） |
| `emoji_suite.html` | 「Emoji／特殊符號圖庫」整合頁（內嵌 `emoji_tool.html`、`symbol_tool.html`） |
| `pdf_tool.html` | PDF 工具；「個資遮蔽」分頁內嵌 `redact_tool.html` |

被內嵌的頁面（`image_tool`、`photo_editor`、`emoji_tool`、`symbol_tool`、`redact_tool`）單獨開啟也能使用；
放進 iframe 時，`common.js` 會自動隱藏標題列並回報高度，不需要各頁自己處理。

## 頁面共同規範

- `<head>` 順序固定：charset、viewport、title、robots／googlebot／referrer、icon、字型、`common.js`、（頁面專屬腳本）、`<style>`、`style.css`。
- 標題列固定為：返回連結（`← 返回小工具集首頁`）、`<h1>`、`<p class="tagline">`、`<div class="themes" id="themes">`。
- 主題切換不必自己寫，頁面放好 `#themes` 即可，`common.js` 會建立色票。
- 整合頁的子頁籤：按鈕寫 `data-pane="名稱"`，內容區用 `<section class="pane" id="pane-名稱">`；
  內嵌頁用 `<iframe class="tool-frame">`（需要固定高度、內部自行捲動時加 `fill`）。

## 新增工具頁

1. 複製任一現有工具頁，保留 `<head>` 與標題列的結構，改標題、說明與內容。
2. 在 `index.html` 的 `<nav class="menu">` 加一張 `<a class="tool">` 卡片。

## 程式格式

全站使用 Prettier 統一排版（設定在 `.prettierrc.json`：2 空格縮排、單引號、行寬 140）。修改後執行：

```
npx prettier --write "*.{html,css,js}"
```
