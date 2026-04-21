import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { TRANSLATIONS, getLang, setLang, t } from "./i18n.js";

const SUPABASE_URL = "https://rvcplafkusuwbcvxdzgz.supabase.co";
const SUPABASE_KEY = "sb_publishable_U64qz-HfU2mYsv-VpKPmjg_Z9vqg64O";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- i18n helpers ----
function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = TRANSLATIONS[lang]?.htmlLang || lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
}

function formatDateRange(start, end) {
  if (!start) return '—';
  if (!end || end === start) return start;
  return `${start} → ${end}`;
}

let currentEventData = null;

function renderEvent(ev) {
  const container = document.getElementById('event-detail-content');
  if (!ev) {
    container.innerHTML = `<p style='color:white; text-align:center;'>${t('eventNotFound')}</p>`;
    return;
  }
  const tipoEvento = ev.tipo_evento || 'trial';
  const dateStr    = formatDateRange(ev.date_start, ev.date_end);
  const priceStr   = ev.price_public || t('free');

  const extraBadges = `
    ${ev.food_trucks  ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#92400e; color:#fef3c7; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🍔 Food Trucks</span>' : ''}
    ${ev.zona_crawler ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#1e3a5f; color:#bfdbfe; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🚗 Zona Crawler / RC</span>' : ''}
  `;
  const hasExtras = ev.food_trucks || ev.zona_crawler;

  container.innerHTML = `
    <div class="premium-wrapper">
      <div class="premium-image">
        <span class="card-badge ${tipoEvento.toLowerCase()}" style="position:absolute; top:20px; left:20px; z-index:10;">
          ${tipoEvento.toUpperCase()}
        </span>
        <img src="${ev.image_url}" alt="Cartell ${ev.title}">
      </div>
      <div class="premium-info">
        <h1 class="premium-title orange-text">${ev.title}</h1>
        ${hasExtras ? `<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">${extraBadges}</div>` : ''}
        <div class="info-boxes">
          <div class="info-box">
            <span class="icon">📅</span>
            <div><span class="label">${t('labelDate')}</span><span class="value">${dateStr}</span></div>
          </div>
          <div class="info-box">
            <span class="icon">📍</span>
            <div><span class="label">${t('labelLocation')}</span><span class="value">${ev.location}</span></div>
          </div>
          <div class="info-box">
            <span class="icon">💶</span>
            <div><span class="label">${t('labelPublic')}</span><span class="value">${priceStr}</span></div>
          </div>
          ${ev.price_participants ? `
          <div class="info-box">
            <span class="icon">🏁</span>
            <div><span class="label">${t('labelParticip')}</span><span class="value">${ev.price_participants}</span></div>
          </div>` : ''}
        </div>
        <div class="detail-actions">
          <a href="${ev.link}" target="_blank" class="btn btn-primary btn-premium">
            ${t('btnInfo')}
          </a>
        </div>
      </div>
    </div>
  `;
  document.title = `${ev.title} - 4x4 Catalunya`;
}

async function loadEventDetail() {
  const params    = new URLSearchParams(window.location.search);
  const eventId   = params.get('id');
  const container = document.getElementById('event-detail-content');
  if (!eventId) return;

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    if (error) throw error;
    currentEventData = data;
    renderEvent(currentEventData);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style='color:red; text-align:center;'>${t('errorLoad')}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  loadEventDetail();

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
      applyTranslations();
      // Re-render event with new language labels
      if (currentEventData) renderEvent(currentEventData);
      // Update back button
      const backBtn = document.querySelector('[data-i18n="backBtn"]');
      if (backBtn) backBtn.textContent = t('backBtn');
    });
  });
});
