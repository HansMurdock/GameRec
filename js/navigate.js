function getDetailPath(slug) {
  const inHtmlFolder = window.location.pathname.includes('/html/');
  const base = inHtmlFolder ? 'gameDetail.html' : 'html/gameDetail.html';
  return `${base}?game=${slug}`;
}

function goToGame(slug) {
  if (!slug) return;
  window.location.href = getDetailPath(slug);
}

function makeClickable(el, slug) {
  if (!el || !slug) return;
  el.style.cursor = 'pointer';
  el.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    goToGame(slug);
  });
}