/**
 * NAVBAR CONTROLLER
 *
 * Controla:
 * - Menú móvil
 * - Accesibilidad ARIA
 * - Gestión del foco
 * - Bloqueo de scroll
 * - Overlay
 * - Cierre con Escape
 * - Focus trap
 * - Cambio entre móvil y desktop
 * - Estado visual del header al hacer scroll
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS DOM
    // --------------------------------------------------

    const navbar = document.getElementById('navbar');
    const menu = document.getElementById('navbar-menu');
    const toggleBtn = document.querySelector('.navbar__toggle');
    const overlay = document.querySelector('.navbar__overlay');
    const navLinks = document.querySelectorAll(
        '.navbar__link, .navbar__btn'
    );
    const header = document.querySelector('.header');


    // --------------------------------------------------
    // 2. GUARDIA DE SEGURIDAD
    // --------------------------------------------------

    if (!navbar || !menu || !toggleBtn || !overlay) return;


    // --------------------------------------------------
    // 3. MEDIA QUERY — DESKTOP
    // --------------------------------------------------

    const desktopMediaQuery = window.matchMedia(
        '(min-width: 992px)'
    );


    // --------------------------------------------------
    // 4. ELEMENTOS FOCUSABLES DEL MENÚ
    // --------------------------------------------------

    const getFocusableElements = () => {

        return menu.querySelectorAll(
            'a[href], button:not([disabled]), ' +
            'input:not([disabled]), ' +
            'select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        );

    };


    // --------------------------------------------------
    // 5. CONTROL DEL ESTADO DEL MENÚ
    // --------------------------------------------------

    const setMenuState = (forceState) => {

        const isOpen =
            typeof forceState === 'boolean'
                ? forceState
                : !navbar.classList.contains('is-open');


        // Estado visual
        navbar.classList.toggle(
            'is-open',
            isOpen
        );


        // Accesibilidad del botón
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


        // Estado de accesibilidad del menú
        // Solo se aplica ocultamiento en móvil.
        if (desktopMediaQuery.matches) {

            menu.setAttribute(
                'aria-hidden',
                'false'
            );

            menu.inert = false;

        } else {

            menu.setAttribute(
                'aria-hidden',
                String(!isOpen)
            );

            menu.inert = !isOpen;
        }


        // Bloquear / liberar scroll
        document.body.style.overflow =
            isOpen ? 'hidden' : '';


        // Gestión del foco
        if (isOpen) {

            const focusableElements =
                getFocusableElements();

            if (focusableElements.length) {

                requestAnimationFrame(() => {
                    focusableElements[0].focus();
                });

            }

        } else if (!desktopMediaQuery.matches) {

            requestAnimationFrame(() => {
                toggleBtn.focus();
            });

        }

    };


    // --------------------------------------------------
    // 6. HEADER — ESTADO AL HACER SCROLL
    // --------------------------------------------------

    const handleScroll = () => {

        if (!header) return;

        header.classList.toggle(
            'header--scrolled',
            window.scrollY > 20
        );

    };


    // --------------------------------------------------
    // 7. BOTÓN HAMBURGUESA
    // --------------------------------------------------

    toggleBtn.addEventListener(
        'click',
        () => setMenuState()
    );


    // --------------------------------------------------
    // 8. OVERLAY
    // --------------------------------------------------

    overlay.addEventListener(
        'click',
        () => setMenuState(false)
    );


    // --------------------------------------------------
    // 9. ENLACES DEL MENÚ
    // --------------------------------------------------

    navLinks.forEach(link => {

        link.addEventListener(
            'click',
            () => setMenuState(false)
        );

    });


    // --------------------------------------------------
    // 10. TECLADO — ACCESIBILIDAD Y FOCUS TRAP
    // --------------------------------------------------

    document.addEventListener('keydown', event => {

        // ESCAPE
        if (
            event.key === 'Escape' &&
            navbar.classList.contains('is-open')
        ) {

            event.preventDefault();

            setMenuState(false);

            return;
        }


        // FOCUS TRAP
        if (
            event.key !== 'Tab' ||
            !navbar.classList.contains('is-open')
        ) {
            return;
        }


        const menuFocusables =
            Array.from(getFocusableElements());


        // El botón de cierre forma parte
        // del ciclo de navegación por teclado
        const focusableElements = [
            ...menuFocusables,
            toggleBtn
        ];


        if (!focusableElements.length) return;


        const firstFocusable =
            focusableElements[0];

        const lastFocusable =
            focusableElements[
                focusableElements.length - 1
            ];


        // TAB en el último elemento → primero
        if (
            !event.shiftKey &&
            document.activeElement === lastFocusable
        ) {

            event.preventDefault();

            firstFocusable.focus();

            return;
        }


        // SHIFT + TAB en el primero → último
        if (
            event.shiftKey &&
            document.activeElement === firstFocusable
        ) {

            event.preventDefault();

            lastFocusable.focus();

        }

    });


    // --------------------------------------------------
    // 11. CAMBIO ENTRE MÓVIL Y DESKTOP
    // --------------------------------------------------

    desktopMediaQuery.addEventListener(
        'change',
        event => {

            if (event.matches) {

                // Cerrar estado móvil
                navbar.classList.remove('is-open');


                // Restaurar estado del botón
                toggleBtn.setAttribute(
                    'aria-expanded',
                    'false'
                );

                toggleBtn.setAttribute(
                    'aria-label',
                    'Abrir menú de navegación'
                );


                // Restaurar accesibilidad del menú
                menu.setAttribute(
                    'aria-hidden',
                    'false'
                );

                menu.inert = false;


                // Restaurar scroll
                document.body.style.overflow = '';

            }

        }
    );


    // --------------------------------------------------
    // 12. HEADER AL HACER SCROLL
    // --------------------------------------------------

    window.addEventListener(
        'scroll',
        handleScroll,
        { passive: true }
    );


    // --------------------------------------------------
    // 13. ESTADO INICIAL
    // --------------------------------------------------

    toggleBtn.setAttribute(
        'aria-expanded',
        'false'
    );

    toggleBtn.setAttribute(
        'aria-label',
        'Abrir menú de navegación'
    );


    if (desktopMediaQuery.matches) {

        menu.setAttribute(
            'aria-hidden',
            'false'
        );

        menu.inert = false;

    } else {

        menu.setAttribute(
            'aria-hidden',
            'true'
        );

        menu.inert = true;

    }


    // Estado inicial del header
    handleScroll();

});