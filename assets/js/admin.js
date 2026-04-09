import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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

// Manejo de Login/UI
const loginSec = document.getElementById('login-section');
const adminSec = document.getElementById('admin-panel');

onAuthStateChanged(auth, (user) => {
    if (user) { loginSec.style.display = 'none'; adminSec.style.display = 'block'; }
    else { loginSec.style.display = 'block'; adminSec.style.display = 'none'; }
});

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => alert("Error de login"));
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

// FUNCIÓN PARA CONVERTIR IMAGEN A BASE64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// SUBIR EVENTO
document.getElementById('create-event-btn').addEventListener('click', async (e) => {
    const btn = e.target;
    const file = document.getElementById('ev-image').files[0];
    
    if (!file) { alert("Sube una imagen primero"); return; }
    
    btn.disabled = true;
    btn.textContent = "Guardant...";

    try {
        const base64Img = await toBase64(file); // Convertimos aquí

        await addDoc(collection(db, "events"), {
            title: document.getElementById('ev-title').value,
            date: document.getElementById('ev-date').value,
            location: document.getElementById('ev-location').value,
            price: document.getElementById('ev-price').value,
            link: document.getElementById('ev-link').value,
            imageUrl: base64Img, // Guardamos el texto largo de la imagen
            timestamp: new Date().getTime()
        });

        alert("¡Evento creado!");
        window.location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al guardar");
        btn.disabled = false;
    }
});
