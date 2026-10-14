/* common.js — 小工具集共用腳本。每個頁面的 <head> 都會載入。
   1. 主題：套用已儲存的主題、建立 #themes 色票，並同步給內嵌的 iframe。
   2. 分頁容器：.tabs 內帶 data-pane 的按鈕，切換對應 #pane-<名稱> 區塊。
   3. 內嵌模式：頁面被放進 iframe 時，body 會加上 .embedded 並回報內容高度。
   4. 外層頁面：iframe.tool-frame 會自動同步主題；未加 .fill 的還會自動調整高度。 */
(function () {
  'use strict';

  const KEY = 'tools-theme';
  const THEMES = [
    ['auto', '跟隨系統', '#ffffff', '#2b313c'],
    ['light', '淺色', '#f5f6f7', '#4f729b'],
    ['dark', '深色', '#232831', '#88c0d0'],
    ['sepia', '護眼米黃', '#f3efe7', '#8c6a43'],
    ['forest', '森林綠', '#eff2ee', '#4f7a62'],
    ['ocean', '深海藍', '#1b2631', '#7fb7cc'],
    ['dracula', '紫夜', '#252833', '#a8a0d6'],
  ];
  const root = document.documentElement;
  const embedded = window.self !== window.top;

  const frames = () => [...document.querySelectorAll('iframe.tool-frame')];
  const isTheme = t => THEMES.some(x => x[0] === t);

  function storedTheme() {
    try {
      const t = localStorage.getItem(KEY) || localStorage.getItem('diff-theme');
      return isTheme(t) ? t : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function postTheme(frame, theme) {
    try {
      frame.contentWindow.postMessage({ type: 'tools-theme', theme }, '*');
    } catch (e) {}
  }

  function applyTheme(theme, { save = true, broadcast = true } = {}) {
    if (theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = theme;
    if (save) {
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {}
    }
    document.querySelectorAll('.sw').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    if (broadcast) frames().forEach(f => postTheme(f, theme));
  }

  function buildSwatches() {
    const box = document.getElementById('themes');
    if (!box) return;
    THEMES.forEach(([id, name, c1, c2]) => {
      const b = document.createElement('button');
      b.className = 'sw';
      b.dataset.t = id;
      b.title = name;
      b.setAttribute('aria-label', name);
      b.style.background = `linear-gradient(135deg,${c1} 50%,${c2} 50%)`;
      b.onclick = () => applyTheme(id);
      box.appendChild(b);
    });
  }

  function initPaneTabs() {
    const buttons = document.querySelectorAll('.tabs [data-pane]');
    buttons.forEach(b =>
      b.addEventListener('click', () => {
        buttons.forEach(x => {
          const on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-selected', String(on));
        });
        document.querySelectorAll('.pane').forEach(p => p.classList.toggle('on', p.id === 'pane-' + b.dataset.pane));
      })
    );
  }

  function initEmbedded() {
    document.body.classList.add('embedded');
    const sendHeight = () => window.parent.postMessage({ type: 'tools-iframe-height', height: Math.ceil(document.body.scrollHeight) }, '*');
    if (typeof ResizeObserver === 'function') new ResizeObserver(sendHeight).observe(document.body);
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
  }

  // 先套用主題，避免畫面閃爍
  applyTheme(storedTheme(), { save: false, broadcast: false });

  window.addEventListener('message', e => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'tools-theme' && embedded && e.source === window.parent && isTheme(d.theme)) {
      applyTheme(d.theme, { broadcast: false });
    } else if (d.type === 'tools-iframe-height' && Number.isFinite(d.height)) {
      const frame = frames().find(f => f.contentWindow === e.source);
      if (frame && !frame.classList.contains('fill')) frame.style.height = Math.max(420, Math.min(30000, Math.ceil(d.height))) + 'px';
    }
  });

  // iframe 載入完成時，把目前主題傳給它
  document.addEventListener(
    'load',
    e => {
      if (e.target.matches && e.target.matches('iframe.tool-frame')) postTheme(e.target, storedTheme());
    },
    true
  );

  document.addEventListener('DOMContentLoaded', () => {
    buildSwatches();
    applyTheme(storedTheme(), { save: false, broadcast: false });
    initPaneTabs();
    if (embedded) initEmbedded();
  });
})();
