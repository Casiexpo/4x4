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

// CARGAR EVENTOS DESDE FIREBASE
async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        grid.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (querySnapshot.empty) {
            grid.innerHTML = '<p style="color:white; grid-column:1/-1; text-align:center;">No hi ha esdeveniments programats.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const ev = doc.data();
            const eventDate = new Date(ev.date + 'T00:00:00');
            const isPast = eventDate < today;

            const card = document.createElement('article');
            card.className = 'event-card';
            if (isPast) card.style.opacity = '0.5';

            card.innerHTML = `
                <a href="${ev.link}" target="_blank" class="card-link">
                    <div class="card-img-wrap">
                        <img src="${ev.imageUrl}" alt="${ev.title}" class="card-img" loading="lazy">
                        <span class="card-badge trial">Trial</span>
                        ${isPast ? '<span class="card-badge-past" style="background:red; position:absolute; top:10px; right:10px; padding:2px 8px; border-radius:4px; font-size:12px;">Passat</span>' : ''}
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${ev.title}</h3>
                        <ul class="card-meta">
                            <li><span>📅</span> ${ev.date}</li>
                            <li><span>📍</span> ${ev.location}</li>
                            <li><span>💶</span> ${ev.price}</li>
                        </ul>
                        <span class="btn btn-card">Més info</span>
                    </div>
                </a>
            `;
            grid.appendChild(card);
            
            // Aplicar efecto de inclinación (Tilt) que tenías
            applyTiltEffect(card);
        });

    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p style="color:white;">Error al carregar dades.</p>';
    }
}

// MANTENER TUS EFECTOS ORIGINALES
function applyTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
}

// EFECTO HEADER SCROLL
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
});

// INICIAR CARGA
document.addEventListener('DOMContentLoaded', loadEvents);
