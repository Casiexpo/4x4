import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const loginSec = document.getElementById('login-section');
const adminSec = document.getElementById('admin-panel');
const listSec = document.getElementById('admin-list-section');

// 1. CONTROL DE SESIÓN
onAuthStateChanged(auth, (user) => {
    if (user) { 
        loginSec.style.display = 'none'; 
        adminSec.style.display = 'block';
        listSec.style.display = 'block'; // Mostramos la lista
        loadAdminEvents(); // Cargamos los eventos
    } else { 
        loginSec.style.display = 'block'; 
        adminSec.style.display = 'none';
        listSec.style.display = 'none';
    }
});

// 2. LOGIN Y LOGOUT
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => document.getElementById('login-error').style.display = 'block');
});
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

// 3. CONVERTIR FOTO
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 4. CREAR EVENTO
document.getElementById('create-event-btn').addEventListener('click', async (e) => {
    const btn = e.target;
    const file = document.getElementById('ev-image').files[0];
    if (!file) { alert("Sube una imagen"); return; }
    btn.disabled = true; btn.textContent = "Guardant...";

    try {
        const base64Img = await toBase64(file);
        await addDoc(collection(db, "events"), {
            title: document.getElementById('ev-title').value,
            date: document.getElementById('ev-date').value,
            location: document.getElementById('ev-location').value,
            price: document.getElementById('ev-price').value,
            link: document.getElementById('ev-link').value,
            imageUrl: base64Img,
            timestamp: new Date().getTime()
        });
        alert("¡Creat correctament!");
        window.location.reload();
    } catch (err) {
        console.error(err); alert("Error"); btn.disabled = false;
    }
});

// 5. CARGAR LISTA PARA BORRAR
async function loadAdminEvents() {
    const container = document.getElementById('events-list-admin');
    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        
        if (snap.empty) {
            container.innerHTML = "<p style='color:white;'>No hi ha esdeveniments creats.</p>";
            return;
        }

        container.innerHTML = '';
        snap.forEach(docSnap => {
            const ev = docSnap.data();
            const div = document.createElement('div');
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:15px; background:#222; margin-bottom:10px; border-radius:8px; border:1px solid #333;";
            div.innerHTML = `
                <div>
                    <strong style="color:var(--orange); display:block;">${ev.title}</strong>
                    <span style="color:#888; font-size:14px;">📅 ${ev.date} | 📍 ${ev.location}</span>
                </div>
                <button class="btn delete-btn" data-id="${docSnap.id}" style="background:#ff3333; color:white; padding:8px 15px; font-size:12px;">Eliminar</button>
            `;
            container.appendChild(div);
        });

        // Añadir el evento de click a todos los botones de borrar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteEvent);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p style='color:red;'>Error al carregar la llista.</p>";
    }
}

// 6. FUNCIÓN DE BORRAR
async function deleteEvent(e) {
    const eventId = e.target.getAttribute('data-id');
    
    // Ventana de confirmación de seguridad
    if (confirm("Segur que vols esborrar aquest esdeveniment per sempre?")) {
        e.target.textContent = "Esborrant...";
        e.target.disabled = true;
        
        try {
            // Comando mágico de Firebase para borrar
            await deleteDoc(doc(db, "events", eventId));
            loadAdminEvents(); // Recargamos la lista
        } catch (error) {
            console.error(error);
            alert("Error al esborrar");
            e.target.textContent = "Eliminar";
            e.target.disabled = false;
        }
    }
}
