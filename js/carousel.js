// Carousel simple: navegación, indicadores, autoplay y accesibilidad
(function(){
    const track = document.querySelector('.carousel-track');
    if(!track) return; // no hay carrusel en la página

    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let indicators = [];
    let current = 0;
    let autoplayInterval = null;
    const AUTOPLAY_MS = 5000;

    // Generar indicadores dinámicamente si hay contenedor
    if(indicatorsContainer){
        indicatorsContainer.innerHTML = '';
        slides.forEach((s, i)=>{
            const btn = document.createElement('button');
            btn.className = 'indicator';
            btn.setAttribute('data-slide', String(i));
            btn.setAttribute('aria-label', `Ir a la diapositiva ${i+1}`);
            btn.type = 'button';
            indicatorsContainer.appendChild(btn);
        });
        indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
    }

    function goTo(index){
        index = (index + slides.length) % slides.length;
        const offset = -index * 100;
        track.style.transform = `translateX(${offset}%)`;
        if(indicators.length){
            indicators.forEach((btn,i)=> btn.classList.toggle('active', i===index));
        }
        track.setAttribute('data-current', String(index));
        current = index;
    }

    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }

    // Evento botones
    if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); resetAutoplay(); });
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); resetAutoplay(); });

    // Indicadores (delegados si se generan)
    if(indicators.length){
        indicators.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const idx = Number(btn.getAttribute('data-slide')) || 0;
                goTo(idx);
                resetAutoplay();
            });
        });
    }

    // Autoplay
    function startAutoplay(){
        if(autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay(){ if(autoplayInterval) clearInterval(autoplayInterval); }
    function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

    // Pause on hover/focus for accessibility
    const carousel = document.querySelector('.carousel');
    if(carousel){
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
        if(e.key === 'ArrowRight') { next(); resetAutoplay(); }
    });

    // Swipe support (pointer events)
    (function addSwipe(){
        let startX = 0;
        let isDown = false;
        track.addEventListener('pointerdown', (e)=>{ isDown = true; startX = e.clientX; track.setPointerCapture(e.pointerId); });
        track.addEventListener('pointerup', (e)=>{ if(!isDown) return; isDown = false; const dx = e.clientX - startX; if(Math.abs(dx) > 40){ if(dx < 0) next(); else prev(); resetAutoplay(); } });
        track.addEventListener('pointercancel', ()=>{ isDown = false; });
    })();

    // Inicializar
    goTo(0);
    startAutoplay();
})();
