import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDly5eTPk_a1c1gtXQO4YI72V9Naqjz40o",
    authDomain: "x4-catalunya.firebaseapp.com",
    projectId: "x4-catalunya",
    storageBucket: "x4-catalunya.firebasestorage.app",
    messagingSenderId: "462617699135",
    appId: "1:462617699135:web:51d11630a82ad03cf0698a",
    measurementId: "G-ZXK7YPPXP5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EVENTS_PER_PAGE = 6;
let allEvents = [];
let filteredEvents = [];
let currentCount = 0;
let activeFilter = 'tot';

function createCard(id, ev) {
    const tipo = ev.tipo_evento || 'trial';
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
        <a href="evento.html?id=${id}" class="card-link">
            <div class="card-img-wrap">
                <img src="${ev.imageUrl}" class="card-img" alt="${ev.title}" loading="lazy">
                <span class="card-badge ${tipo.toLowerCase()}">${tipo.toUpperCase()}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${ev.title}</h3>
                <ul class="card-meta">
                    <li><span>📅</span> ${ev.date_start || ev.date || ''}${ev.date_end && ev.date_end !== ev.date_start ? ' → ' + ev.date_end : ''}</li>
                    <li><span>📍</span> ${ev.location}</li>
                    <li><span>💶</span> Públic: ${ev.price_public || ev.price || 'GRATIS'}</li>
                    ${ev.price_participants ? `<li><span>🏁</span> Participants: ${ev.price_participants}</li>` : ''}
                </ul>
            </div>
        </a>
    `;
    return card;
}

function updateLoadMoreBtn() {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;
    btn.style.display = currentCount >= filteredEvents.length ? 'none' : 'inline-block';
}

function renderNextBatch() {
    const grid = document.getElementById('events-grid');
    const nextBatch = filteredEvents.slice(currentCount, currentCount + EVENTS_PER_PAGE);
    nextBatch.forEach(({ id, data: ev }) => grid.appendChild(createCard(id, ev)));
    currentCount += nextBatch.length;
    updateLoadMoreBtn();
}

function applyFilter(filter) {
    activeFilter = filter;

    // Actualitzar botons actius
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Filtrar events
    filteredEvents = filter === 'tot'
        ? [...allEvents]
        : allEvents.filter(({ data: ev }) => (ev.tipo_evento || 'trial').toLowerCase() === filter);

    // Reiniciar graella
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '';
    currentCount = 0;

    if (filteredEvents.length === 0) {
        grid.innerHTML = `<p style="color:#aaa; text-align:center; grid-column:1/-1; padding: 40px 0;">No hi ha esdeveniments d'aquest tipus.</p>`;
        updateLoadMoreBtn();
        return;
    }

    renderNextBatch();
}

async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const q = query(collection(db, "events"), orderBy("date_start", "asc"));
        const snap = await getDocs(q);
        grid.innerHTML = '';

        allEvents = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        filteredEvents = [...allEvents];
        currentCount = 0;

        if (allEvents.length === 0) {
            grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Encara no hi ha esdeveniments publicats.</p>';
            return;
        }

        // Primer lot de 6
        renderNextBatch();

        // Botó "Veure més"
        const section = document.getElementById('events');
        if (section && !document.getElementById('load-more-btn')) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'text-align: center; margin-top: 40px; padding-bottom: 20px;';
            const btn = document.createElement('button');
            btn.id = 'load-more-btn';
            btn.className = 'btn btn-primary';
            btn.textContent = 'Veure més';
            btn.addEventListener('click', renderNextBatch);
            wrapper.appendChild(btn);
            section.querySelector('.container').appendChild(wrapper);
            updateLoadMoreBtn();
        }

    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    // Lligar botons de filtre immediatament, no esperar Firebase
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });
});

// Classe "scrolled" al header quan es fa scroll
(function() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();