import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

// TU CONFIGURACIÓN EXACTA
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

// Referencias UI
const loginSec = document.getElementById('login-section');
const adminSec = document.getElementById('admin-panel');

// 1. Control de Estado de Sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSec.style.display = 'none';
    adminSec.style.display = 'block';
  } else {
    loginSec.style.display = 'block';
    adminSec.style.display = 'none';
  }
});

// 2. Hacer Login
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, pass).catch(err => {
    console.error(err);
    document.getElementById('login-error').style.display = 'block';
  });
});

// 3. Salir
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

// 4. Subir Imagen y Crear Evento
document.getElementById('create-event-btn').addEventListener('click', async (e) => {
  e.target.disabled = true;
  e.target.textContent = "Subiendo...";

  const file = document.getElementById('ev-image').files[0];
  const title = document.getElementById('ev-title').value;
  const date = document.getElementById('ev-date').value;
  const location = document.getElementById('ev-location').value;
  const price = document.getElementById('ev-price').value;
  const link = document.getElementById('ev-link').value;

  try {
    let imageUrl = "assets/img/placeholder.svg";

    if (file) {
      const storageRef = ref(storage, `eventos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "events"), {
      title, date, location, price, link, imageUrl,
      timestamp: new Date()
    });

    document.getElementById('upload-status').style.display = 'block';
    setTimeout(() => window.location.reload(), 2000);
  } catch (error) {
    console.error("Error subiendo evento: ", error);
    alert("Hubo un error al crear el evento.");
  } finally {
    e.target.disabled = false;
    e.target.textContent = "Subir Evento";
  }
});
