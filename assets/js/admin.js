import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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

// =========================================================
// SISTEMA DE NOTIFICACIONES CUSTOM (TOASTS Y MODAL)
// =========================================================

const style = document.createElement('style');
style.textContent = `
    #custom-toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .custom-toast { background: var(--bg-card, #1a1a1a); color: #fff; padding: 16px 24px; border-radius: 8px; border-left: 4px solid var(--orange, #E8650A); box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: 'Barlow', sans-serif; font-size: 1.1rem; display: flex; align-items: center; gap: 12px; transform: translateX(150%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .custom-toast.show { transform: translateX(0); }
    .custom-toast.error { border-left-color: #ff3333; }
    
    #custom-confirm-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; backdrop-filter: blur(4px); }
    #custom-confirm-modal.show { opacity: 1; pointer-events: auto; }
    .confirm-box { background: var(--bg-card, #1a1a1a); padding: 40px; border-radius: 16px; border: 1px solid var(--border, #2a2a2a); text-align: center; max-width: 400px; width: 90%; transform: translateY(-30px); transition: transform 0.3s ease; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    #custom-confirm-modal.show .confirm-box { transform: translateY(0); }
    .confirm-btns { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
`;
document.head.appendChild(style);

const toastContainer = document.createElement('div');
toastContainer.id = 'custom-toast-container';
document.body.appendChild(toastContainer);

function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `<span style="font-size:1.4rem;">${type === 'error' ? '❌' : '✅'}</span> <span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

const confirmModal = document.createElement('div');
confirmModal.id = 'custom-confirm-modal';
confirmModal.innerHTML = `
    <div class="confirm-box">
        <h2 style="color:var(--orange, #E8650A); margin-bottom:15px; font-family:'Barlow Condensed', sans-serif; text-transform:uppercase;">⚠️ Atenció</h2>
        <p id="confirm-msg" style="color:#ddd; font-size:1.1rem; line-height:1.5;"></p>
        <div class="confirm-btns">
            <button id="confirm-cancel" class="btn" style="background:#333; padding:12px 25px;">Cancel·lar</button>
            <button id="confirm-ok" class="btn" style="background:#ff3333; color:white; padding:12px 25px;">Sí, eliminar</button>
        </div>
    </div>
`;
document.body.appendChild(confirmModal);

function customConfirm(msg) {
    return new Promise((resolve) => {
        document.getElementById('confirm-msg').innerHTML = msg;
        confirmModal.classList.add('show');
        document.getElementById('confirm-cancel').onclick = () => { confirmModal.classList.remove('show'); resolve(false); };
        document.getElementById('confirm-ok').onclick = () => { confirmModal.classList.remove('show'); resolve(true); };
    });
}

// =========================================================
// LÒGICA PRINCIPAL (LOGIN, CREAR, EDITAR, ELIMINAR)
// =========================================================

const loginSec = document.getElementById('login-section');
const adminSec = document.getElementById('admin-panel');
const listSec = document.getElementById('admin-list-section');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSec.style.display = 'none';
        adminSec.style.display = 'block';
        listSec.style.display = 'block';
        loadAdminEvents();
    } else {
        loginSec.style.display = 'block';
        adminSec.style.display = 'none';
        listSec.style.display = 'none';
    }
});

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => {
        document.getElementById('login-error').style.display = 'block';
        showToast("Credencials incorrectes", "error");
    });
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// ---- CREAR ESDEVENIMENT ----
document.getElementById('create-event-btn').addEventListener('click', async (e) => {
    const btn = e.target;
    const file = document.getElementById('ev-image').files[0];

    if (!file) { showToast("Si us plau, puja el cartell de l'esdeveniment", "error"); return; }
    if (!document.getElementById('ev-title').value) { showToast("Has d'escriure un títol", "error"); return; }

    btn.disabled = true; btn.textContent = "Guardant dades...";

    try {
        const base64Img = await toBase64(file);
        await addDoc(collection(db, "events"), {
            title: document.getElementById('ev-title').value,
            date: document.getElementById('ev-date').value,
            location: document.getElementById('ev-location').value,
            price: document.getElementById('ev-price').value,
            link: document.getElementById('ev-link').value,
            imageUrl: base64Img,
            tipo_evento: document.getElementById('tipo_evento').value,
            timestamp: new Date().getTime()
        });

        showToast("Esdeveniment publicat amb èxit!");
        setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
        console.error(err);
        showToast("Error de connexió al guardar", "error");
        btn.disabled = false;
        btn.textContent = "Publicar Esdeveniment";
    }
});

// ---- CARREGAR LLISTA D'ADMIN ----
async function loadAdminEvents() {
    const container = document.getElementById('events-list-admin');
    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);

        if (snap.empty) {
            container.innerHTML = "<p style='color:#888; text-align:center; padding:20px;'>Encara no hi ha esdeveniments.</p>";
            return;
        }

        container.innerHTML = '';
        snap.forEach(docSnap => {
            const ev = docSnap.data();
            const tipo = ev.tipo_evento || 'trial';
            const div = document.createElement('div');
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:15px; background:var(--bg, #0d0d0d); margin-bottom:10px; border-radius:8px; border:1px solid var(--border, #2a2a2a); gap:10px;";
            div.innerHTML = `
                <div style="flex:1; min-width:0;">
                    <strong style="color:var(--orange); display:block; font-size:1.1rem; margin-bottom:4px;">${ev.title}</strong>
                    <span style="color:#aaa; font-size:0.85rem;">📅 ${ev.date} &nbsp;|&nbsp; 📍 ${ev.location} &nbsp;|&nbsp; <span style="text-transform:uppercase; color:#ccc;">${tipo}</span></span>
                </div>
                <div style="display:flex; gap:8px; flex-shrink:0;">
                    <button class="btn edit-btn" data-id="${docSnap.id}" style="background:#2563eb; color:white; padding:8px 14px; font-size:0.9rem; border-radius:6px;">✏️ Editar</button>
                    <button class="btn delete-btn" data-id="${docSnap.id}" style="background:#ff3333; color:white; padding:8px 14px; font-size:0.9rem; border-radius:6px;">Eliminar</button>
                </div>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const eventData = snap.docs.find(d => d.id === id)?.data();
                if (eventData) openEditModal(id, eventData);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteEvent);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p style='color:#ff3333;'>Error al carregar la llista.</p>";
    }
}

// ---- MODAL D'EDICIÓ ----
const editModal = document.getElementById('edit-modal');
let currentEditId = null;

function openEditModal(id, ev) {
    currentEditId = id;

    document.getElementById('edit-title').value    = ev.title    || '';
    document.getElementById('edit-date').value     = ev.date     || '';
    document.getElementById('edit-location').value = ev.location || '';
    document.getElementById('edit-price').value    = ev.price    || '';
    document.getElementById('edit-link').value     = ev.link     || '';
    document.getElementById('edit-tipo').value     = ev.tipo_evento || 'trial';

    const preview = document.getElementById('edit-img-preview');
    if (ev.imageUrl) {
        preview.src = ev.imageUrl;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    document.getElementById('edit-image').value = '';
    editModal.classList.add('show');
}

document.getElementById('edit-cancel-btn').addEventListener('click', () => {
    editModal.classList.remove('show');
    currentEditId = null;
});

editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('show');
        currentEditId = null;
    }
});

document.getElementById('edit-save-btn').addEventListener('click', async () => {
    if (!currentEditId) return;

    const saveBtn = document.getElementById('edit-save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardant...";

    try {
        const newFile = document.getElementById('edit-image').files[0];

        const updatedData = {
            title:       document.getElementById('edit-title').value,
            date:        document.getElementById('edit-date').value,
            location:    document.getElementById('edit-location').value,
            price:       document.getElementById('edit-price').value,
            link:        document.getElementById('edit-link').value,
            tipo_evento: document.getElementById('edit-tipo').value,
        };

        if (newFile) {
            updatedData.imageUrl = await toBase64(newFile);
        }

        await updateDoc(doc(db, "events", currentEditId), updatedData);

        showToast("Canvis guardats correctament!");
        editModal.classList.remove('show');
        currentEditId = null;
        loadAdminEvents();
    } catch (err) {
        console.error(err);
        showToast("Error al guardar els canvis", "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Guardar canvis";
    }
});

// ---- ELIMINAR ----
async function deleteEvent(e) {
    const eventId = e.target.getAttribute('data-id');
    const title = e.target.closest('div[style]').querySelector('strong').textContent;

    const isConfirmed = await customConfirm(`Estàs a punt d'esborrar permanentment l'esdeveniment:<br><strong style="color:white; display:block; margin-top:10px;">${title}</strong><br>Aquesta acció no es pot desfer.`);

    if (isConfirmed) {
        e.target.textContent = "Esborrant...";
        e.target.disabled = true;
        e.target.style.opacity = '0.5';

        try {
            await deleteDoc(doc(db, "events", eventId));
            showToast("Esdeveniment eliminat correctament!");
            loadAdminEvents();
        } catch (error) {
            console.error(error);
            showToast("No s'ha pogut esborrar", "error");
            e.target.textContent = "Eliminar";
            e.target.disabled = false;
            e.target.style.opacity = '1';
        }
    }
}