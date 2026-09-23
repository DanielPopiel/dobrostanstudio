/* dobrostanSTUDIO* — zgoda na cookies (Google Consent Mode v2).
   Domyślnie wszystko, co reklamowe, jest wyłączone (ustawiane w <head>).
   Ten skrypt pokazuje baner, zapamiętuje wybór na 12 miesięcy
   i pozwala go zmienić linkiem „Cookies” (menu, stopka, polityka). */
(function () {
    var KEY = 'dobrostan_consent';
    var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

    function read() {
        try {
            var c = JSON.parse(localStorage.getItem(KEY));
            if (c && c.v === 1 && Date.now() - c.t < MAX_AGE) return c;
        } catch (e) {}
        return null;
    }
    function save(granted) {
        try { localStorage.setItem(KEY, JSON.stringify({ v: 1, ads: granted ? 'granted' : 'denied', t: Date.now() })); } catch (e) {}
        if (typeof window.gtag === 'function') {
            var s = granted ? 'granted' : 'denied';
            window.gtag('consent', 'update', { ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: s });
        }
    }

    var css = ''
      + '.cc-banner{position:fixed;left:24px;bottom:24px;z-index:9999;max-width:380px;'
      + 'background:#F4F4F2;color:#1A1A1A;border:1px solid rgba(26,26,26,.18);'
      + 'box-shadow:0 12px 40px rgba(26,26,26,.10);padding:20px 22px 18px;'
      + 'font-family:"IBM Plex Mono",monospace;font-size:.72rem;line-height:1.65;'
      + 'opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s ease}'
      + '.cc-banner.is-in{opacity:1;transform:none}'
      + '.cc-banner .cc-title{font-family:"Inter",sans-serif;font-weight:700;font-size:.68rem;'
      + 'letter-spacing:.2em;text-transform:uppercase;color:#50344f;margin:0 0 8px}'
      + '.cc-banner .cc-title span{font-family:"Playfair Display",serif;font-style:italic;font-weight:400;'
      + 'letter-spacing:0;text-transform:none;color:#b9a646;font-size:1.15em;margin-right:.15em}'
      + '.cc-banner p{margin:0 0 14px}'
      + '.cc-banner a{color:#50344f;text-decoration:none;border-bottom:1px solid #b9a646}'
      + '.cc-actions{display:flex;gap:8px}'
      + '.cc-actions button{flex:1;cursor:pointer;font-family:"Inter",sans-serif;font-weight:700;'
      + 'font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;padding:11px 10px;'
      + 'border:1px solid #50344f;transition:background .25s,color .25s}'
      + '.cc-accept{background:#50344f;color:#fff}'
      + '.cc-accept:hover{background:#3d273c}'
      + '.cc-reject{background:transparent;color:#50344f}'
      + '.cc-reject:hover{background:rgba(80,52,79,.07)}'
      + '.cc-actions button:focus-visible{outline:2px solid #b9a646;outline-offset:2px}'
      + '.cc-link{background:none;border:0;padding:0;cursor:pointer;font:inherit;color:inherit;'
      + 'text-transform:inherit;letter-spacing:inherit;border-bottom:1px solid currentColor;opacity:.8}'
      + '.cc-link:hover{opacity:1}'
      + '.cc-aside{margin-top:auto;padding-top:1.5rem;font-size:.65rem;text-transform:uppercase;color:#666}'
      + '@media (max-width:850px){.cc-banner{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));'
      + 'max-width:none;padding:16px 16px 14px}.cc-aside{display:none}}'
      + '@media (prefers-reduced-motion:reduce){.cc-banner{transition:none}}';

    var banner;
    function show() {
        if (banner) return;
        if (!document.getElementById('cc-style')) {
            var st = document.createElement('style'); st.id = 'cc-style'; st.textContent = css;
            document.head.appendChild(st);
        }
        banner = document.createElement('div');
        banner.className = 'cc-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Zgoda na pliki cookies');
        banner.innerHTML =
            '<div class="cc-title"><span>dobrostan</span>cookies*</div>'
          + '<p>Używam plików cookies Google, żeby mierzyć skuteczność reklam. '
          + 'Włączę je tylko za Twoją zgodą — możesz ją w każdej chwili zmienić. '
          + '<a href="polityka-prywatnosci.html">Polityka prywatności</a></p>'
          + '<div class="cc-actions">'
          + '<button type="button" class="cc-reject">Odrzuć</button>'
          + '<button type="button" class="cc-accept">Akceptuję</button>'
          + '</div>';
        document.body.appendChild(banner);
        banner.querySelector('.cc-accept').addEventListener('click', function () { decide(true); });
        banner.querySelector('.cc-reject').addEventListener('click', function () { decide(false); });
        requestAnimationFrame(function () { requestAnimationFrame(function () { banner.classList.add('is-in'); }); });
    }
    function decide(granted) {
        save(granted);
        if (!banner) return;
        var b = banner; banner = null;
        b.classList.remove('is-in');
        setTimeout(function () { b.remove(); }, 450);
    }
    window.dobrostanCookieSettings = show;

    function settingsLink() {
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cc-link'; btn.textContent = 'Cookies';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var nav = document.getElementById('mNav');
            if (nav && nav.classList.contains('is-open')) {
                var burger = document.querySelector('.m-burger'); if (burger) burger.click();
            }
            show();
        });
        return btn;
    }
    function addLinks() {
        if (!document.getElementById('cc-style')) {
            var st = document.createElement('style'); st.id = 'cc-style'; st.textContent = css;
            document.head.appendChild(st);
        }
        var sep = function () { return document.createTextNode(' · '); };
        var policy = function () { var a = document.createElement('a'); a.href = 'polityka-prywatnosci.html'; a.textContent = 'Prywatność'; a.className = 'cc-link'; return a; };
        // stopka w lewej kolumnie (desktop)
        var tf = document.querySelector('aside .tech-footer, .left-column .tech-footer');
        var aside = document.querySelector('aside.left-column');
        if (tf) {
            tf.appendChild(document.createElement('br'));
            tf.appendChild(policy()); tf.appendChild(sep()); tf.appendChild(settingsLink());
        } else if (aside) {
            var d = document.createElement('div'); d.className = 'cc-aside';
            d.appendChild(policy()); d.appendChild(sep()); d.appendChild(settingsLink());
            aside.appendChild(d);
        }
        // menu mobilne
        var mf = document.querySelector('#mNav .m-nav-foot');
        if (mf) {
            mf.appendChild(document.createElement('br'));
            var p = policy(); p.className = ''; mf.appendChild(p);
            mf.appendChild(sep());
            var s = settingsLink(); s.style.cssText = 'color:var(--color-accent);border-bottom:1px solid var(--color-gold);opacity:1;font-size:.74rem';
            mf.appendChild(s);
        }
        // przyciski na stronie polityki
        var hooks = document.querySelectorAll('[data-cookie-settings]');
        for (var i = 0; i < hooks.length; i++) hooks[i].addEventListener('click', function (e) { e.preventDefault(); show(); });
    }

    function init() {
        addLinks();
        if (!read()) show();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

/* Konwersja Google Ads „Kontakt”: kliknięcie w numer telefonu lub adres e-mail
   (na stronie nie ma formularza, więc to jest właściwy moment kontaktu). */
(function () {
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
        if (!a || typeof window.gtag !== 'function') return;
        window.gtag('event', 'ads_conversion_Kontakt_1', {
            method: a.getAttribute('href').indexOf('tel:') === 0 ? 'telefon' : 'email'
        });
    }, true);
})();
