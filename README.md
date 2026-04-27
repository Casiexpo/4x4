# 4x4 Catalunya 🚜💨

El directori definitiu de **Trials 4x4 i competicions off-road** a Catalunya. Una plataforma moderna, ràpida i optimitzada per als amants del tot terreny.

🌐 **Web en producció:** [trials4x4.cat](https://trials4x4.cat)

---

## 📋 Descripció

Aquesta web és un directori centralitzat que recull tots els esdeveniments 4x4 del territori català. Ofereix una interfície neta amb un disseny *dark mode* esportiu, backend amb Supabase i un sistema multiidioma complet.

### Característiques principals

* **Gestió Dinàmica:** Els esdeveniments es carreguen automàticament des de Supabase.
* **Panell d'Administració:** Sistema privat per afegir, editar i eliminar esdeveniments sense tocar codi.
* **Pàgina de Detall:** Fitxa individual per a cada esdeveniment amb tota la informació i dades estructurades (Schema.org).
* **Disseny Premium:** Estètica off-road amb tema fosc i accents taronja, tipografies *Barlow* i *Barlow Condensed*.
* **Multiidioma (i18n):** Selector d'idioma amb banderes (Català, Espanyol, Anglès, Francès). Traducció client-side.
* **SEO Avançat:** Metadades completes (Open Graph, Twitter Cards), Schema.org (WebSite, Organization, FAQPage, Event, BreadcrumbList, ItemList), sitemap dinàmic.
* **Responsive:** Totalment adaptat a mòbils i tauletes.
* **Carrusel d'imatges:** Secció "Sobre nosaltres" amb carrusel automàtic.
* **Filtres per tipus:** Trial, Curs, Altres amb botó "Veure més" per paginació.
* **Compliment legal:** Avís legal, política de privacitat i política de cookies (LSSI-CE / RGPD / LOPDGDD).
* **Banner de cookies:** Informació transparent sobre l'ús de localStorage (no s'utilitzen cookies).

---

## 🛠️ Tecnologies

| Capa | Tecnologia |
|------|------------|
| Frontend | HTML5, CSS3 (Custom Properties & Grid), JavaScript ES6 Modules |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + API REST) |
| Hosting | [GitHub Pages](https://pages.github.com/) |
| Fonts | Google Fonts (Barlow, Barlow Condensed) |
| CDN | jsDelivr (Supabase JS client) |
| Domini | trials4x4.cat (CNAME) |

---

## 📁 Estructura del Projecte

```text
├── assets/
│   ├── css/
│   │   └── styles.css          # Estils globals (dark theme, responsive, cookie banner, legal page)
│   ├── js/
│   │   ├── Main.js             # Lògica de la home: càrrega d'esdeveniments, SEO, filtres
│   │   ├── event-detail.js     # Fitxa individual d'esdeveniment amb Schema.org
│   │   ├── admin.js            # Panell d'administració (CRUD d'esdeveniments)
│   │   ├── carrusel.js         # Carrusel d'imatges automàtic
│   │   ├── i18n.js             # Sistema de traduccions (CA/ES/EN/FR)
│   │   └── cookie-banner.js    # Banner informatiu de cookies/localStorage
│   ├── img/                    # Logos i recursos visuals
│   │   └── carrusel/           # Fotos del carrusel "Sobre nosaltres"
│   └── scripts/
│       └── generate-sitemap.ps1 # Script PowerShell per generar sitemap dinàmic
├── index.html                  # Pàgina principal (Home)
├── evento.html                 # Plantilla dinàmica de detall d'esdeveniment
├── avis-legal.html             # Avís legal, privacitat i cookies
├── admin.html                  # Gestor d'esdeveniments (accés restringit)
├── sitemap.xml                 # Mapa del lloc per a cercadors
├── robots.txt                  # Directrius per a crawlers
├── CNAME                       # Configuració del domini personalitzat
└── README.md
```

---

## 🔍 SEO i Indexació

* **Google Search Console:** Lloc verificat a `trials4x4.cat`.
* **Canonical tags:** Una sola canonical per pàgina, sense hreflang (i18n client-side).
* **Sitemap dinàmic:** `generate-sitemap.ps1` genera un sitemap amb la pàgina principal, la pàgina legal i cada esdeveniment individual.
* **robots.txt:** Permet el rastreig complet i apunta al sitemap.
* **`evento.html`:** `noindex` per defecte; JavaScript canvia a `index` quan carrega un esdeveniment real amb `?id=`.

---

## ⚖️ Compliment Legal

* **Avís Legal** (LSSI-CE): Identificació del titular, condicions d'ús, propietat intel·lectual.
* **Política de Privacitat** (RGPD/LOPDGDD): Dades recollides, finalitat, base legal, drets de l'interessat.
* **Política de Cookies:** No s'utilitzen cookies. Es detalla l'ús de `localStorage` (idioma i consent).
* **Serveis de tercers:** Declaració de GitHub Pages, Supabase, Google Fonts i jsDelivr.
* **Banner informatiu:** Apareix a totes les pàgines informant que no s'utilitzen cookies.

---

## 🚀 Desplegament

El projecte es desplega automàticament a GitHub Pages amb cada `git push` a la branca principal.

```bash
git add .
git commit -m "descripció dels canvis"
git push origin main
```

Per regenerar el sitemap amb els esdeveniments actuals:

```powershell
cd assets/scripts
.\generate-sitemap.ps1
```

---

## 📬 Contacte

* **Web:** [trials4x4.cat](https://trials4x4.cat)
* **Email:** [trials4x4catalunya@gmail.com](mailto:trials4x4catalunya@gmail.com)

---

© 2026 4x4 Catalunya — Tots els drets reservats.
