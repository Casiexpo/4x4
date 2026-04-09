import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

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
const storage = getStorage(app);

const loginSec = document.getElementById('login-section');
const adminSec = document.getElementById('admin-panel');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSec.style.display = 'none';
        adminSec.style.display = 'block';
    } else {
        loginSec.style.display = 'block';
        adminSec.style.display = 'none';
    }
});

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => {
        document.getElementById('login-error').style.display = 'block';
    });
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

document.getElementById('create-event-btn').addEventListener('click', async (e) => {
    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Pujant dades...";

    const file = document.getElementById('ev-image').files[0];
    const title = document.getElementById('ev-title').value;
    const date = document.getElementById('ev-date').value;
    const location = document.getElementById('ev-location').value;
    const price = document.getElementById('ev-price').value;
    const link = document.getElementById('ev-link').value;

    try {
        let imageUrl = "https://via.placeholder.com/400x280?text=4x4+Catalunya";

        if (file) {
            const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "events"), {
            title, date, location, price, link, imageUrl,
            timestamp: new Date().getTime()
        });

        document.getElementById('upload-status').style.display = 'block';
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        console.error(error);
        alert("Error en la pujada");
        btn.disabled = false;
        btn.textContent = "Publicar Esdeveniment";
    }
});
