import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDly5eTPk_a1c1gtXQO4YI72V9Naqjz40o",
    authDomain: "x4-catalunya.firebaseapp.com",
    projectId: "x4-catalunya"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadEventDetail() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    const container = document.getElementById('event-detail-content');

    if (!eventId) return;

    try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const ev = docSnap.data();
            const tipoEvento = ev.tipo_evento || 'trial';

            container.innerHTML = `
                <div class="premium-wrapper">
                    <div class="premium-image">
                        <span class="card-badge ${tipoEvento.toLowerCase()}" style="position: absolute; top: 20px; left: 20px; z-index: 10;">
                            ${tipoEvento.toUpperCase()}
                        </span>
                        <img src="${ev.imageUrl}" alt="Cartell ${ev.title}">
                    </div>
                    <div class="premium-info">
                        <h1 class="premium-title orange-text">${ev.title}</h1>
                        <div class="info-boxes">
                            <div class="info-box">
                                <span class="icon">📅</span>
                                <div><span class="label">Data</span><span class="value">${ev.date}</span></div>
                            </div>
                            <div class="info-box">
                                <span class="icon">📍</span>
                                <div><span class="label">Ubicació</span><span class="value">${ev.location}</span></div>
                            </div>
                            <div class="info-box">
                                <span class="icon">💶</span>
                                <div><span class="label">Preu</span><span class="value">${ev.price}</span></div>
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