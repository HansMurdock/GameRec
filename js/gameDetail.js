/* ════════════════════════════════════════
   gameDetail.js — GameRec Game Detail Page
   ════════════════════════════════════════ */

// ── CONFIG ─────────────────────────────
const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Ganti dengan API key RAWG kamu
const BASE_URL = 'https://api.rawg.io/api';

function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── GAME DATABASE ────────────────────────
// Data lengkap untuk setiap game yang bisa dibuka detail-nya
const GAME_DB = {
  'elden-ring': {
    slug:        'elden-ring',
    name:        'Elden Ring',
    score:       96,
    tags:        ['GOTS Winner', 'RPG'],
    desc: `<p>In the Lands Between ruled by Queen Marika the Eternal, the Elden Ring, the source of the Erdtree, has been shattered. Marika's offspring, demigods all, claimed the shards of the Elden Ring known as the Great Runes, and the mad taint of their newfound strength triggered a war. The Shattering, a war that meant abandonment by the Greater Will.</p>
           <p>And now the guidance of grace will be brought to the Tarnished who were spurned by the grace of gold and exiled from the Lands Between. In dead who yet live, your grace long lost, follow the path to the Lands Between beyond the foggy sea to stand before the Elden Ring.</p>`,
    platforms: ['PC', 'PS5', 'Xbox X|S'],
    genres:    ['Action RPG', 'Open World', 'Dark Fantasy'],
    developer:   'FromSoftware',
    publisher:   'Bandai Namco',
    releaseDate: 'Feb 25, 2022',
    players:     'Single / Coop / PvP',
    specsMin: {
      os:        'Windows 10',
      processor: 'Intel Core i5-8600K',
      memory:    '12 GB RAM',
      graphics:  'GTX 1060 3GB / RX 580 4GB',
      storage:   '60 GB',
    },
    specsRec: {
      os:        'Windows 11 / 10',
      processor: 'Intel i7-8700K / Ryzen 5 3600X',
      memory:    '16 GB RAM',
      graphics:  'GTX 1070 8GB / RX Vega 56 8GB',
      storage:   '60 GB SSD',
    },
    similar: ['dark-souls-iii', 'sekiro-shadows-die-twice', 'bloodborne', 'lords-of-the-fallen'],
    similarNames: ["Dark Souls III", "Sekiro: Shadows Die Twice", "Bloodborne", "Lords of the Fallen"],
    similarScores: [89, 91, 92, 73],
    similarDescs: [
      "Prepare to die, again. The most punishing entry in the Souls trilogy.",
      "Carve your own forsaken path in this grueling adventure from FromSoftware.",
      "Face the nightmare of Yharnam in this visceral PS5 masterpiece.",
      "A souls-adjacent RPG adventure with its own flavor of punishing gameplay.",
    ],
  },
  'baldurs-gate-3': {
    slug:        'baldurs-gate-3',
    name:        "Baldur's Gate 3",
    score:       96,
    tags:        ['GOTY 2023', 'RPG'],
    desc: `<p>Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you, drawn from a Mind Flayer parasite planted in your brain. Resist and turn darkness against itself, or embrace corruption and become the ultimate evil.</p>
           <p>From the creators of Divinity: Original Sin 2 comes a next-generation RPG, set in the world of Dungeons & Dragons. Choose from a wide selection of D&D races and classes, or play as an Origin character with a hand-crafted background.</p>`,
    platforms: ['PC', 'PS5'],
    genres:    ['RPG', 'Turn-Based', 'Co-op'],
    developer:   'Larian Studios',
    publisher:   'Larian Studios',
    releaseDate: 'Aug 3, 2023',
    players:     'Single / Online Co-op',
    specsMin: {
      os:        'Windows 10 64-bit',
      processor: 'Intel i7-8700K / AMD Ryzen 5 3600',
      memory:    '8 GB RAM',
      graphics:  'NVIDIA GTX 1060 Super / RX 5500 XT',
      storage:   '150 GB SSD',
    },
    specsRec: {
      os:        'Windows 10 64-bit',
      processor: 'Intel i7 10700K / AMD Ryzen 5 5600X',
      memory:    '16 GB RAM',
      graphics:  'NVIDIA RTX 2060 Super / RX 5700 XT',
      storage:   '150 GB SSD',
    },
    similar: ['divinity-original-sin-2-definitive-edition', 'pathfinder-wrath-of-the-righteous', 'tyranny', 'pillars-of-eternity-2-deadfire'],
    similarNames: ["Divinity: Original Sin 2", "Pathfinder: Wrath of the Righteous", "Tyranny", "Pillars of Eternity II"],
    similarScores: [93, 85, 82, 89],
    similarDescs: [
      "The spiritual predecessor from Larian — still one of the best CRPGs ever made.",
      "Command mythic powers in this deep Pathfinder adventure.",
      "Play as the villain in this unique RPG with a morally complex world.",
      "Sail the seas and forge your legacy in this expansive sequel.",
    ],
  },
  'hades': {
    slug:        'hades',
    name:        'Hades',
    score:       93,
    tags:        ['Indie GOTY', 'Roguelike'],
    desc: `<p>Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor. Wield the powers and mythic weapons of Olympus to grow stronger and escape the clutches of the god of the dead.</p>
           <p>Battle through the ever-changing Underworld and use the gifts of Olympian gods to enhance your abilities and strength. Uncover the story of the House of Hades as you battle through the never-ending stream of enemies.</p>`,
    platforms: ['PC', 'PS5', 'Switch'],
    genres:    ['Roguelike', 'Action', 'Indie'],
    developer:   'Supergiant Games',
    publisher:   'Supergiant Games',
    releaseDate: 'Sep 17, 2020',
    players:     'Single Player',
    specsMin: {
      os:        'Windows 7 SP1',
      processor: 'Dual Core 2.4 GHz',
      memory:    '4 GB RAM',
      graphics:  'NVIDIA GTX 150 / ATI HD 4600',
      storage:   '15 GB',
    },
    specsRec: {
      os:        'Windows 10',
      processor: 'Dual Core 3.0 GHz+',
      memory:    '8 GB RAM',
      graphics:  'NVIDIA GTX 1060 / AMD equivalent',
      storage:   '15 GB SSD',
    },
    similar: ['dead-cells', 'hollow-knight', 'celeste', 'returnal'],
    similarNames: ["Dead Cells", "Hollow Knight", "Celeste", "Returnal"],
    similarScores: [88, 90, 94, 86],
    similarDescs: [
      "A punishing roguelike with tight movement and satisfying combat.",
      "Explore a dark underground kingdom in this acclaimed Metroidvania.",
      "A love letter to precision platformers with a touching story.",
      "Relive time loops on a hostile alien planet in this action rogue-lite.",
    ],
  },
  'cyberpunk-2077': {
    slug:        'cyberpunk-2077',
    name:        'Cyberpunk 2077',
    score:       86,
    tags:        ['Open World', 'Action RPG'],
    desc: `<p>Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary known as V. In a world of violent conflict, you'll customize your character and playstyle as you take on jobs, build a reputation, and unlock augmentations and upgrades.</p>
           <p>With the Phantom Liberty expansion, a new spy-thriller adventure awaits in the dangerous Dogtown district. Pursue the wishes of the New United States President in this expansion that changes the base game's ending.</p>`,
    platforms: ['PC', 'PS5', 'Xbox X|S'],
    genres:    ['Action RPG', 'Open World', 'Sci-Fi'],
    developer:   'CD PROJEKT RED',
    publisher:   'CD PROJEKT',
    releaseDate: 'Dec 10, 2020',
    players:     'Single Player',
    specsMin: {
      os:        'Windows 10 (64-bit)',
      processor: 'Intel Core i7-6700 / AMD Ryzen 5 1600',
      memory:    '12 GB RAM',
      graphics:  'NVIDIA GTX 1060 6GB / AMD RX 590',
      storage:   '70 GB SSD',
    },
    specsRec: {
      os:        'Windows 11 (64-bit)',
      processor: 'Intel Core i9-12900 / AMD Ryzen 9 7900X',
      memory:    '16 GB RAM',
      graphics:  'NVIDIA RTX 3080 / AMD RX 7900 XTX',
      storage:   '70 GB SSD',
    },
    similar: ['the-witcher-3-wild-hunt', 'deus-ex-mankind-divided', 'ghostrunner', 'control-ultimate-edition'],
    similarNames: ["The Witcher 3", "Deus Ex: Mankind Divided", "Ghostrunner", "Control"],
    similarScores: [92, 84, 80, 82],
    similarDescs: [
      "The gold standard for open world RPGs from CD PROJEKT RED.",
      "Augment your way through a cyberpunk conspiracy in this immersive sim.",
      "A lightning-fast cyberpunk parkour slasher that demands perfection.",
      "Discover the strange secrets of the Bureau in this reality-bending shooter.",
    ],
  },
};

// Default fallback for unknown slugs
const DEFAULT_GAME = GAME_DB['elden-ring'];

// ── HELPERS ─────────────────────────────
const imgCache = {};
async function fetchGameImg(slug) {
  if (imgCache[slug] !== undefined) return imgCache[slug];
  try {
    const res = await fetch(apiUrl(`games/${slug}`));
    if (!res.ok) { imgCache[slug] = null; return null; }
    const d = await res.json();
    imgCache[slug] = d.background_image || null;
    return imgCache[slug];
  } catch { imgCache[slug] = null; return null; }
}

function scoreClass(s) {
  if (s >= 95) return 'gold';
  if (s >= 85) return 'great';
  return 'good';
}

const genreClassMap = {
  'Action RPG':    'gp-action',
  'Action':        'gp-action',
  'Open World':    'gp-openworld',
  'Dark Fantasy':  'gp-souls',
  'RPG':           'gp-rpg',
  'Turn-Based':    'gp-strategy',
  'Co-op':         'gp-adventure',
  'Roguelike':     'gp-souls',
  'Indie':         'gp-indie',
  'Sci-Fi':        'gp-adventure',
  'Adventure':     'gp-adventure',
  'Strategy':      'gp-strategy',
  'Horror':        'gp-horror',
};

const platformIcons = {
  'PC':       `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>`,
  'PS5':      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/><path d="M8 10v4"/><path d="M6 12h4"/></svg>`,
  'Xbox X|S': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg>`,
  'Switch':   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="12" y1="5" x2="12" y2="19"/></svg>`,
};

// ── GET SLUG FROM URL ────────────────────
function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('game') || 'elden-ring';
}

// ── RENDER HERO ──────────────────────────
async function renderHero(game) {
  // Title + tags
  document.getElementById('hero-title').textContent = game.name;
  document.getElementById('hero-score-num').textContent = game.score;
  document.getElementById('hero-score-num').className = `meta-score-num ${scoreClass(game.score)}`;

  const tagsWrap = document.getElementById('hero-tags');
  tagsWrap.innerHTML = game.tags.map(t => `<span class="hero-tag">${t}</span>`).join('');

  // Description preview
  document.getElementById('hero-desc').textContent =
    game.desc.replace(/<[^>]+>/g, '').slice(0, 160) + '...';

  // Page title
  document.title = `${game.name} — GameRec`;

  // Hero image
  const src = await fetchGameImg(game.slug);
  if (src) {
    const img = document.getElementById('hero-img');
    img.onload = () => img.classList.add('loaded');
    img.src = src;
  }
}

// ── RENDER DESCRIPTION ───────────────────
function renderDescription(game) {
  const wrap = document.getElementById('desc-text');
  const full = game.desc;
  const short = full.replace(/<[^>]+>/g, '').slice(0, 400);
  const isLong = full.replace(/<[^>]+>/g, '').length > 400;

  wrap.innerHTML = `<p>${short}${isLong ? '...' : ''}</p>`;

  if (isLong) {
    const btn = document.getElementById('read-more-btn');
    btn.style.display = 'inline-flex';
    let expanded = false;
    btn.onclick = () => {
      expanded = !expanded;
      wrap.innerHTML = expanded ? full : `<p>${short}...</p>`;
      btn.innerHTML = expanded
        ? `Show less <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>`
        : `Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>`;
    };
  }
}

// ── RENDER SPECS ─────────────────────────
function renderSpecs(game) {
  const specRows = (specs) =>
    Object.entries({ OS: specs.os, Processor: specs.processor, Memory: specs.memory, Graphics: specs.graphics, Storage: specs.storage })
      .map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  document.getElementById('specs-min').innerHTML = specRows(game.specsMin);
  document.getElementById('specs-rec').innerHTML = specRows(game.specsRec);
}

// ── RENDER SIDEBAR ───────────────────────
function renderSidebar(game) {
  // Platforms
  const plWrap = document.getElementById('sidebar-platforms');
  plWrap.innerHTML = game.platforms.map(p =>
    `<div class="platform-pill">${platformIcons[p] || ''} ${p}</div>`
  ).join('');

  // Genres
  const gnWrap = document.getElementById('sidebar-genres');
  gnWrap.innerHTML = game.genres.map(g =>
    `<span class="genre-pill-sb ${genreClassMap[g] || 'gp-adventure'}">${g}</span>`
  ).join('');

  // Info rows
  document.getElementById('info-developer').textContent   = game.developer;
  document.getElementById('info-publisher').textContent    = game.publisher;
  document.getElementById('info-release').textContent     = game.releaseDate;
  document.getElementById('info-players').textContent     = game.players;
}

// ── RENDER SIMILAR ───────────────────────
async function renderSimilar(game) {
  const grid = document.getElementById('similar-grid');
  grid.innerHTML = '';

  for (let i = 0; i < game.similar.length; i++) {
    const slug  = game.similar[i];
    const name  = game.similarNames[i];
    const score = game.similarScores[i];
    const desc  = game.similarDescs[i];
    const uid   = `sim-${slug}`;

    const card = document.createElement('div');
    card.className = 'sim-card fade-in';
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="sim-card-img-wrap">
        <div class="shimmer" id="${uid}" style="width:100%;height:100%;min-height:100px;position:absolute;inset:0;"></div>
        <div class="sim-score">${score}</div>
      </div>
      <div class="sim-card-body">
        <div class="sim-card-title">${name}</div>
        <div class="sim-card-desc">${desc}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, slug)

    // Click to open detail
    card.addEventListener('click', () => {
      window.location.href = `gameDetail.html?game=${slug}`;
    });

    // Load image
    fetchGameImg(slug).then(src => {
      const ph = document.getElementById(uid);
      if (!src || !ph) return;
      const img = document.createElement('img');
      img.className = 'sim-card-img';
      img.alt = name;
      img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
      img.src = src;
    });
  }
}

// ── NAV SCROLL EFFECT ────────────────────
function initNavScroll() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── MOBILE MENU ──────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const slug = getSlugFromUrl();
  const game = GAME_DB[slug] || DEFAULT_GAME;

  initNavScroll();
  await renderHero(game);
  renderDescription(game);
  renderSpecs(game);
  renderSidebar(game);
  await renderSimilar(game);
});

// ── CALLED FROM OTHER PAGES ──────────────
// Helper untuk navigasi dari halaman lain (index, browse, dll)
function openGameDetail(slug) {
  window.location.href = `gameDetail.html?game=${slug}`;
}