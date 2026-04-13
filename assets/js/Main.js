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
let currentCount = 0;

function renderEvents() {
    const grid = document.getElementById('events-grid');
    const nextBatch = allEvents.slice(currentCount, currentCount + EVENTS_PER_PAGE);

    nextBatch.forEach(({ id, data: ev }) => {
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
                        <li><span>📅</span> ${ev.date}</li>
                        <li><span>📍</span> ${ev.location}</li>
                        <li><span>💶</span> ${ev.price}</li>
                    </ul>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });

    currentCount += nextBatch.length;

    // Actualitzar botó "Veure més"
    const btn = document.getElementById('load-more-btn');
    if (btn) {
        if (currentCount >= allEvents.length) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline-block';
        }
    }
}

async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        grid.innerHTML = '';

        allEvents = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        currentCount = 0;

        if (allEvents.length === 0) {
            grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Encara no hi ha esdeveniments publicats.</p>';
            return;
        }

        // Primer lot de 6
        renderEvents();

        // Botó "Veure més"
        const section = document.getElementById('events');
        if (section && !document.getElementById('load-more-btn')) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'text-align: center; margin-top: 40px; padding-bottom: 20px;';
            const btn = document.createElement('button');
            btn.id = 'load-more-btn';
            btn.className = 'btn btn-primary';
            btn.textContent = 'Veure més';
            btn.style.display = currentCount >= allEvents.length ? 'none' : 'inline-block';
            btn.addEventListener('click', renderEvents);
            wrapper.appendChild(btn);
            section.querySelector('.container').appendChild(wrapper);
        }

    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', loadEvents);

// Classe "scrolled" al header quan es fa scroll
(function() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();
