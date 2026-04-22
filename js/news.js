/* ══════════════════════════════════
   news.js — GameRec News Page
   ══════════════════════════════════ */

// ── CONFIG ───────────────────────────
const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Ganti dengan API key RAWG kamu
const BASE_URL = 'https://api.rawg.io/api';

function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── DATA ─────────────────────────────

const featuredArticle = {
  slug:     'cyberpunk-2077',
  category: 'Industry News',
  catClass: 'cat-industry',
  title:    'The Future of Procedural Generation in RPGs',
  excerpt:  'How major studios are leveraging generative AI to create infinite, reactive worlds without sacrificing the artisan touch of handcrafted design. A look at the studios leading this revolution.',
  author:   'Marcus Thorne',
  initials: 'MT',
  date:     'May 24, 2024',
  readTime: '8 min read',
};

// All articles pool — category determines which tab shows them
const allArticles = [
  {
    id: 1, slug: 'doom-eternal',
    category: 'Hardware', catClass: 'cat-hardware',
    title: 'The 8K Barrier: Is Your Rig Truly Ready?',
    excerpt: 'Testing the latest GPUs against the most demanding titles of the year to see where the real bottlenecks lie.',
    date: 'Jun 2, 2024', readTime: '6 min read',
  },
  {
    id: 2, slug: 'hollow-knight',
    category: 'Reviews', catClass: 'cat-reviews',
    title: 'Chrono-Echo: A Masterclass in Narrative Design',
    excerpt: 'Why this indie sleeper hit is being called the most innovative storytelling experience of the decade.',
    date: 'Jun 1, 2024', readTime: '9 min read',
  },
  {
    id: 3, slug: 'the-last-of-us',
    category: 'ESports', catClass: 'cat-esports',
    title: 'Global Finals Viewership Hits New Record',
    excerpt: 'The numbers are in, and competitive gaming has officially surpassed traditional sports in key demographics.',
    date: 'May 30, 2024', readTime: '4 min read',
  },
  {
    id: 4, slug: 'sekiro-shadows-die-twice',
    category: 'Culture', catClass: 'cat-culture',
    title: 'The Rise of the Meta-Streamer',
    excerpt: 'Virtual avatars are no longer a niche — they are becoming the primary face of digital content creation.',
    date: 'May 28, 2024', readTime: '7 min read',
  },
  {
    id: 5, slug: 'baldurs-gate-3',
    category: 'Reviews', catClass: 'cat-reviews',
    title: "Why Baldur's Gate 3 Changed RPG Design Forever",
    excerpt: 'A deep dive into the design decisions that made this the highest-rated game of the decade.',
    date: 'May 27, 2024', readTime: '11 min read',
  },
  {
    id: 6, slug: 'red-dead-redemption-2',
    category: 'Culture', catClass: 'cat-culture',
    title: 'Open Worlds and the Loneliness Paradox',
    excerpt: 'Why the biggest game maps often create the most profound sense of isolation, and why players love it.',
    date: 'May 26, 2024', readTime: '8 min read',
  },
  {
    id: 7, slug: 'alan-wake-2',
    category: 'Industry', catClass: 'cat-industry',
    title: 'Mid-Tier Studios Are Making a Comeback',
    excerpt: 'The AA game renaissance is here. We look at why smaller budget, high-craft games are winning audiences.',
    date: 'May 25, 2024', readTime: '5 min read',
  },
  {
    id: 8, slug: 'hades',
    category: 'Reviews', catClass: 'cat-reviews',
    title: 'Hades II Early Access: Worth It Already',
    excerpt: 'Supergiant Games raises the bar once again with a sequel that expands in every meaningful direction.',
    date: 'May 22, 2024', readTime: '7 min read',
  },
  {
    id: 9, slug: 'celeste',
    category: 'Guides', catClass: 'cat-guides',
    title: 'Mastering Movement: A Speedrunner\'s Guide',
    excerpt: 'The mechanics behind sub-hour completions and what they reveal about exceptional game design.',
    date: 'May 20, 2024', readTime: '10 min read',
  },
  {
    id: 10, slug: 'ghost-of-tsushima',
    category: 'Hardware', catClass: 'cat-hardware',
    title: 'Best Gaming Monitors of 2024 Ranked',
    excerpt: 'From budget 1440p panels to ultra-wide OLED monsters — we ranked every major display that matters.',
    date: 'May 18, 2024', readTime: '12 min read',
  },
  {
    id: 11, slug: 'star-wars-jedi-survivor',
    category: 'ESports', catClass: 'cat-esports',
    title: 'The Economics of Pro Gaming in 2024',
    excerpt: "Salary structures, sponsorship shifts, and why the esports bubble didn't pop — it just transformed.",
    date: 'May 17, 2024', readTime: '6 min read',
  },
  {
    id: 12, slug: 'god-of-war',
    category: 'Culture', catClass: 'cat-culture',
    title: 'Games as Grief: How Players Process Loss Through Play',
    excerpt: 'Researchers and game designers discuss the therapeutic role of narrative games in bereavement.',
    date: 'May 15, 2024', readTime: '9 min read',
  },
];

const trendingArticles = [
  { num: '01', title: 'Remastering the Classics: Why Now?',   category: 'INDUSTRY', reads: '124K reads', top: true  },
  { num: '02', title: 'The Best VR Headsets for 2024',        category: 'HARDWARE', reads: '98K reads',  top: false },
  { num: '03', title: "Inside the 'Soulslike' Revolution",    category: 'CULTURE',  reads: '81K reads',  top: false },
  { num: '04', title: 'Top 10 Hidden Steam Gems',             category: 'REVIEWS',  reads: '73K reads',  top: false },
  { num: '05', title: "Mobile Gaming's Cloud Pivot",          category: 'INDUSTRY', reads: '52K reads',  top: false },
];

// ── IMAGE CACHE ───────────────────────
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

// Helper: load img into placeholder
function injectImg(slug, phId, cssClass, extraOnload) {
  fetchGameImg(slug).then(src => {
    const ph = document.getElementById(phId);
    if (!src || !ph) return;
    const img = document.createElement('img');
    if (cssClass) img.className = cssClass;
    img.alt = slug;
    img.onload = () => {
      img.classList.add('loaded');
      ph.replaceWith(img);
      if (extraOnload) extraOnload(img);
    };
    img.src = src;
  });
}

// ── FEATURED HERO ─────────────────────
function renderFeatured() {
  const f = featuredArticle;
  // Set static content (already in HTML), just load image
  injectImg(f.slug, 'hero-img-ph', 'hero-img-wrap-img');
}

// ── FILTER STATE ──────────────────────
let activeFilter = 'All Stories';
let loadedCount = 4; // initial visible count

const filterMap = {
  'All Stories': null,
  'Reviews':     'Reviews',
  'Hardware':    'Hardware',
  'Culture':     'Culture',
  'ESports':     'ESports',
};

function getFilteredArticles() {
  const cat = filterMap[activeFilter];
  return cat ? allArticles.filter(a => a.category === cat) : allArticles;
}

// ── ARTICLES ──────────────────────────
function renderArticles(reset = false) {
  const grid = document.getElementById('articles-grid');
  if (reset) { grid.innerHTML = ''; loadedCount = 4; }

  const filtered = getFilteredArticles();
  const toRender = filtered.slice(0, loadedCount);

  grid.innerHTML = '';
  toRender.forEach(a => {
    const uid = `art-${a.id}`;
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-img-wrap">
        <div class="article-img-ph shimmer" id="${uid}" style="width:100%;height:100%;min-height:160px;"></div>
        <span class="article-cat-badge ${a.catClass}">${a.category.toUpperCase()}</span>
      </div>
      <div class="article-body">
        <div class="article-title">${a.title}</div>
        <div class="article-excerpt">${a.excerpt}</div>
        <div class="article-foot">
          <span class="article-date">${a.date}</span>
          <span class="article-read">${a.readTime}</span>
        </div>
      </div>`;
    grid.appendChild(card);
    makeClickable(card, a.slug);
    injectImg(a.slug, uid, 'article-img');
  });

  // Toggle load-more button
  const btn = document.getElementById('load-more-btn');
  if (btn) btn.style.display = loadedCount >= filtered.length ? 'none' : 'inline-flex';
}

// ── LOAD MORE ─────────────────────────
function loadMore() {
  const btn = document.getElementById('load-more-btn');
  if (btn) { btn.classList.add('loading'); btn.textContent = 'Loading...'; }

  setTimeout(() => {
    loadedCount += 4;
    renderArticles(false);
    if (btn) { btn.classList.remove('loading'); btn.innerHTML = 'Load More Stories <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14m-7-7 7 7 7-7"/></svg>'; }
  }, 700);
}

// ── FILTER TABS ───────────────────────
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderArticles(true);
    });
  });
}

// ── TRENDING ──────────────────────────
function renderTrending() {
  const list = document.getElementById('trending-list');
  list.innerHTML = '';
  trendingArticles.forEach(t => {
    const row = document.createElement('div');
    row.className = 'trending-row';
    row.innerHTML = `
      <div class="trending-num ${t.top ? 'top' : ''}">${t.num}</div>
      <div class="trending-info">
        <div class="trending-title">${t.title}</div>
        <div class="trending-meta">${t.category} &bull; ${t.reads}</div>
      </div>`;
    list.appendChild(row);
  });
}

// ── FEATURED IMAGE ────────────────────
function initFeaturedImg() {
  injectImg(
    featuredArticle.slug,
    'hero-img-ph',
    'hero-article-img'
  );
}

// ── BRIEFING FORM ─────────────────────
function initBriefing() {
  const form = document.getElementById('briefing-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');
    if (!input.value.trim()) return;
    btn.textContent = '✓ Joined!';
    btn.style.background = '#00bfa5';
    input.value = '';
    input.disabled = true;
    btn.disabled = true;
  });
}

// ── MOBILE MENU ───────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── INIT ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedImg();
  initFilters();
  renderArticles();
  renderTrending();
  initBriefing();
});