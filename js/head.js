// Loaded synchronously before the stylesheet on every page: sets js-enabled
// (so .js-enabled .reveal hides correctly from first paint) and data-theme
// (so light/dark colour tokens resolve before any paint, no colour flash).
// External file rather than inline so the CSP can stay script-src 'self'.
document.documentElement.classList.add('js-enabled');
document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);
