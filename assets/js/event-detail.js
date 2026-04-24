import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { TRANSLATIONS, getLang, setLang, t } from "./i18n.js";

const SUPABASE_URL = "https://rvcplafkusuwbcvxdzgz.supabase.co";
const SUPABASE_KEY = "sb_publishable_U64qz-HfU2mYsv-VpKPmjg_Z9vqg64O";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = "https://trials4x4.cat";
const DEFAULT_IMAGE = `${BASE_URL}/assets/img/hero-4x4.png`;

let currentEventData = null;

function ensureMeta(selector, attributes = {}) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}

function ensureLink(rel) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  return element;
}

function absoluteUrl(value = "") {
  if (!value) return BASE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${BASE_URL}${normalized}`;
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data, null, 2);
}

function setSeoMeta({
  title,
  description,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  document.title = title;

  ensureMeta('meta[name="description"]', { name: "description", content: description });
  ensureMeta('meta[name="robots"]', {
    name: "robots",
    content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  });
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
  ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
  ensureMeta('meta[property="og:type"]', { property: "og:type", content: type });
  ensureMeta('meta[property="og:url"]', { property: "og:url", content: url });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: image });
  ensureMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "4x4 Catalunya" });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

  const canonical = ensureLink("canonical");
  canonical.href = url;
}

function setEventStructuredData(event) {
  if (!event) return;

  const eventUrl = `${BASE_URL}/evento.html?id=${encodeURIComponent(event.id)}`;
  const eventImage = absoluteUrl(event.image_url || DEFAULT_IMAGE);

  setSeoMeta({
    title: `${event.title} | Trial 4x4 a Catalunya`,
    description: `${event.title} a ${event.location}. Consulta dates, preus i tota la informació d'aquest esdeveniment 4x4 a Catalunya.`,
    url: eventUrl,
    image: eventImage,
    type: "article",
  });

  setJsonLd("breadcrumb-schema", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inici",
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Esdeveniments",
        item: `${BASE_URL}/#events`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: event.title,
        item: eventUrl,
      },
    ],
  });

  setJsonLd("event-schema", {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date_start,
    endDate: event.date_end || event.date_start,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [eventImage],
    url: eventUrl,
    description: `${event.title} a ${event.location}. Informació centralitzada a 4x4 Catalunya.`,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
        addressRegion: "Catalunya",
        addressCountry: "ES",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "4x4 Catalunya",
      url: BASE_URL,
    },
    offers: event.price_public
      ? {
          "@type": "Offer",
          url: event.link || eventUrl,
          priceCurrency: "EUR",
          price: event.price_public.replace(/[^\d,.-]/g, "").replace(",", ".") || "0",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  });

  // Update breadcrumb text
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = event.title;
  }
}

setSeoMeta({
  title: "Detalls de l'esdeveniment | 4x4 Catalunya",
  description:
    "Consulta la informació completa del trial 4x4 a Catalunya: data, ubicació, preus i enllaç oficial.",
  url: `${BASE_URL}/evento.html`,
  type: "article",
});

function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = TRANSLATIONS[lang]?.htmlLang || lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
}

function formatDateRange(start, end) {
  if (!start) return "—";
  if (!end || end === start) return start;
  return `${start} → ${end}`;
}

function renderEvent(ev) {
  const container = document.getElementById("event-detail-content");
  if (!ev) {
    container.innerHTML = `<p style='color:white; text-align:center;'>${t("eventNotFound")}</p>`;
    return;
  }

  const tipoEvento = ev.tipo_evento || "trial";
  const dateStr = formatDateRange(ev.date_start, ev.date_end);
  const priceStr = ev.price_public || t("free");

  const extraBadges = `
    ${ev.food_trucks ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#92400e; color:#fef3c7; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🍔 Food Trucks</span>' : ""}
    ${ev.zona_crawler ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#1e3a5f; color:#bfdbfe; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🚙 Zona Crawler / RC</span>' : ""}
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
        ${hasExtras ? `<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">${extraBadges}</div>` : ""}
        <div class="info-boxes">
          <div class="info-box">
            <span class="icon">📅</span>
            <div><span class="label">${t("labelDate")}</span><span class="value">${dateStr}</span></div>
          </div>
          <div class="info-box">
            <span class="icon">📍</span>
            <div><span class="label">${t("labelLocation")}</span><span class="value">${ev.location}</span></div>
          </div>
          <div class="info-box">
            <span class="icon">💶</span>
            <div><span class="label">${t("labelPublic")}</span><span class="value">${priceStr}</span></div>
          </div>
          ${ev.price_participants ? `
          <div class="info-box">
            <span class="icon">🏁</span>
            <div><span class="label">${t("labelParticip")}</span><span class="value">${ev.price_participants}</span></div>
          </div>` : ""}
        </div>
        <div class="detail-actions">
          <a href="${ev.link}" target="_blank" class="btn btn-primary btn-premium">
            ${t("btnInfo")}
          </a>
        </div>
      </div>
    </div>
  `;

  setEventStructuredData(ev);
}

async function loadEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const container = document.getElementById("event-detail-content");
  if (!eventId) return;

  try {
    const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();
    if (error) throw error;
    currentEventData = data;
    renderEvent(currentEventData);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style='color:red; text-align:center;'>${t("errorLoad")}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  loadEventDetail();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      applyTranslations();
      if (currentEventData) renderEvent(currentEventData);
      const backBtn = document.querySelector('[data-i18n="backBtn"]');
      if (backBtn) backBtn.textContent = t("backBtn");
    });
  });
});
