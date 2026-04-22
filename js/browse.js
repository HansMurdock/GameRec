/* ══════════════════════════════════
   browse.js — GameRec Browse Page
   ══════════════════════════════════ */

// ── CONFIG ───────────────────────────
const RAWG_KEY  = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Ganti dengan API key RAWG kamu
const BASE_URL  = 'https://api.rawg.io/api';
const PAGE_SIZE = 8; // cards per page

function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── STATE ────────────────────────────
const state = {
  platforms:    ['Console Essentials'],  // active platform filters
  genres:       ['Action'],              // active genre filters
  minScore:     75,
  sort:         'relevance',
  currentPage:  1,
  totalPages:   12,
};

// ── GAME DATA POOL ───────────────────
// Each entry has a RAWG slug for image fetching + display info
const gamePool = [
  // Page 1 — Action
  { id:1,  slug:'cyberpunk-2077',              title:'Neon Horizon: Zero',       tags:['action','pc'],         score:89, date:'Released Oct 2024' },
  { id:2,  slug:'elden-ring',                  title:'Elders of Mythos',         tags:['rpg','ps5'],           score:94, date:'Released Sep 2024' },
  { id:3,  slug:'star-wars-jedi-survivor',     title:'Void Voyager',             tags:['simulation','pc'],     score:82, date:'Released Aug 2024' },
  { id:4,  slug:'dark-souls-iii',              title:'Soul Reaver: Arisen',      tags:['horror','multi'],      score:97, date:'Released Oct 2024' },
  { id:5,  slug:'god-of-war',                  title:'Titan Steel',              tags:['action','console'],    score:76, date:'Released Jul 2024' },
  { id:6,  slug:'hollow-knight',               title:'Pixel Quest: Origin',      tags:['indie','switch'],      score:88, date:'Released Jun 2024' },
  { id:7,  slug:'sekiro-shadows-die-twice',    title:'Shadow of the Grove',      tags:['adventure','multi'],   score:91, date:'Released Sep 2024' },
  { id:8,  slug:'hades',                       title:'Command Center X',         tags:['strategy','mobile'],   score:85, date:'Released Oct 2024' },
  // Page 2 — RPG
  { id:9,  slug:'baldurs-gate-3',              title:'Chronicle of Ages',        tags:['rpg','pc'],            score:96, date:'Released Nov 2024' },
  { id:10, slug:'the-witcher-3-wild-hunt',     title:'Verdant Realm',            tags:['rpg','multi'],         score:93, date:'Released Sep 2024' },
  { id:11, slug:'disco-elysium',               title:'Mind Palace',              tags:['rpg','pc'],            score:97, date:'Released Aug 2024' },
  { id:12, slug:'final-fantasy-xvi',           title:'Crystal Nexus',            tags:['action','rpg'],        score:87, date:'Released Jul 2024' },
  { id:13, slug:'persona-5',                   title:'Phantom Hearts',           tags:['rpg','console'],       score:93, date:'Released Jun 2024' },
  { id:14, slug:'dragon-age-inquisition',      title:'Iron Throne',              tags:['rpg','multi'],         score:85, date:'Released May 2024' },
  { id:15, slug:'monster-hunter-world',        title:'Beast Protocol',           tags:['action','rpg'],        score:90, date:'Released Apr 2024' },
  { id:16, slug:'divinity-original-sin-2-definitive-edition', title:'Aether Lords', tags:['rpg','strategy'], score:93, date:'Released Mar 2024' },
  // Page 3 — Strategy
  { id:17, slug:'crusader-kings-iii',          title:'Empire\'s Edge',           tags:['strategy','pc'],       score:91, date:'Released Feb 2024' },
  { id:18, slug:'total-war-warhammer-iii',     title:'War Eternal',              tags:['strategy','pc'],       score:84, date:'Released Jan 2024' },
  { id:19, slug:'age-of-empires-iv',           title:'Civilized',                tags:['strategy','pc'],       score:80, date:'Released Dec 2023' },
  { id:20, slug:'xcom-2',                      title:'Resistance Protocol',      tags:['strategy','multi'],    score:88, date:'Released Nov 2023' },
  { id:21, slug:'civilization-vi',             title:'Epoch Builder',            tags:['strategy','mobile'],   score:87, date:'Released Oct 2023' },
  { id:22, slug:'into-the-breach',             title:'Iron Grid',                tags:['strategy','indie'],    score:90, date:'Released Sep 2023' },
  { id:23, slug:'frostpunk',                   title:'Cold Command',             tags:['strategy','pc'],       score:84, date:'Released Aug 2023' },
  { id:24, slug:'stellaris',                   title:'Galaxy Sovereign',         tags:['strategy','pc'],       score:79, date:'Released Jul 2023' },
  // Page 4 — Adventure
  { id:25, slug:'ghost-of-tsushima',           title:'Blade of Dawn',            tags:['adventure','console'], score:92, date:'Released Jun 2023' },
  { id:26, slug:'red-dead-redemption-2',       title:'Frontier\'s End',          tags:['adventure','multi'],   score:97, date:'Released May 2023' },
  { id:27, slug:'the-last-of-us',             title:'Last Ember',               tags:['adventure','ps5'],     score:95, date:'Released Apr 2023' },
  { id:28, slug:'control-ultimate-edition',   title:'Bureau X',                 tags:['action','adventure'],  score:82, date:'Released Mar 2023' },
  { id:29, slug:'death-stranding',            title:'Silent Carrier',           tags:['adventure','multi'],   score:82, date:'Released Feb 2023' },
  { id:30, slug:'horizon-zero-dawn',          title:'Machine Wilds',            tags:['action','adventure'],  score:89, date:'Released Jan 2023' },
  { id:31, slug:'spider-man-miles-morales',   title:'Urban Legend',             tags:['action','ps5'],        score:87, date:'Released Dec 2022' },
  { id:32, slug:'alan-wake-2',                title:'Darkwave Descent',         tags:['horror','adventure'],  score:89, date:'Released Nov 2022' },
  // Pages 5–12 — Indie / Horror / Simulation
  { id:33, slug:'celeste',                    title:'Sky Wanderer',             tags:['indie','multi'],       score:94, date:'Released Oct 2022' },
  { id:34, slug:'hollow-knight',              title:'Silk Below',               tags:['indie','switch'],      score:90, date:'Released Sep 2022' },
  { id:35, slug:'hades',                      title:'Stygian',                  tags:['indie','action'],      score:93, date:'Released Aug 2022' },
  { id:36, slug:'dead-cells',                 title:'Cell Break',               tags:['indie','action'],      score:88, date:'Released Jul 2022' },
  { id:37, slug:'disco-elysium',              title:'The Precinct',             tags:['indie','rpg'],         score:96, date:'Released Jun 2022' },
  { id:38, slug:'stardew-valley',             title:'Harvest Glen',             tags:['indie','simulation'],  score:87, date:'Released May 2022' },
  { id:39, slug:'ori-and-the-blind-forest',   title:'Luminous Trail',           tags:['indie','adventure'],   score:88, date:'Released Apr 2022' },
  { id:40, slug:'undertale',                  title:'Delta Circuit',            tags:['indie','rpg'],         score:92, date:'Released Mar 2022' },
  { id:41, slug:'resident-evil-4-remake',     title:'Crimson Ward',             tags:['horror','action'],     score:93, date:'Released Feb 2022' },
  { id:42, slug:'alien-isolation',            title:'Zero Sector',              tags:['horror','simulation'], score:79, date:'Released Jan 2022' },
  { id:43, slug:'control-ultimate-edition',   title:'The Bureau',               tags:['horror','action'],     score:82, date:'Released Dec 2021' },
  { id:44, slug:'doom-eternal',               title:'Demonfall',                tags:['action','horror'],     score:87, date:'Released Nov 2021' },
  { id:45, slug:'cities-skylines',            title:'Metro Mind',               tags:['simulation','pc'],     score:85, date:'Released Oct 2021' },
  { id:46, slug:'euro-truck-simulator-2',     title:'Open Road Pro',            tags:['simulation','pc'],     score:77, date:'Released Sep 2021' },
  { id:47, slug:'microsoft-flight-simulator', title:'Cloudline',                tags:['simulation','multi'],  score:90, date:'Released Aug 2021' },
  { id:48, slug:'planet-coaster',             title:'Thrill Park',              tags:['simulation','pc'],     score:80, date:'Released Jul 2021' },
  // Filler to reach page 12
  ...Array.from({length: 48}, (_,i) => ({
    id: 49+i,
    slug: ['elden-ring','baldurs-gate-3','hades','celeste','doom-eternal','hollow-knight','sekiro-shadows-die-twice','red-dead-redemption-2'][i%8],
    title: `Game Title ${49+i}`,
    tags: [['action','rpg','indie','strategy','adventure','horror','simulation','pc'][i%8]],
    score: 70 + Math.floor(Math.random()*30),
    date: `Released 2024`,
  })),
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
  } catch { imgCache[slug] = null; return null; }
}

// ── SCORE COLOR ──────────────────────
function scoreClass(s) {
  if (s >= 95) return 'gold';
  if (s >= 85) return 'great';
  if (s >= 75) return 'good';
  return 'meh';
}

// ── TAG CLASS MAP ─────────────────────
const tagClassMap = {
  action:'tag-action', rpg:'tag-rpg', simulation:'tag-simulation',
  horror:'tag-horror', indie:'tag-indie', adventure:'tag-adventure',
  strategy:'tag-strategy', pc:'tag-pc', ps5:'tag-ps5',
  console:'tag-console', switch:'tag-switch', mobile:'tag-mobile', multi:'tag-multi',
};

// ── RENDER GRID ───────────────────────
function getPage() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return gamePool.slice(start, start + PAGE_SIZE);
}

function renderGrid() {
  const grid = document.getElementById('games-grid');
  grid.innerHTML = '';

  // Skeletons
  for (let i = 0; i < PAGE_SIZE; i++) {
    const sk = document.createElement('div');
    sk.className = 'game-card';
    sk.innerHTML = `<div class="game-card-img-wrap"><div class="shimmer game-card-img-ph" style="width:100%;height:100%;min-height:180px;"></div></div>
      <div class="game-card-body"><div class="shimmer" style="height:12px;border-radius:4px;margin-bottom:8px;"></div><div class="shimmer" style="height:16px;border-radius:4px;width:70%;"></div></div>`;
    grid.appendChild(sk);
  }

  const games = getPage();

  setTimeout(() => {
    grid.innerHTML = '';
    games.forEach(g => {
      const tagsHtml = g.tags.map(t => `<span class="game-tag ${tagClassMap[t] || 'tag-pc'}">${t.toUpperCase()}</span>`).join('');
      const uid = `gc-${g.id}`;

      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <div class="game-card-img-wrap">
          <div class="shimmer game-card-img-ph" id="${uid}" style="width:100%;height:100%;min-height:180px;"></div>
          <div class="game-score ${scoreClass(g.score)}">${g.score}</div>
        </div>
        <div class="game-card-body">
          <div class="game-card-tags">${tagsHtml}</div>
          <div class="game-card-title">${g.title}</div>
          <div class="game-card-date">${g.date}</div>
        </div>`;
      grid.appendChild(card);
      makeClickable(card, g.slug);

      fetchGameImg(g.slug).then(src => {
        const ph = document.getElementById(uid);
        if (!src || !ph) return;
        const img = document.createElement('img');
        img.className = 'game-card-img';
        img.alt = g.title;
        img.onload = () => { img.classList.add('loaded'); ph.replaceWith(img); };
        img.src = src;
      });
    });
  }, 300);
}

// ── RESULTS BAR ──────────────────────
function updateResultsBar() {
  const count = document.getElementById('results-count');
  const activeGenres = state.genres.join(', ') || 'All';
  const total = gamePool.length;
  count.innerHTML = `Showing <strong>${total.toLocaleString()}</strong> results for <span class="highlight">"${activeGenres} Games"</span>`;
}

// ── PAGINATION ───────────────────────
function renderPagination() {
  const wrap = document.getElementById('pagination');
  wrap.innerHTML = '';
  const cur  = state.currentPage;
  const last = state.totalPages;

  // Prev arrow
  const prev = document.createElement('div');
  prev.className = `page-btn arrow ${cur === 1 ? 'disabled' : ''}`;
  prev.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>`;
  prev.onclick = () => { if (cur > 1) goPage(cur - 1); };
  wrap.appendChild(prev);

  // Page numbers with ellipsis
  const pages = [];
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);
    if (cur > 3) pages.push('...');
    for (let i = Math.max(2, cur-1); i <= Math.min(last-1, cur+1); i++) pages.push(i);
    if (cur < last - 2) pages.push('...');
    pages.push(last);
  }

  pages.forEach(p => {
    if (p === '...') {
      const dots = document.createElement('span');
      dots.className = 'page-dots'; dots.textContent = '…';
      wrap.appendChild(dots);
    } else {
      const btn = document.createElement('div');
      btn.className = `page-btn ${p === cur ? 'active' : ''}`;
      btn.textContent = p;
      btn.onclick = () => goPage(p);
      wrap.appendChild(btn);
    }
  });

  // Next arrow
  const next = document.createElement('div');
  next.className = `page-btn arrow ${cur === last ? 'disabled' : ''}`;
  next.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>`;
  next.onclick = () => { if (cur < last) goPage(cur + 1); };
  wrap.appendChild(next);
}

function goPage(n) {
  state.currentPage = n;
  renderGrid();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PLATFORM FILTER ───────────────────
function initPlatformFilters() {
  document.querySelectorAll('.platform-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      state.platforms = Array.from(document.querySelectorAll('.platform-cb:checked'))
        .map(el => el.value);
      state.currentPage = 1;
      updateResultsBar();
      renderGrid();
      renderPagination();
    });
  });
}

// ── GENRE FILTER ──────────────────────
function initGenreFilter() {
  document.querySelectorAll('.genre-pill-filter').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      state.genres = Array.from(document.querySelectorAll('.genre-pill-filter.active'))
        .map(el => el.dataset.genre);
      state.currentPage = 1;
      updateResultsBar();
      renderGrid();
      renderPagination();
    });
  });
}

// ── METASCORE SLIDER ─────────────────
function initSlider() {
  const slider = document.getElementById('metascore-slider');
  const label  = document.getElementById('score-min-label');
  slider.addEventListener('input', () => {
    state.minScore = parseInt(slider.value);
    label.textContent = `Min: ${state.minScore}`;
    state.currentPage = 1;
    renderGrid();
    renderPagination();
  });
}

// ── SORT ─────────────────────────────
function initSort() {
  document.getElementById('sort-select').addEventListener('change', function() {
    state.sort = this.value;
    state.currentPage = 1;
    renderGrid();
    renderPagination();
  });
}

// ── MOBILE MENU ───────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── INIT ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateResultsBar();
  renderGrid();
  renderPagination();
  initPlatformFilters();
  initGenreFilter();
  initSlider();
  initSort();
});