/* dobrostanSTUDIO* — obsługa menu mobilnego.
   Skrypt jest wspólny dla wszystkich podstron; jeśli na stronie nie ma
   hamburgera albo nakładki, po prostu nic nie robi. */
(function () {
    var burger = document.querySelector('.m-burger');
    var nav = document.getElementById('mNav');
    if (!burger || !nav) return;

    function setOpen(open) {
        nav.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open', open);
        if (window.dobrostanNavHook) window.dobrostanNavHook(open);
    }

    burger.addEventListener('click', function () {
        setOpen(!nav.classList.contains('is-open'));
    });

    // Esc zamyka nakładkę (klawiatura zewnętrzna, tablety)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });

    // powrót do desktopu przy obrocie ekranu nie może zostawić zablokowanego body
    window.addEventListener('resize', function () {
        if (window.innerWidth > 850 && nav.classList.contains('is-open')) setOpen(false);
    }, { passive: true });

    // podświetlenie bieżącej zakładki
    var here = location.pathname.split('/').pop() || 'index.html';
    var links = nav.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === here) links[i].classList.add('is-current');
    }
})();
