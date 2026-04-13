import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDly5eTPk_a1c1gtXQO4YI72V9Naqjz40o",
    authDomain: "x4-catalunya.firebaseapp.com",
    projectId: "x4-catalunya"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function formatDateRange(start, end) {
    if (!start) return '—';
    if (!end || end === start) return start;
    return `${start} → ${end}`;
}

async function loadEventDetail() {
    const params    = new URLSearchParams(window.location.search);
    const eventId   = params.get('id');
    const container = document.getElementById('event-detail-content');

    if (!eventId) return;

    try {
        const docRef  = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const ev          = docSnap.data();
            const tipoEvento  = ev.tipo_evento || 'trial';

            // Compatibilitat amb camps antics
            const dateStr     = formatDateRange(ev.date_start || ev.date, ev.date_end);
            const priceStr    = ev.price_public || ev.price || 'GRATIS';

            // Badges opcionals (food trucks / crawler)
            const extraBadges = `
                ${ev.food_trucks  ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#92400e; color:#fef3c7; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🍔 Food Trucks</span>' : ''}
                ${ev.zona_crawler ? '<span style="display:inline-flex; align-items:center; gap:6px; background:#1e3a5f; color:#bfdbfe; font-family:\'Barlow Condensed\',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border-radius:6px; padding:5px 12px;">🚗 Zona Crawler / RC</span>' : ''}
            `;
            const hasExtras   = ev.food_trucks || ev.zona_crawler;

            container.innerHTML = `
                <div class="premium-wrapper">
                    <div class="premium-image">
                        <span class="card-badge ${tipoEvento.toLowerCase()}" style="position:absolute; top:20px; left:20px; z-index:10;">
                            ${tipoEvento.toUpperCase()}
                        </span>
                        <img src="${ev.imageUrl}" alt="Cartell ${ev.title}">
                    </div>
                    <div class="premium-info">
                        <h1 class="premium-title orange-text">${ev.title}</h1>

                        ${hasExtras ? `<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">${extraBadges}</div>` : ''}

                        <div class="info-boxes">
                            <div class="info-box">
                                <span class="icon">📅</span>
                                <div><span class="label">Data</span><span class="value">${dateStr}</span></div>
                            </div>
                            <div class="info-box">
                                <span class="icon">📍</span>
                                <div><span class="label">Ubicació</span><span class="value">${ev.location}</span></div>
                            </div>
                            <div class="info-box">
                                <span class="icon">💶</span>
                                <div><span class="label">Entrada pública</span><span class="value">${priceStr}</span></div>
                            </div>
                        </div>

                        <div class="detail-actions">
                            <a href="${ev.link}" target="_blank" class="btn btn-primary btn-premium">
                                Informació i Inscripció
                            </a>
                        </div>
                    </div>
                </div>
            `;
            document.title = `${ev.title} - 4x4 Catalunya`;
        } else {
            container.innerHTML = "<p style='color:white; text-align:center;'>L'esdeveniment no existeix o ha estat esborrat.</p>";
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='color:red; text-align:center;'>Error al carregar les dades.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadEventDetail);