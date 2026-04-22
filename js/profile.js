/* ══════════════════════════════════
   profile.js — GameRec Profile Page
   ══════════════════════════════════ */

// navigate.js di-load terlebih dahulu via <script> di HTML

const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Ganti dengan API key RAWG kamu
const BASE_URL = 'https://api.rawg.io/api';
function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── USER DATA ────────────────────────────
const USER = {
  name:     'Alex Ryuken',
  username: '@alexryuken',
  initials: 'AR',
  level:    42,
  badges:   ['Pro Member', 'Top Critic'],
  joined:   'Member since Jan 2022',
  stats: {
    library:      138,
    wishlist:     24,
    reviews:      47,
    achievements: 312,
    hoursPlayed:  '2.4K',
    avgScore:     '8.6',
  },
};

// ── GAME DATA ─────────────────────────────
const libraryGames = [
  { slug: 'elden-ring',                name: 'Elden Ring',         genre: 'Action RPG', score: 96, status: 'Playing',  progress: 68, hours: '68h' },
  { slug: 'baldurs-gate-3',            name: "Baldur's Gate 3",    genre: 'RPG',        score: 96, status: 'Playing',  progress: 42, hours: '120h' },
  { slug: 'hades',                     name: 'Hades',              genre: 'Roguelike',  score: 93, status: 'Finished', progress: 100, hours: '45h' },
  { slug: 'red-dead-redemption-2',     name: 'Red Dead 2',         genre: 'Adventure',  score: 97, status: 'Finished', progress: 100, hours: '90h' },
  { slug: 'cyberpunk-2077',            name: 'Cyberpunk 2077',     genre: 'Action RPG', score: 86, status: 'Dropped',  progress: 31, hours: '22h' },
  { slug: 'the-witcher-3-wild-hunt',   name: 'The Witcher 3',      genre: 'RPG',        score: 92, status: 'Finished', progress: 100, hours: '130h' },
];

const wishlistGames = [
  { slug: 'sekiro-shadows-die-twice',  name: 'Sekiro',             genre: 'Action',     score: 90, releaseDate: 'Available now' },
  { slug: 'ghost-of-tsushima',         name: 'Ghost of Tsushima',  genre: 'Open World', score: 91, releaseDate: 'Available now' },
  { slug: 'alan-wake-2',               name: 'Alan Wake 2',        genre: 'Horror',     score: 88, releaseDate: 'Available now' },
  { slug: 'hollow-knight',             name: 'Hollow Knight',      genre: 'Metroidvania', score: 90, releaseDate: 'Available now' },
  { slug: 'celeste',                   name: 'Celeste',            genre: 'Platformer', score: 94, releaseDate: 'Available now' },
  { slug: 'doom-eternal',              name: 'DOOM Eternal',       genre: 'FPS',        score: 93, releaseDate: 'Available now' },
];

const reviewedGames = [
  { slug: 'elden-ring',               name: 'Elden Ring',          score: 98, stars: 5, date: 'Mar 10, 2024', text: 'A masterpiece of game design. Every encounter feels meaningful, and the open world is the most impressive I have ever seen in an action RPG. FromSoftware has outdone themselves in every possible way.', helpful: 142 },
  { slug: 'baldurs-gate-3',           name: "Baldur's Gate 3",     score: 95, stars: 5, date: 'Feb 20, 2024', text: 'Larian Studios delivered the RPG of the decade. The depth of choices, the writing, and the sheer amount of content is staggering. Co-op is an absolute blast.', helpful: 98 },
  { slug: 'cyberpunk-2077',           name: 'Cyberpunk 2077',      score: 78, stars: 3, date: 'Jan 5, 2024',  text: 'After years of patches it is a good game, but the launch was a disaster that is hard to forget. Night City is stunning but the story feels hollow in places. Still worth playing now.', helpful: 67 },
];

const activityFeed = [
  { slug: 'elden-ring',              name: 'Elden Ring',         detail: 'Reached Leyndell — 68h played',   time: '2h ago',   badge: 'Playing',  badgeClass: 'ab-playing' },
  { slug: 'baldurs-gate-3',          name: "Baldur's Gate 3",   detail: 'Unlocked achievement: Illithid',  time: '1d ago',   badge: 'Playing',  badgeClass: 'ab-playing' },
  { slug: 'red-dead-redemption-2',   name: 'Red Dead 2',        detail: 'Completed 100% — 90h total',      time: '3d ago',   badge: 'Finished', badgeClass: 'ab-finished' },
  { slug: 'hades',                   name: 'Hades',             detail: 'Heat 32 clear — 45h played',      time: '5d ago',   badge: 'Finished', badgeClass: 'ab-finished' },
  { slug: 'cyberpunk-2077',          name: 'Cyberpunk 2077',    detail: 'Added to library',                time: '1wk ago',  badge: 'Dropped',  badgeClass: 'ab-dropped' },
  { slug: 'ghost-of-tsushima',       name: 'Ghost of Tsushima', detail: 'Added to wishlist',               time: '2wk ago',  badge: 'Wishlist', badgeClass: 'ab-wishlist' },
];

const achievements = [
  { icon: '🏆', name: 'First Blood',     desc: 'Complete your first game',           date: 'Jan 2022', points: '+50 XP',  locked: false, bg: 'rgba(255,215,0,.12)' },
  { icon: '🔥', name: 'On a Roll',       desc: 'Play 7 days in a row',               date: 'Mar 2022', points: '+100 XP', locked: false, bg: 'rgba(255,100,50,.12)' },
  { icon: '📚', name: 'Bibliophile',     desc: 'Add 100+ games to your library',     date: 'Jun 2023', points: '+150 XP', locked: false, bg: 'rgba(100,180,255,.12)' },
  { icon: '✍️', name: 'Critic',          desc: 'Write 25 game reviews',              date: 'Sep 2023', points: '+200 XP', locked: false, bg: 'rgba(0,230,118,.12)' },
  { icon: '⚔️', name: 'Souls Master',   desc: 'Finish all FromSoftware titles',      date: 'Dec 2023', points: '+300 XP', locked: false, bg: 'rgba(200,100,255,.12)' },
  { icon: '🌍', name: 'World Explorer',  desc: 'Play games from 10 different genres', date: '—',        points: '+250 XP', locked: false, bg: 'rgba(0,200,200,.12)' },
  { icon: '💎', name: 'Perfectionist',   desc: 'Get 100% in 5 games',                date: '—',        points: '+500 XP', locked: true,  bg: 'rgba(255,255,255,.04)' },
  { icon: '🌟', name: 'Legend',          desc: 'Reach level 50',                     date: '—',        points: '+1000 XP',locked: true,  bg: 'rgba(255,255,255,.04)' },
  { icon: '🎯', name: 'Speed Demon',     desc: 'Complete a game in under 5 hours',   date: '—',        points: '+200 XP', locked: true,  bg: 'rgba(255,255,255,.04)' },
];

const genreBreakdown = [
  { name: 'RPG',       count: 48, pct: 35 },
  { name: 'Action',    count: 32, pct: 23 },
  { name: 'Adventure', count: 22, pct: 16 },
  { name: 'Indie',     count: 18, pct: 13 },
  { name: 'Strategy',  count: 10, pct: 7  },
  { name: 'Other',     count: 8,  pct: 6  },
];

// ── IMAGE CACHE ───────────────────────────
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

function loadThumb(slug, elId, cssClass) {
  fetchGameImg(slug).then(src => {
    const ph = document.getElementById(elId);
    if (!src || !ph) return;
    const img = document.createElement('img');
    img.className = cssClass;
    img.alt = slug;
    img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
    img.src = src;
  });
}

// ── NAV AVATAR ───────────────────────────
function initNavAvatar() {
  document.querySelectorAll('.nav-avatar-initial').forEach(el => {
    el.textContent = USER.initials;
  });
}

// ── PROFILE HEADER ────────────────────────
function renderProfileHeader() {
  document.getElementById('profile-name').textContent     = USER.name;
  document.getElementById('profile-username').textContent = USER.username;

  // Banner image
  fetchGameImg('red-dead-redemption-2').then(src => {
    const ph = document.getElementById('banner-ph');
    if (!src || !ph) return;
    const img = document.createElement('img');
    img.className = 'banner-img';
    img.alt = 'banner';
    img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
    img.src = src;
  });
}

// ── STATS BAR ─────────────────────────────
function renderStats() {
  document.getElementById('stat-library').textContent      = USER.stats.library;
  document.getElementById('stat-wishlist').textContent     = USER.stats.wishlist;
  document.getElementById('stat-reviews').textContent      = USER.stats.reviews;
  document.getElementById('stat-achievements').textContent = USER.stats.achievements;
  document.getElementById('stat-hours').textContent        = USER.stats.hoursPlayed;
  document.getElementById('stat-avg').textContent          = USER.stats.avgScore;
}

// ── SIDEBAR ACTIVITY MINI ─────────────────
function renderSidebarActivity() {
  const wrap = document.getElementById('sidebar-activity-list');
  activityFeed.slice(0, 4).forEach((a, i) => {
    const uid = `sa-${i}`;
    const item = document.createElement('div');
    item.className = 'activity-mini-item';
    item.innerHTML = `
      <div class="activity-mini-thumb-ph shimmer" id="${uid}" style="width:34px;height:34px;border-radius:6px;flex-shrink:0;"></div>
      <div style="min-width:0;">
        <div class="activity-mini-name">${a.name}</div>
        <div class="activity-mini-time">${a.time}</div>
      </div>`;
    wrap.appendChild(item);
    makeClickable(item, a.slug);
    loadThumb(a.slug, uid, 'activity-mini-thumb');
  });
}

// ── OVERVIEW TAB ──────────────────────────
function renderOverview() {
  // Genre breakdown
  const list = document.getElementById('genre-bar-list');
  list.innerHTML = '';
  genreBreakdown.forEach(g => {
    const item = document.createElement('div');
    item.className = 'genre-bar-item';
    item.innerHTML = `
      <div class="genre-bar-top">
        <span class="genre-bar-name">${g.name}</span>
        <span class="genre-bar-count">${g.count} games</span>
      </div>
      <div class="genre-bar-track">
        <div class="genre-bar-fill" data-pct="${g.pct}"></div>
      </div>`;
    list.appendChild(item);
  });
  setTimeout(() => {
    document.querySelectorAll('.genre-bar-fill').forEach(b => {
      b.style.width = b.dataset.pct + '%';
    });
  }, 200);

  // Activity feed
  const feed = document.getElementById('activity-list');
  feed.innerHTML = '';
  activityFeed.forEach((a, i) => {
    const uid = `act-${i}`;
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-thumb-ph shimmer" id="${uid}" style="width:48px;height:48px;border-radius:8px;flex-shrink:0;"></div>
      <div class="activity-info">
        <div class="activity-name">${a.name}</div>
        <div class="activity-detail">${a.detail}</div>
      </div>
      <span class="activity-badge ${a.badgeClass}">${a.badge}</span>
      <span class="activity-time">${a.time}</span>`;
    feed.appendChild(item);
    makeClickable(item, a.slug);
    loadThumb(a.slug, uid, 'activity-thumb');
  });
}

// ── LIBRARY TAB ───────────────────────────
function renderLibrary() {
  const grid = document.getElementById('library-grid');
  grid.innerHTML = '';
  const statusTagClass = { Playing: 'playing-tag', Finished: 'finished-tag', Dropped: 'dropped-tag' };

  libraryGames.forEach((g, i) => {
    const uid  = `lib-${i}`;
    const card = document.createElement('div');
    card.className = 'shelf-card fade-in';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="shelf-card-img-wrap">
        <div class="shelf-card-img-ph shimmer" id="${uid}" style="width:100%;height:100%;min-height:160px;"></div>
        <div class="shelf-score">${g.score}</div>
        <div class="shelf-status ${statusTagClass[g.status]}">${g.status}</div>
      </div>
      <div class="shelf-card-body">
        <div class="shelf-card-title">${g.name}</div>
        <div class="shelf-card-meta">${g.genre} · ${g.hours}</div>
        <div class="shelf-progress">
          <div class="shelf-progress-bar">
            <div class="shelf-progress-fill" style="width:${g.progress}%;"></div>
          </div>
          <div class="shelf-progress-label">
            <span>${g.status === 'Finished' ? 'Completed' : 'Progress'}</span>
            <span>${g.progress}%</span>
          </div>
        </div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);
    loadThumb(g.slug, uid, 'shelf-card-img');
  });
}

// ── WISHLIST TAB ──────────────────────────
function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  grid.innerHTML = '';
  wishlistGames.forEach((g, i) => {
    const uid  = `wish-${i}`;
    const card = document.createElement('div');
    card.className = 'shelf-card fade-in';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="shelf-card-img-wrap">
        <div class="shelf-card-img-ph shimmer" id="${uid}" style="width:100%;height:100%;min-height:160px;"></div>
        <div class="shelf-score">${g.score}</div>
        <div class="shelf-status wishlist-tag">Wishlist</div>
      </div>
      <div class="shelf-card-body">
        <div class="shelf-card-title">${g.name}</div>
        <div class="shelf-card-meta">${g.genre} · ${g.releaseDate}</div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, g.slug);
    loadThumb(g.slug, uid, 'shelf-card-img');
  });
}

// ── REVIEWS TAB ───────────────────────────
function renderReviews() {
  const list = document.getElementById('reviews-list');
  list.innerHTML = '';
  reviewedGames.forEach((r, i) => {
    const uid  = `rev-${i}`;
    const stars = Array.from({ length: 5 }, (_, s) =>
      `<span class="star${s < r.stars ? '' : ' empty'}">★</span>`).join('');

    const item = document.createElement('div');
    item.className = 'review-card fade-in';
    item.style.animationDelay = `${i * 80}ms`;
    item.innerHTML = `
      <div class="review-card-top">
        <div class="review-game-thumb-ph shimmer" id="${uid}" style="width:48px;height:48px;border-radius:8px;flex-shrink:0;"></div>
        <div>
          <div class="review-game-name">${r.name}</div>
          <div class="review-stars">${stars}</div>
        </div>
        <div class="review-score-box">${r.score}</div>
        <div class="review-date">${r.date}</div>
      </div>
      <div class="review-text">${r.text}</div>
      <div class="review-footer">
        <span class="review-helpful"><strong>${r.helpful}</strong> people found this helpful</span>
        <button class="review-helpful-btn">👍 Helpful</button>
        <button class="review-helpful-btn">Edit</button>
      </div>`;
    list.appendChild(item);
    loadThumb(r.slug, uid, 'review-game-thumb');
  });
}

// ── ACHIEVEMENTS TAB ──────────────────────
function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';
  achievements.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = `achievement-card fade-in ${a.locked ? 'locked' : ''}`;
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="achievement-icon" style="background:${a.bg};">${a.icon}</div>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-desc">${a.desc}</div>
      ${!a.locked ? `<div class="achievement-date">Unlocked ${a.date}</div>` : '<div class="achievement-date">Locked</div>'}
      <div class="achievement-points">${a.points}</div>`;
    grid.appendChild(card);
  });
}

// ── SETTINGS TAB ─────────────────────────
function renderSettings() {
  // Pre-fill name fields
  const parts = USER.name.split(' ');
  const fnEl = document.getElementById('settings-firstname');
  const lnEl = document.getElementById('settings-lastname');
  const unEl = document.getElementById('settings-username');
  if (fnEl) fnEl.value = parts[0] || '';
  if (lnEl) lnEl.value = parts[1] || '';
  if (unEl) unEl.value = USER.username.replace('@', '');
}

// ── TAB NAVIGATION ────────────────────────
function switchTab(tabId) {
  // Nav items
  document.querySelectorAll('.sidebar-nav-item[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabId);
  });
  // Panels
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });
  // Lazy render
  const rendered = {};
  if (!rendered[tabId]) {
    rendered[tabId] = true;
    if (tabId === 'overview')      renderOverview();
    if (tabId === 'library')       renderLibrary();
    if (tabId === 'wishlist')      renderWishlist();
    if (tabId === 'reviews')       renderReviews();
    if (tabId === 'achievements')  renderAchievements();
    if (tabId === 'settings')      renderSettings();
  }
}

// Track rendered tabs to avoid re-render
const _rendered = { overview: false, library: false, wishlist: false, reviews: false, achievements: false, settings: false };
function switchTabSmart(tabId) {
  document.querySelectorAll('.sidebar-nav-item[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });
  if (!_rendered[tabId]) {
    _rendered[tabId] = true;
    if (tabId === 'overview')     renderOverview();
    if (tabId === 'library')      renderLibrary();
    if (tabId === 'wishlist')     renderWishlist();
    if (tabId === 'reviews')      renderReviews();
    if (tabId === 'achievements') renderAchievements();
    if (tabId === 'settings')     renderSettings();
  }
  // Update URL hash
  history.replaceState(null, '', `#${tabId}`);
}

// ── SAVE SETTINGS ─────────────────────────
function saveSettings() {
  const btn = document.getElementById('save-settings-btn');
  btn.textContent = '✓ Saved!';
  btn.style.background = '#00bfa5';
  setTimeout(() => {
    btn.textContent = 'Save Changes';
    btn.style.background = '';
  }, 2000);
}

// ── MOBILE MENU ───────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavAvatar();
  renderProfileHeader();
  renderStats();
  renderSidebarActivity();

  // Determine initial tab from URL hash
  const hash = window.location.hash.replace('#', '') || 'overview';
  const validTabs = ['overview', 'library', 'wishlist', 'reviews', 'achievements', 'settings'];
  const initialTab = validTabs.includes(hash) ? hash : 'overview';
  switchTabSmart(initialTab);
});