# 4x4 Catalunya 🚜💨

El directori definitiu de **Trials 4x4 i competicions off-road** a Catalunya. Una plataforma moderna, ràpida i optimitzada per als amants del tot terreny.

![Banner 4x4 Catalunya](https://via.placeholder.com/1200x400/0d0d0d/E8650A?text=4x4+CATALUNYA+DIRECTORI)

## 📋 Descripció

Aquesta web és un directori centralitzat que recull tots els esdeveniments 4x4 del territori català. Ofereix una interfície neta amb un disseny "dark mode" esportiu, utilitzant Firebase com a motor de dades en temps real.

### Característiques principals:
* **Gestió Dinàmica:** Els esdeveniments es carreguen automàticament des de Firebase.
* **Panell d'Administració:** Sistema privat per afegir, editar i eliminar esdeveniments sense tocar codi.
* **Disseny Premium:** Estètica off-road utilitzant les tipografies *Barlow* i *Barlow Condensed*.
* **Optimització SEO:** Metadades configurades per a una millor indexació a Google.
* **Responsive:** Totalment adaptat a mòbils i tauletes per consultar-ho des del circuit.

---

## 🛠️ Tecnologies utilitzades

* **Frontend:** HTML5, CSS3 (Custom Variables & Grid), JavaScript (ES6 Modules).
* **Backend:** [Firebase](https://firebase.google.com/) (Firestore per a la base de dades).
* **Fonts:** Google Fonts (Barlow).
* **Icons:** Lucide Icons / Font Awesome / Custom SVGs.

---

## 📁 Estructura del Projecte

```text
├──index.html
├──evento.html
├──admin.html
├── assets/
│   ├── css/
│   │   └── styles.css      # Estils globals i parches de tipografia
│   ├── js/
│   │   ├── Main.js         # Lògica de càrrega de la graella principal
│   │   ├── admin.js        # Lògica del panell d'administració
│   │   └── event-detail.js # Generació dinàmica de fitxes d'esdeveniment
│   └── img/                # Logos i recursos visuals
├── admin.html              # Gestor d'esdeveniments
├── evento.html             # Plantilla dinàmica de detall
└── index.html              # Pàgina principal (Home)
