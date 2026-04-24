import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { TRANSLATIONS, getLang, setLang, t } from "./i18n.js";

const SUPABASE_URL = "https://rvcplafkusuwbcvxdzgz.supabase.co";
const SUPABASE_KEY = "sb_publishable_U64qz-HfU2mYsv-VpKPmjg_Z9vqg64O";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = "https://trials4x4.cat";
const DEFAULT_IMAGE = `${BASE_URL}/assets/img/hero-4x4.png`;
const EVENTS_PER_PAGE = 6;

let allEvents = [];
let filteredEvents = [];
let currentCount = 0;
let activeFilter = "tot";

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

function setHomeStructuredData(events = []) {
  const pageUrl = `${BASE_URL}/`;

  setJsonLd("website-schema", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "4x4 Catalunya",
    alternateName: "Trials 4x4 Catalunya",
    url: pageUrl,
    inLanguage: "ca",
    description:
      "Calendari i directori de trials 4x4, proves off-road i esdeveniments tot terreny a Catalunya.",
  });

  setJsonLd("organization-schema", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "4x4 Catalunya",
    url: pageUrl,
    logo: absoluteUrl("/assets/img/logo-4x4-catalunya-modified.png"),
    email: "mailto:trials4x4catalunya@gmail.com",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Catalunya",
      containedInPlace: {
        "@type": "Country",
        name: "Espanya",
      },
    },
  });

  setJsonLd("breadcrumb-schema", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inici",
        item: pageUrl,
      },
    ],
  });

  setJsonLd("faq-schema", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "On puc veure el proper trial 4x4 a Catalunya?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A 4x4 Catalunya pots consultar en un sol lloc els propers trials 4x4 i esdeveniments off-road a Catalunya amb dates, ubicacions, preus i enllaços d'inscripció o informació.",
        },
      },
      {
        "@type": "Question",
        name: "Quina informació hi ha a cada esdeveniment?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cada fitxa pot incloure la data, el municipi o circuit, el preu per al públic, el preu per als participants, el cartell i l'enllaç oficial per ampliar informació o inscriure's.",
        },
      },
      {
        "@type": "Question",
        name: "Es poden publicar trials 4x4 de qualsevol punt de Catalunya?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Si organitzes un trial 4x4 o una activitat off-road a Catalunya, pots contactar amb 4x4 Catalunya per centralitzar la informació i fer-la arribar a l'afició.",
        },
      },
      {
        "@type": "Question",
        name: "Quan es fa el pròxim trial 4x4 a Catalunya?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "El calendari de la portada mostra els propers trials 4x4 ordenats per data. Les dates es van actualitzant a mesura que els organitzadors publiquen les seves proves a Barcelona, Girona, Lleida o Tarragona.",
        },
      },
      {
        "@type": "Question",
        name: "Com puc participar en un trial 4x4 a Catalunya?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cada fitxa d'esdeveniment inclou l'enllaç oficial de l'organitzador on pots trobar els requisits d'inscripció, el reglament i la documentació necessària per participar-hi com a pilot o copilot.",
        },
      },
      {
        "@type": "Question",
        name: "Què és un trial 4x4 i on es fan a Catalunya?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Un trial 4x4 és una competició off-road on els vehicles tot terreny han de superar zones de dificultat en terrenys naturals. A Catalunya se'n celebren a diverses comarques, des del Pirineu fins a les terres de l'Ebre, passant per la Catalunya Central.",
        },
      },
    ],
  });

  const listItems = events.map((event, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${BASE_URL}/evento.html?id=${event.id}`,
    name: event.title,
    image: absoluteUrl(event.image_url),
  }));

  if (listItems.length) {
    setJsonLd("event-list-schema", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Propers trials 4x4 a Catalunya",
      description: "Calendari actualitzat de trials 4x4 i esdeveniments off-road a Catalunya.",
      numberOfItems: listItems.length,
      itemListElement: listItems,
    });
  }
}

setSeoMeta({
  title: "4x4 Catalunya | Trials 4x4, off-road i calendari a Catalunya",
  description:
    "Calendari de trials 4x4 a Catalunya amb dates, ubicacions, preus i enllaços oficials. Troba en un sol lloc els propers esdeveniments off-road i tot terreny a Catalunya.",
  url: `${BASE_URL}/`,
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

function switchLang(lang) {
  setLang(lang);
  applyTranslations();

  const grid = document.getElementById("events-grid");
  if (grid && allEvents.length > 0) {
    grid.innerHTML = "";
    currentCount = 0;
    filteredEvents =
      activeFilter === "tot"
        ? [...allEvents]
        : allEvents.filter((ev) => (ev.tipo_evento || "trial").toLowerCase() === activeFilter);
    renderNextBatch();
    updateLoadMoreBtn();
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const key = btn.getAttribute("data-i18n");
    if (key) btn.textContent = t(key);
    btn.classList.toggle("active", btn.dataset.filter === activeFilter);
  });
}

function createCard(ev) {
  const tipo = ev.tipo_evento || "trial";
  const card = document.createElement("article");
  card.className = "event-card";
  const dateStr =
    ev.date_end && ev.date_end !== ev.date_start ? `${ev.date_start} → ${ev.date_end}` : ev.date_start || "";
  const priceLabel = ev.price_public || t("free");
  const participLabel = ev.price_participants
    ? `<li><span>🏁</span> ${t("labelParticip")}: ${ev.price_participants}</li>`
    : "";

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
          <li><span>💶</span> ${t("labelPublic")}: ${priceLabel}</li>
          ${participLabel}
        </ul>
      </div>
    </a>
  `;
  return card;
}

function updateLoadMoreBtn() {
  const btn = document.getElementById("load-more-btn");
  if (!btn) return;
  btn.textContent = t("loadMore");
  btn.style.display = currentCount >= filteredEvents.length ? "none" : "inline-block";
}

function renderNextBatch() {
  const grid = document.getElementById("events-grid");
  const nextBatch = filteredEvents.slice(currentCount, currentCount + EVENTS_PER_PAGE);
  nextBatch.forEach((ev) => grid.appendChild(createCard(ev)));
  currentCount += nextBatch.length;
  updateLoadMoreBtn();
}

function applyFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  filteredEvents =
    filter === "tot"
      ? [...allEvents]
      : allEvents.filter((ev) => (ev.tipo_evento || "trial").toLowerCase() === filter);
  const grid = document.getElementById("events-grid");
  grid.innerHTML = "";
  currentCount = 0;
  if (filteredEvents.length === 0) {
    grid.innerHTML = `<p style="color:#aaa; text-align:center; grid-column:1/-1; padding: 40px 0;">${t("noEventsFilter")}</p>`;
    updateLoadMoreBtn();
    return;
  }
  renderNextBatch();
}

async function loadEvents() {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  try {
    const { data, error } = await supabase.from("events").select("*").order("date_start", { ascending: true });
    if (error) throw error;

    grid.innerHTML = "";
    allEvents = data || [];
    filteredEvents = [...allEvents];
    currentCount = 0;
    setHomeStructuredData(allEvents);

    if (allEvents.length === 0) {
      grid.innerHTML = `<p style="color: white; text-align: center; grid-column: 1/-1;">${t("noEvents")}</p>`;
      return;
    }

    renderNextBatch();
    const section = document.getElementById("events");
    if (section && !document.getElementById("load-more-btn")) {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "text-align: center; margin-top: 40px; padding-bottom: 20px;";
      const btn = document.createElement("button");
      btn.id = "load-more-btn";
      btn.className = "btn btn-primary";
      btn.textContent = t("loadMore");
      btn.addEventListener("click", renderNextBatch);
      wrapper.appendChild(btn);
      section.querySelector(".container").appendChild(wrapper);
      updateLoadMoreBtn();
    }
  } catch (error) {
    console.error(error);
    setHomeStructuredData([]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  loadEvents();

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchLang(btn.dataset.lang));
  });
});

(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
