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

async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        grid.innerHTML = '';

        snap.forEach(doc => {
            const ev = doc.data();
            
            // ESTA ES LA CLAVE: sacamos el tipo o ponemos trial por defecto
            const tipo = ev.tipo_evento || 'trial'; 
            
            const card = document.createElement('article');
            card.className = 'event-card';
            card.innerHTML = `
                <a href="evento.html?id=${doc.id}" class="card-link">
                    <div class="card-img-wrap">
                        <img src="${ev.imageUrl}" class="card-img">
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