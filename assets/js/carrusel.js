document.addEventListener('DOMContentLoaded', () => {
    /* =================================================================
       AQUÍ AÑADES TUS FOTOS
       Solo escribe el nombre del archivo. Cuando añadas una foto a
       la carpeta 'carrusel', añade su nombre a esta lista.
       ================================================================= */
    const fotos = [
        'foto1.JPG',
        'foto2.JPG',
        'foto3.JPG',
        'foto4.JPG',
        'foto5.JPG' // <-- Añade una coma al final si pones más debajo
    ];

    const track = document.getElementById('carrusel-track');
    const dotsContainer = document.getElementById('carrusel-dots');
    const prevBtn = document.getElementById('carrusel-prev');
    const nextBtn = document.getElementById('carrusel-next');

    let currentIndex = 0;

    // Generar el HTML de las imágenes y los botones de abajo dinámicamente
    fotos.forEach((foto, index) => {
        // Crear la diapositiva
        const slide = document.createElement('div');
        slide.classList.add('carrusel-slide');
        
        const img = document.createElement('img');
        img.src = `../assets/img/carrusel/${foto}`;
        img.alt = `Imatge comunitat 4x4 ${index + 1}`;
        // Para evitar que imágenes que falten rompan el diseño
        img.onerror = () => { img.style.display = 'none'; }; 
        
        slide.appendChild(img);
        track.appendChild(slide);

        // Crear el punto de navegación (dot)
        const dot = document.createElement('div');
        dot.classList.add('carrusel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.carrusel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % fotos.length;
        updateCarousel();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
        updateCarousel();
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateCarousel();
    };

    // Eventos de los botones
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Opcional: Carrusel automático cada 4 segundos
    setInterval(nextSlide, 4000);
});
