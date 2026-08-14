/**
 * NAVBAR CONTROLLER
 *
 * Controla:
 * - Menú móvil
 * - Accesibilidad ARIA
 * - Bloqueo de scroll
 * - Overlay
 * - Cierre con Escape
 * - Cambio entre móvil y desktop
 * - Estado visual del header al hacer scroll
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS DOM
    // --------------------------------------------------

    const navbar = document.getElementById('navbar');
    const toggleBtn = document.querySelector('.navbar__toggle');
    const overlay = document.querySelector('.navbar__overlay');
    const navLinks = document.querySelectorAll(
        '.navbar__link, .navbar__btn'
    );
    const header = document.querySelector('.header');


    // --------------------------------------------------
    // 2. GUARDIA DE SEGURIDAD
    // --------------------------------------------------

    if (!navbar || !toggleBtn || !overlay) return;


    // --------------------------------------------------
    // 3. MEDIA QUERY — DESKTOP
    // --------------------------------------------------

    const desktopMediaQuery = window.matchMedia(
        '(min-width: 992px)'
    );


    // --------------------------------------------------
    // 4. CONTROL DEL ESTADO DEL MENÚ
    // --------------------------------------------------

    const setMenuState = (forceState) => {

        const isOpen =
            typeof forceState === 'boolean'
                ? forceState
                : !navbar.classList.contains('is-open');


        // Estado visual
        navbar.classList.toggle('is-open', isOpen);


        // Accesibilidad
        toggleBtn.setAttribute(
            'aria-expanded',
            String(isOpen)
        );

        toggleBtn.setAttribute(
            'aria-label',
            isOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
        );


        // Bloquear / liberar scroll
        document.body.style.overflow =
            isOpen ? 'hidden' : '';
    };


    // --------------------------------------------------
    // 5. HEADER — ESTADO AL HACER SCROLL
    // --------------------------------------------------

    const handleScroll = () => {

        if (!header) return;

        header.classList.toggle(
            'header--scrolled',
            window.scrollY > 20
        );
    };


    // --------------------------------------------------
    // 6. BOTÓN HAMBURGUESA
    // --------------------------------------------------

    toggleBtn.addEventListener(
        'click',
        () => setMenuState()
    );


    // --------------------------------------------------
    // 7. OVERLAY
    // --------------------------------------------------

    overlay.addEventListener(
        'click',
        () => setMenuState(false)
    );


    // --------------------------------------------------
    // 8. ENLACES DEL MENÚ
    // --------------------------------------------------

    navLinks.forEach(link => {

        link.addEventListener(
            'click',
            () => setMenuState(false)
        );

    });


    // --------------------------------------------------
    // 9. TECLA ESCAPE
    // --------------------------------------------------

    document.addEventListener('keydown', event => {

        if (
            event.key === 'Escape' &&
            navbar.classList.contains('is-open')
        ) {
            setMenuState(false);
        }

    });


    // --------------------------------------------------
    // 10. CAMBIO A DESKTOP
    // --------------------------------------------------

    desktopMediaQuery.addEventListener(
        'change',
        event => {

            if (event.matches) {
                setMenuState(false);
            }

        }
    );


    // --------------------------------------------------
    // 11. HEADER AL HACER SCROLL
    // --------------------------------------------------

    window.addEventListener(
        'scroll',
        handleScroll,
        { passive: true }
    );


    // --------------------------------------------------
    // 12. ESTADO INICIAL
    // --------------------------------------------------

    handleScroll();

});
