/* ═══════════════════════════════════════
   topCharts.js — GameRec Top Charts Page
   ═══════════════════════════════════════ */

// ── CONFIG ──────────────────────────────
// Ganti dengan API key RAWG kamu dari rawg.io/apidocs
const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b';
const BASE_URL = 'https://api.rawg.io/api';

function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── DATA ────────────────────────────────

const top10Data = [
  { rank: 1,  slug: 'elden-ring',                    name: 'Elden Ring: Shadow of the Erdtree', genre: 'Action RPG', studio: 'FromSoftware',   score: 95, tags: ['new'] },
  { rank: 2,  slug: 'cyberpunk-2077',                name: 'Cyberpunk 2077: Phantom Liberty',   genre: 'Action RPG', studio: 'CD PROJEKT RED', score: 89, tags: ['dlc'] },
  { rank: 3,  slug: 'ghost-of-tsushima',             name: 'Ghost of Tsushima',                genre: 'Open World', studio: 'Sucker Punch',    score: 91, tags: [] },
  { rank: 4,  slug: 'baldurs-gate-3',                name: "Baldur's Gate 3",                   genre: 'RPG',        studio: 'Larian Studios',  score: 96, tags: ['hot'] },
  { rank: 5,  slug: 'alan-wake-2',                   name: 'Alan Wake 2',                       genre: 'Survival Horror', studio: 'Remedy',     score: 88, tags: ['new'] },
  { rank: 6,  slug: 'star-wars-jedi-survivor',       name: 'Star Wars Jedi: Survivor',          genre: 'Action Adventure', studio: 'Respawn',   score: 85, tags: [] },
  { rank: 7,  slug: 'resident-evil-4-remake',        name: 'Resident Evil 4 Remake',            genre: 'Survival Horror', studio: 'Capcom',     score: 93, tags: ['hot'] },
  { rank: 8,  slug: 'god-of-war',                    name: 'God of War: Ragnarök',              genre: 'Action Adventure', studio: 'Santa Monica', score: 94, tags: [] },
  { rank: 9,  slug: 'hades',                         name: 'Hades II (Early Access)',           genre: 'Roguelike',  studio: 'Supergiant',      score: 90, tags: ['new'] },
  { rank: 10, slug: 'final-fantasy-xvi',             name: 'Final Fantasy XVI',                 genre: 'Action RPG', studio: 'Square Enix',    score: 87, tags: [] },
];

const mostSearched = [
  { term: 'open world RPG',         count: '2.1M searches', hot: true  },
  { term: 'competitive shooter',   count: '1.4M searches', hot: false },
  { term: 'indie deck-builder',    count: '1.4M searches', hot: false },
  { term: 'cozy horror',           count: '1.2M searches', hot: false },
];

const promoGame = {
  slug: 'the-talos-principle-2',
  badge: "Editor's Pick",
  title: 'Venture Beyond: The Eternal Gate',
  sub: '+84% sales ranking growth this week',
};

// Genre tabs → list of game slugs
const genreData = {
  All:      [
    { slug: 'the-witcher-3-wild-hunt',      name: 'Neo-Tokyo Shift',  genre: 'Action Shooter', score: 92 },
    { slug: 'hades',                         name: 'Prism of Souls',   genre: 'Roguelike',      score: 91 },
    { slug: 'dark-souls-iii',               name: 'Crown & Blade',    genre: 'Souls-like',     score: 90 },
    { slug: 'hollow-knight',                name: 'Pixel Pioneers',   genre: 'Indie RPG',      score: 94 },
  ],
  Action:   [
    { slug: 'doom-eternal',                 name: 'DOOM Eternal',      genre: 'FPS',            score: 93 },
    { slug: 'devil-may-cry-5',             name: 'Devil May Cry 5',   genre: 'Stylish Action', score: 90 },
    { slug: 'sekiro-shadows-die-twice',    name: 'Sekiro',            genre: 'Action',         score: 90 },
    { slug: 'god-of-war',                  name: 'God of War',        genre: 'Action Adv.',    score: 94 },
  ],
  RPG:      [
    { slug: 'baldurs-gate-3',              name: "Baldur's Gate 3",   genre: 'RPG',            score: 96 },
    { slug: 'elden-ring',                  name: 'Elden Ring',        genre: 'Action RPG',     score: 96 },
    { slug: 'the-witcher-3-wild-hunt',     name: 'The Witcher 3',     genre: 'Open World RPG', score: 92 },
    { slug: 'cyberpunk-2077',              name: 'Cyberpunk 2077',    genre: 'Action RPG',     score: 89 },
  ],
  Indie:    [
    { slug: 'hollow-knight',               name: 'Hollow Knight',     genre: 'Metroidvania',   score: 90 },
    { slug: 'hades',                       name: 'Hades',             genre: 'Roguelike',      score: 93 },
    { slug: 'celeste',                     name: 'Celeste',           genre: 'Platformer',     score: 94 },
    { slug: 'disco-elysium',               name: 'Disco Elysium',     genre: 'RPG',            score: 97 },
  ],
  Strategy: [
    { slug: 'crusader-kings-iii',          name: 'Crusader Kings III', genre: 'Grand Strategy', score: 91 },
    { slug: 'civilization-vi',             name: 'Civilization VI',   genre: 'Turn-Based',     score: 88 },
    { slug: 'total-war-warhammer-iii',    name: 'Total War: Warhammer III', genre: 'Strategy', score: 85 },
    { slug: 'age-of-empires-iv',           name: 'Age of Empires IV', genre: 'RTS',            score: 84 },
  ],
};

const risingData = [
  { slug: 'palworld',      name: 'Tiny Legends',    platform: 'Mobile / PC',   stat: '+61K', color: 'green', label: 'Viral Trend Detected', pct: 85 },
  { slug: 'starfield',     name: 'Apex Velocity',   platform: 'Console / PC',  stat: '+32%', color: 'orange', label: 'Crowd Favorite',      pct: 65 },
  { slug: 'alan-wake-2',   name: 'Silenced Whispers', platform: 'All / HD',    stat: '+0%',  color: 'blue',   label: 'Critical Acclaim',    pct: 50 },
];

// ── IMAGE CACHE ──────────────────────────
const imgCache = {};
async function fetchGameImg(slug) {
  if (imgCache[slug] !== undefined) return imgCache[slug];
  try {
    const res = await fetch(apiUrl(`games/${slug}`));
    if (!res.ok) { imgCache[slug] = null; return null; }
    const d = await res.json();
    imgCache[slug] = d.background_image || null;
    return imgCache[slug];
  } catch {
    imgCache[slug] = null;
    return null;
  }
}

// Helper: replace placeholder with loaded image
function loadImg(slug, phId, imgClass, cb) {
  fetchGameImg(slug).then(src => {
    const ph = document.getElementById(phId);
    if (!src || !ph) return;
    const img = document.createElement('img');
    img.className = imgClass;
    img.alt = slug;
    img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); if (cb) cb(img); };
    img.src = src;
  });
}

// ── TOP 10 ───────────────────────────────
function renderTop10() {
  const list = document.getElementById('top10-list');
  list.innerHTML = '';

  top10Data.forEach(g => {
    const rankClass = g.rank <= 3 ? `rank-${g.rank}` : '';
    const tagsHtml = g.tags.map(t => `<span class="tag-pill tag-${t}">${t.toUpperCase()}</span>`).join('');
    const rankLabel = g.rank < 10 ? `0${g.rank}` : `${g.rank}`;

    const item = document.createElement('div');
    item.className = `top10-item ${rankClass}`;
    item.innerHTML = `
      <div class="rank-num">${rankLabel}</div>
      <div class="top10-thumb-ph shimmer" id="t10-${g.slug}" style="width:52px;height:52px;border-radius:8px;flex-shrink:0;"></div>
      <div class="top10-info">
        <div class="top10-name">${g.name}</div>
        <div class="top10-meta">${g.studio} &bull; ${g.genre}</div>
        ${tagsHtml ? `<div class="top10-tags">${tagsHtml}</div>` : ''}
      </div>
      <div class="top10-score">${g.score}</div>`;
    list.appendChild(item);
    makeClickable(item, g.slug);

    loadImg(g.slug, `t10-${g.slug}`, 'top10-thumb');
  });
}

// ── MOST SEARCHED ────────────────────────
function renderMostSearched() {
  const box = document.getElementById('most-searched');
  box.innerHTML = '';
  mostSearched.forEach(s => {
    const row = document.createElement('div');
    row.className = 'search-row';
    row.innerHTML = `
      <span class="search-term">${s.term}</span>
      ${s.hot
        ? '<span class="search-hot">HOT</span>'
        : `<span class="search-count">${s.count}</span>`}`;
    box.appendChild(row);
    makeClickable(item, g.slug);
  });
}

// ── PROMO CARD ───────────────────────────
function renderPromo() {
  fetchGameImg(promoGame.slug).then(src => {
    const ph = document.getElementById('promo-ph');
    if (!ph) return;
    if (src) {
      const img = document.createElement('img');
      img.className = 'promo-img';
      img.alt = promoGame.title;
      img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
      img.src = src;
    }
  });
}

// ── GENRE TABS ───────────────────────────
let activeGenre = 'All';

function renderGenreGrid(genre) {
  const grid = document.getElementById('genre-grid');
  const games = genreData[genre] || genreData['All'];
  grid.innerHTML = '';

  games.forEach(g => {
    const card = document.createElement('div');
    card.className = 'genre-card';
    const uid = `gc-${genre}-${g.slug}`;
    card.innerHTML = `
      <div class="genre-card-ph shimmer" id="${uid}" style="width:100%;height:100%;position:absolute;inset:0;"></div>
      <div class="genre-score">${g.score}</div>
      <div class="genre-card-overlay">
        <div class="genre-card-title">${g.name}</div>
        <div class="genre-card-meta">${g.genre}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);
    loadImg(g.slug, uid, '');
  });
}

function initGenreTabs() {
  const tabs = document.querySelectorAll('.genre-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGenre = tab.dataset.genre;
      renderGenreGrid(activeGenre);
    });
  });
  renderGenreGrid('All');
}

// ── RISING GAMES ─────────────────────────
function renderRising() {
  const grid = document.getElementById('rising-grid');
  grid.innerHTML = '';

  risingData.forEach(g => {
    const card = document.createElement('div');
    card.className = 'rising-card';
    const uid = `rising-${g.slug}`;
    const badgeClass = g.color === 'green' ? '' : g.color;
    const barClass = g.color === 'green' ? '' : g.color;

    const labelIcon = g.color === 'green'
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
      : g.color === 'orange'
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffa040" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#80b8ff" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

    card.innerHTML = `
      <div class="rising-card-top">
        <div class="rising-thumb-ph shimmer" id="${uid}" style="width:46px;height:46px;border-radius:8px;flex-shrink:0;"></div>
        <div>
          <div class="rising-name">${g.name}</div>
          <div class="rising-platform">${g.platform}</div>
        </div>
        <div class="rising-stat-badge ${badgeClass}">${g.stat}</div>
      </div>
      <div class="rising-bar-wrap">
        <div class="rising-bar ${barClass}" data-pct="${g.pct}"></div>
      </div>
      <div class="rising-label">${labelIcon} ${g.label}</div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);

    loadImg(g.slug, uid, 'rising-thumb');
  });

  // Animate bars after a short delay
  setTimeout(() => {
    document.querySelectorAll('.rising-bar').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 300);
}

// ── SEARCH ──────────────────────────────
let searchTimer;
function handleSearch(val) {
  clearTimeout(searchTimer);
  if (!val.trim()) return;
  searchTimer = setTimeout(async () => {
    try {
      const res = await fetch(apiUrl('games', { search: val, page_size: 4 }));
      const data = await res.json();
      if (!data.results?.length) return;
      // Update genre grid with search results
      const grid = document.getElementById('genre-grid');
      grid.innerHTML = '';
      data.results.slice(0, 4).forEach(g => {
        const card = document.createElement('div');
        card.className = 'genre-card';
        const uid = `sr-${g.id}`;
        card.innerHTML = `
          <div class="genre-card-ph shimmer" id="${uid}" style="width:100%;height:100%;position:absolute;inset:0;"></div>
          <div class="genre-score">${g.metacritic || Math.round(g.rating * 20) || '?'}</div>
          <div class="genre-card-overlay">
            <div class="genre-card-title">${g.name}</div>
            <div class="genre-card-meta">${g.genres?.map(x => x.name).join(', ') || 'Game'}</div>
          </div>`;
        grid.appendChild(card);
        makeClickable(card, g.slug);
        if (g.background_image) {
          const ph = document.getElementById(uid);
          const img = document.createElement('img');
          img.alt = g.name;
          img.onload = () => { img.classList.add('loaded'); ph && ph.replaceWith(img); };
          img.src = g.background_image;
        }
      });
    } catch (e) { console.error(e); }
  }, 600);
}

// ── MOBILE MENU ──────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── INIT ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTop10();
  renderMostSearched();
  renderPromo();
  initGenreTabs();
  renderRising();
});