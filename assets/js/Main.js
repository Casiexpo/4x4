import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { TRANSLATIONS, getLang, setLang, t } from "./i18n.js";

const SUPABASE_URL = "https://rvcplafkusuwbcvxdzgz.supabase.co";
const SUPABASE_KEY = "sb_publishable_U64qz-HfU2mYsv-VpKPmjg_Z9vqg64O";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EVENTS_PER_PAGE = 6;
let allEvents = [];
let filteredEvents = [];
let currentCount = 0;
let activeFilter = 'tot';

// ---- i18n helpers ----
function applyTranslations() {
  const lang = getLang();
  // Update html lang attribute
  document.documentElement.lang = TRANSLATIONS[lang]?.htmlLang || lang;

  // Simple text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });

  // innerHTML (for elements with <strong> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = t(key);
    if (val) el.innerHTML = val;
  });

  // Update active flag button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
}

function switchLang(lang) {
  setLang(lang);
  applyTranslations();
  // Re-render events grid (text labels inside cards may need refresh)
  const grid = document.getElementById('events-grid');
  if (grid && allEvents.length > 0) {
    grid.innerHTML = '';
    currentCount = 0;
    filteredEvents = activeFilter === 'tot'
      ? [...allEvents]
      : allEvents.filter(ev => (ev.tipo_evento || 'trial').toLowerCase() === activeFilter);
    renderNextBatch();
    updateLoadMoreBtn();
  }
  // Refresh filter button labels
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const key = btn.getAttribute('data-i18n');
    if (key) btn.textContent = t(key);
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

// ---- Events rendering ----
function createCard(ev) {
  const tipo = ev.tipo_evento || 'trial';
  const card = document.createElement('article');
  card.className = 'event-card';
  const dateStr = ev.date_end && ev.date_end !== ev.date_start
    ? `${ev.date_start} → ${ev.date_end}`
    : (ev.date_start || '');
  const priceLabel = ev.price_public || t('free');
  const participLabel = ev.price_participants
    ? `<li><span>🏁</span> ${t('labelParticip')}: ${ev.price_participants}</li>`
    : '';

  card.innerHTML = `
    <a href="evento.html?id=${ev.id}" class="card-link">
      <div class="card-img-wrap">
        <img src="${ev.image_url}" class="card-img" alt="${ev.title}" loading="lazy">
        <span class="card-badge ${tipo.toLowerCase()}">${tipo.toUpperCase()}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ev.title}</h3>
        <ul class="card-meta">
          <li><span>📅</span> ${dateStr}</li>
          <li><span>📍</span> ${ev.location}</li>
          <li><span>💶</span> ${t('labelPublic')}: ${priceLabel}</li>
          ${participLabel}
        </ul>
      </div>
    </a>
  `;
  return card;
}

function updateLoadMoreBtn() {
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;
  btn.textContent = t('loadMore');
  btn.style.display = currentCount >= filteredEvents.length ? 'none' : 'inline-block';
}

function renderNextBatch() {
  const grid = document.getElementById('events-grid');
  const nextBatch = filteredEvents.slice(currentCount, currentCount + EVENTS_PER_PAGE);
  nextBatch.forEach(ev => grid.appendChild(createCard(ev)));
  currentCount += nextBatch.length;
  updateLoadMoreBtn();
}

function applyFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  filteredEvents = filter === 'tot'
    ? [...allEvents]
    : allEvents.filter(ev => (ev.tipo_evento || 'trial').toLowerCase() === filter);
  const grid = document.getElementById('events-grid');
  grid.innerHTML = '';
  currentCount = 0;
  if (filteredEvents.length === 0) {
    grid.innerHTML = `<p style="color:#aaa; text-align:center; grid-column:1/-1; padding: 40px 0;">${t('noEventsFilter')}</p>`;
    updateLoadMoreBtn();
    return;
  }
  renderNextBatch();
}

async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_start', { ascending: true });
    if (error) throw error;
    grid.innerHTML = '';
    allEvents = data || [];
    filteredEvents = [...allEvents];
    currentCount = 0;
    if (allEvents.length === 0) {
      grid.innerHTML = `<p style="color: white; text-align: center; grid-column: 1/-1;">${t('noEvents')}</p>`;
      return;
    }
    renderNextBatch();
    const section = document.getElementById('events');
    if (section && !document.getElementById('load-more-btn')) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align: center; margin-top: 40px; padding-bottom: 20px;';
      const btn = document.createElement('button');
      btn.id = 'load-more-btn';
      btn.className = 'btn btn-primary';
      btn.textContent = t('loadMore');
      btn.addEventListener('click', renderNextBatch);
      wrapper.appendChild(btn);
      section.querySelector('.container').appendChild(wrapper);
      updateLoadMoreBtn();
    }
  } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language on load
  applyTranslations();

  loadEvents();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });
});

// Scroll header effect
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();