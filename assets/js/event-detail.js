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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
                    <div>
                        <img src="${ev.imageUrl}" style="width: 100%; border-radius: 12px; border: 1px solid var(--border);">
                    </div>
                    <div>
                        <h1 style="color: var(--orange); font-size: 3rem; margin-bottom: 20px;">${ev.title}</h1>
                        <ul style="list-style: none; padding: 0; font-size: 1.2rem; color: #ccc; line-height: 2;">
                            <li><strong style="color:white;">📅 Data:</strong> ${ev.date}</li>
                            <li><strong style="color:white;">📍 Ubicació:</strong> ${ev.location}</li>
                            <li><strong style="color:white;">💶 Preu:</strong> ${ev.price}</li>
                        </ul>
                        <div style="margin-top: 30px;">
                            <a href="${ev.link}" target="_blank" class="btn btn-primary" style="display: inline-block;">Inscriure's ara</a>
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
