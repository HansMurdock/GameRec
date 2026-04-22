// ── CONFIG ──
// Daftar ke rawg.io untuk API key gratis: https://rawg.io/apidocs
// Ganti string di bawah dengan API key kamu (opsional tapi disarankan)
const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Atau kosongkan untuk tanpa key (rate limited)

const BASE = 'https://api.rawg.io/api';
function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE}/${path}?${p}`;
}

// ── DATA ──
const heroGames = [
  { slug: 'elden-ring', name: 'Elden Ring', score: 96, desc: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.' },
  { slug: 'the-witcher-3-wild-hunt', name: 'The Witcher 3', score: 92, desc: 'Play as Geralt of Rivia, a monster hunter for hire, in this open-world RPG with a richly detailed fantasy universe.' },
  { slug: 'red-dead-redemption-2', name: 'Red Dead Redemption 2', score: 97, desc: 'An epic tale of life in America at the dawn of the modern age, starring outlaw Arthur Morgan and the Van der Linde gang.' },
];

const recommendedSlugs = [
  { slug: 'baldurs-gate-3', name: "Baldur's Gate 3", studio: 'Larian Studios', genre: 'RPG', score: 96 },
  { slug: 'hades', name: 'Hades II', studio: 'Supergiant Games', genre: 'Roguelike', score: 90 },
  { slug: 'cyberpunk-2077', name: 'Cyberpunk 2077', studio: 'CD PROJEKT RED', genre: 'Action RPG', score: 86 },
  { slug: 'red-dead-redemption-2', name: 'Red Dead 2', studio: 'Rockstar Games', genre: 'Adventure', score: 97 },
];

const trendingSlugs = [
  { slug: 'palworld', name: 'Palworld', genre: 'Survival Crafting', stat: '+960K Activity' },
  { slug: 'starfield', name: 'Starfield', genre: 'Space Exploration', stat: '+85% Activity' },
  { slug: 'helldivers-2', name: 'Helldivers 2', genre: 'Tactical Shooter', stat: '+110% Activity' },
];

const collectionSlugs = [
  { slug: 'devil-may-cry-5', name: 'DMC 5', genre: 'Stylish Action' },
  { slug: 'sekiro-shadows-die-twice', name: 'Sekiro', genre: 'Stealth Action' },
  { slug: 'doom-eternal', name: 'DOOM Eternal', genre: 'FPS Action' },
  { slug: 'god-of-war', name: 'God of War', genre: 'Action Adventure' },
];

const deepDiveSlugs = [
  { slug: 'the-witcher-3-wild-hunt', name: 'The Witcher 3', tag: 'Modern Classic', btn: 'Explore World' },
  { slug: 'dark-souls-iii', name: 'Dark Souls 3', tag: 'Hardcore RPG', btn: 'Prepare to Die' },
  { slug: 'the-elder-scrolls-v-skyrim', name: 'Skyrim', tag: 'Infinite Adventure', btn: 'Start Journey' },
];

const hofSlugs = [
  { slug: 'the-legend-of-zelda-ocarina-of-time', name: 'Ocarina of Time', studio: 'Nintendo • 1998', score: 99 },
  { slug: 'grand-theft-auto-iv', name: 'GTA IV', studio: 'Rockstar Games • 2008', score: 98 },
  { slug: 'soulcalibur', name: 'SoulCalibur', studio: 'Namco • 1999', score: 98 },
];

const dropsSlugs = [
  { slug: 'ghostrunner-2', name: 'Ghostrunner II', time: '4 days ago' },
  { slug: 'street-fighter-6', name: 'Street Fighter 6', time: '1 week ago' },
  { slug: 'final-fantasy-vii-rebirth', name: 'Final Fantasy VII Rebirth', time: '2 weeks ago' },
];

// ── FETCH GAME IMAGE ──
async function fetchGameImg(slug) {
  try {
    const res = await fetch(apiUrl(`games/${slug}`));
    if (!res.ok) return null;
    const d = await res.json();
    return d.background_image || null;
  } catch { return null; }
}

// ── HERO ──
async function initHero() {
  const g = heroGames[Math.floor(Math.random() * heroGames.length)];
  document.getElementById('hero-title').textContent = g.name;
  document.getElementById('hero-score').textContent = `${g.score} Metacritic`;
  document.getElementById('hero-desc').textContent = g.desc;

  const img = await fetchGameImg(g.slug);
  if (img) {
    const el = document.getElementById('hero-img');
    el.onload = () => el.classList.add('loaded');
    el.src = img;
  }
}

// ── RECOMMENDED ──
async function initRecommended() {
  const grid = document.getElementById('recommended-grid');
  grid.innerHTML = '';

  for (const g of recommendedSlugs) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const placeholder = document.createElement('div');
    placeholder.className = 'game-card-img-placeholder shimmer';
    placeholder.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#546070" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/><path d="M7 10h2m2-2v4m2-2h2"/></svg>`;

    const score = document.createElement('div');
    score.className = 'game-score-badge';
    score.textContent = g.score;

    const info = document.createElement('div');
    info.className = 'game-card-info';
    info.innerHTML = `<div class="game-card-title">${g.name}</div><div class="game-card-meta">${g.studio} • ${g.genre}</div>`;

    card.appendChild(placeholder);
    card.appendChild(score);
    card.appendChild(info);
    grid.appendChild(card);
    makeClickable(card, g.slug);

    // Load image async
    fetchGameImg(g.slug).then(src => {
      if (!src) return;
      const img = document.createElement('img');
      img.className = 'game-card-img';
      img.alt = g.name;
      img.style.display = 'block';
      img.onload = () => {
        placeholder.replaceWith(img);
        card.insertBefore(score, info);
      };
      img.src = src;
    });
  }
}

// ── TRENDING ──
async function initTrending() {
  const list = document.getElementById('trending-list');
  list.innerHTML = '';

  for (const g of trendingSlugs) {
    const item = document.createElement('div');
    item.className = 'trending-item';

    const thumb = document.createElement('div');
    thumb.className = 'trending-thumb shimmer';

    item.innerHTML = `
      <div class="trending-thumb shimmer" id="tt-${g.slug}"></div>
      <div class="trending-info">
        <div class="trending-name">${g.name}</div>
        <div class="trending-genre">${g.genre}</div>
      </div>
      <div class="trending-stat">${g.stat}</div>
    `;
    list.appendChild(item);
    makeClickable(item, g.slug);

    fetchGameImg(g.slug).then(src => {
      const el = document.getElementById(`tt-${g.slug}`);
      if (!src || !el) return;
      const img = document.createElement('img');
      img.className = 'trending-thumb';
      img.alt = g.name;
      img.onload = () => el.replaceWith(img);
      img.src = src;
    });
  }
}

// ── COLLECTION ──
async function initCollection() {
  const grid = document.getElementById('collection-grid');
  grid.innerHTML = '';

  for (const g of collectionSlugs) {
    const card = document.createElement('div');
    card.className = 'coll-card';
    card.innerHTML = `<div class="shimmer" style="width:100%;height:100%;position:absolute;inset:0;" id="cs-${g.slug}"></div>
      <div class="coll-card-overlay">
        <div class="coll-card-title">${g.name}</div>
        <div class="coll-card-genre">${g.genre}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);

    fetchGameImg(g.slug).then(src => {
      const ph = document.getElementById(`cs-${g.slug}`);
      if (!src || !ph) return;
      const img = document.createElement('img');
      img.alt = g.name;
      img.onload = () => {
        img.classList.add('loaded');
        ph.replaceWith(img);
      };
      img.src = src;
    });
  }
}

// ── SEARCH ──
let searchTimer;
function handleSearch(q) {
  clearTimeout(searchTimer);
  if (!q.trim()) return;
  searchTimer = setTimeout(async () => {
    try {
      const res = await fetch(apiUrl('games', { search: q, page_size: 4 }));
      const data = await res.json();
      if (!data.results || !data.results.length) return;

      const grid = document.getElementById('recommended-grid');
      grid.innerHTML = '';

      for (const g of data.results.slice(0, 4)) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
          <div class="game-card-img-placeholder" id="sr-${g.id}">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#546070" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
          </div>
          <div class="game-score-badge">${g.metacritic || g.rating_top * 10 || '?'}</div>
          <div class="game-card-info">
            <div class="game-card-title">${g.name}</div>
            <div class="game-card-meta">${g.genres?.map(x=>x.name).join(', ') || 'Game'}</div>
          </div>`;
        grid.appendChild(card);
        makeClickable(card, g.slug);

        if (g.background_image) {
          const ph = card.querySelector(`#sr-${g.id}`);
          const img = document.createElement('img');
          img.className = 'game-card-img';
          img.alt = g.name;
          img.onload = () => ph && ph.replaceWith(img);
          img.src = g.background_image;
        }
      }
    } catch(e) { console.error(e); }
  }, 600);
}

// ── DEEP DIVE ──
async function initDeepDive() {
  const grid = document.getElementById('deepdive-grid');
  grid.innerHTML = '';
  for (const g of deepDiveSlugs) {
    const card = document.createElement('div');
    card.className = 'deep-card';
    const uid = `dd-${g.slug}`;
    card.innerHTML = `
      <div class="shimmer" style="width:100%;height:100%;position:absolute;inset:0;border-radius:12px;" id="${uid}"></div>
      <div class="deep-card-overlay">
        <div class="deep-card-tag">${g.tag}</div>
        <div class="deep-card-title">${g.name}</div>
        <a href="#" class="deep-card-btn">
          ${g.btn}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);
    fetchGameImg(g.slug).then(src => {
      const ph = document.getElementById(uid);
      if (!src || !ph) return;
      const img = document.createElement('img');
      img.alt = g.name;
      img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
      img.src = src;
    });
  }
}

// ── HALL OF FAME ──
async function initHoF() {
  const grid = document.getElementById('hof-grid');
  grid.innerHTML = '';
  for (const g of hofSlugs) {
    const card = document.createElement('div');
    card.className = 'hof-card';
    const uid = `hof-${g.slug}`;
    card.innerHTML = `
      <div class="hof-card-img-ph shimmer" id="${uid}"></div>
      <div class="hof-score-badge">${g.score}</div>
      <div class="hof-card-info">
        <div class="hof-card-title">${g.name}</div>
        <div class="hof-card-meta">${g.studio}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug)
    fetchGameImg(g.slug).then(src => {
      const ph = document.getElementById(uid);
      if (!src || !ph) return;
      const img = document.createElement('img');
      img.className = 'hof-card-img';
      img.alt = g.name;
      img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
      img.src = src;
    });
  }
}

// ── LATEST DROPS ──
async function initDrops() {
  const grid = document.getElementById('drops-grid');
  grid.innerHTML = '';
  for (const g of dropsSlugs) {
    const card = document.createElement('div');
    card.className = 'drop-card';
    const uid = `drop-${g.slug}`;
    card.innerHTML = `
      <div class="drop-card-img-ph shimmer" id="${uid}"></div>
      <div class="drop-new-badge">NEW</div>
      <div class="drop-card-info">
        <div class="drop-card-title">${g.name}</div>
        <div class="drop-card-time">${g.time}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);
    fetchGameImg(g.slug).then(src => {
      const ph = document.getElementById(uid);
      if (!src || !ph) return;
      const img = document.createElement('img');
      img.className = 'drop-card-img';
      img.alt = g.name;
      img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
      img.src = src;
    });
  }
}

// ── GENRE PILLS ──
function initGenres() {
  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── COLLECTION SCROLL (future: implement carousel) ──
let collPage = 0;
function scrollCollection(dir) {
  // On mobile this would scroll; on desktop it could load different games
  console.log('Collection nav:', dir);
}

// ── INIT ──
initHero();
initRecommended();
initTrending();
initCollection();
initDeepDive();
initHoF();
initDrops();
initGenres();