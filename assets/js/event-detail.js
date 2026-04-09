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

    if (!eventId) {
        container.innerHTML = "<p style='color:white;'>Error: No s'ha trobat l'ID de l'esdeveniment.</p>";
        return;
    }

    try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const ev = docSnap.data();
            container.innerHTML = `
                <div class="event-detail-wrapper">
                    <div class="event-image-container">
                        <img src="${ev.imageUrl}" alt="${ev.title}">
                    </div>
                    <div class="event-info">
                        <h1 class="orange-text">${ev.title}</h1>
                        <ul class="event-meta-list">
                            <li><span>📅</span> <strong>Data:</strong> ${ev.date}</li>
                            <li><span>📍</span> <strong>Ubicació:</strong> ${ev.location}</li>
                            <li><span>💶</span> <strong>Preu:</strong> ${ev.price}</li>
                        </ul>
                        <div class="detail-actions">
                            <a href="${ev.link}" target="_blank" class="btn btn-primary" style="display:inline-block; width:100%; max-width:300px; text-align:center;">
                                Inscriure's / Més info
                            </a>
                        </div>
                    </div>
                </div>
            `;
            document.title = `${ev.title} - 4x4 Catalunya`;
        } else {
            container.innerHTML = "<p style='color:white;'>L'esdeveniment no existeix.</p>";
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='color:white;'>Error al carregar les dades.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadEventDetail);
