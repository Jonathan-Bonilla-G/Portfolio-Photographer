/* ==================================================
   GALLERY & LIGHTBOX COMPONENT
   ================================================== */

const gallery = document.querySelector(".gallery");

if (gallery) {

    const filters =
        gallery.querySelectorAll(".gallery__filter");

    const items =
        gallery.querySelectorAll(".gallery__item");


    /* --------------------------------------------------
       1. FILTRAR GALERÍA
       -------------------------------------------------- */

    const filterGallery = (filter) => {

        items.forEach((item) => {

            const category =
                item.dataset.category;

            const shouldShow =
                filter === "all" ||
                category === filter;

            item.hidden = !shouldShow;

        });

    };


    /* --------------------------------------------------
       2. ACTUALIZAR FILTRO ACTIVO
       -------------------------------------------------- */

    const updateActiveFilter = (activeFilter) => {

        filters.forEach((button) => {

            const isActive =
                button === activeFilter;

            button.classList.toggle(
                "gallery__filter--active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive ? "true" : "false"
            );

        });

    };


    /* --------------------------------------------------
       3. EVENTOS DE FILTROS
       -------------------------------------------------- */

    filters.forEach((button) => {

        button.addEventListener("click", () => {

            const filter =
                button.dataset.filter;

            filterGallery(filter);

            updateActiveFilter(button);

        });

    });


    /* ==================================================
       LIGHTBOX
       ================================================== */

    const lightbox =
        document.querySelector(".lightbox");

    if (lightbox) {

        const lightboxImage =
            lightbox.querySelector(".lightbox__image");

        const lightboxTitle =
            lightbox.querySelector(".lightbox__title");

        const closeButton =
            lightbox.querySelector(".lightbox__close");

        const previousButton =
            lightbox.querySelector(
                ".lightbox__control--prev"
            );

        const nextButton =
            lightbox.querySelector(
                ".lightbox__control--next"
            );

        const counter =
            lightbox.querySelector(
                ".lightbox__counter"
            );


        /* --------------------------------------------------
           4. ESTADO DEL LIGHTBOX
           -------------------------------------------------- */

        let currentIndex = 0;

        let lastFocusedElement = null;

        let touchStartX = 0;

        let touchStartY = 0;

        let touchEndX = 0;

        let touchEndY = 0;

        const swipeThreshold = 50;


        /* --------------------------------------------------
           5. OBTENER FOTOGRAFÍAS VISIBLES
           -------------------------------------------------- */

        const getVisibleItems = () => {

            return Array.from(items).filter(
                (item) => !item.hidden
            );

        };


        /* --------------------------------------------------
           6. MOSTRAR FOTOGRAFÍA
           -------------------------------------------------- */

        const showImage = (index) => {

            const visibleItems =
                getVisibleItems();

            if (!visibleItems.length) {
                return;
            }


            /* Mantener índice dentro de los límites */

            if (index < 0) {

                index =
                    visibleItems.length - 1;

            }

            if (index >= visibleItems.length) {

                index = 0;

            }


            currentIndex = index;


            const currentItem =
                visibleItems[currentIndex];


            const image =
                currentItem.querySelector(
                    ".gallery__image"
                );

            if (!image) {
                return;
            }


            /* Imagen */

            lightboxImage.src =
                image.src;

            lightboxImage.alt =
                image.alt;


            /* Título visual */

            if (lightboxTitle) {

                lightboxTitle.textContent =
                    image.dataset.title ||
                    image.alt ||
                    "Fotografía";

            }


            /* Contador */

            if (counter) {

                counter.textContent =
                    `${currentIndex + 1} / ${visibleItems.length}`;

            }

        };


        /* --------------------------------------------------
           7. FOTOGRAFÍA ANTERIOR
           -------------------------------------------------- */

        const showPrevious = () => {

            showImage(
                currentIndex - 1
            );

        };


        /* --------------------------------------------------
           8. FOTOGRAFÍA SIGUIENTE
           -------------------------------------------------- */

        const showNext = () => {

            showImage(
                currentIndex + 1
            );

        };


        /* --------------------------------------------------
           9. NAVEGACIÓN CON TECLADO
           -------------------------------------------------- */

        const handleKeyDown = (event) => {

            if (!lightbox.open) {
                return;
            }


            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPrevious();

            }


            if (event.key === "ArrowRight") {
                event.preventDefault();
                showNext();

            }

        };


        /* --------------------------------------------------
           10. ABRIR LIGHTBOX
           -------------------------------------------------- */

        const openLightbox = (item) => {

            const visibleItems =
                getVisibleItems();

            const index =
                visibleItems.indexOf(item);

            if (index === -1) {
                return;
            }


            /* Guardar elemento que abrió el Lightbox */

            lastFocusedElement =
                item.querySelector(
                    ".gallery__image-button"
                );


            /* Mostrar fotografía */

            showImage(index);


            /* Escuchar teclado */

            document.addEventListener(
                "keydown",
                handleKeyDown
            );


            /* Abrir Lightbox */

            lightbox.showModal();

            /* Enfocar boton de cierre para accesibilidad */

            closeButton?.focus();

        };


        /* --------------------------------------------------
           11. CERRAR LIGHTBOX
           -------------------------------------------------- */

        const closeLightbox = () => {

            lightbox.close();


            /* Eliminar listener de teclado */

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );


            /* Devolver foco al elemento original */

            lastFocusedElement?.focus();

        };


        /* --------------------------------------------------
           12. SWIPE EN MÓVIL
           -------------------------------------------------- */

        const handleTouchStart = (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

            touchStartY =
                event.changedTouches[0].screenY;

        };


        const handleTouchEnd = (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            touchEndY =
                event.changedTouches[0].screenY;


            const swipeDistanceX =
                touchEndX - touchStartX;

            const swipeDistanceY =
                touchEndY - touchStartY;


            /*
                Si el movimiento vertical es mayor
                al horizontal, se interpreta como
                scroll y no como swipe.
            */

            if (
                Math.abs(swipeDistanceY) >
                Math.abs(swipeDistanceX)
            ) {

                return;

            }


            /* Deslizar izquierda → siguiente */

            if (
                swipeDistanceX <=
                -swipeThreshold
            ) {

                showNext();

            }


            /* Deslizar derecha → anterior */

            if (
                swipeDistanceX >=
                swipeThreshold
            ) {

                showPrevious();

            }

        };


        /* --------------------------------------------------
           13. EVENTOS DE LAS FOTOGRAFÍAS
           -------------------------------------------------- */

        items.forEach((item) => {

            const imageButton =
                item.querySelector(
                    ".gallery__image-button"
                );

            imageButton?.addEventListener(
                "click",
                () => {

                    openLightbox(item);

                }
            );

        });


        /* --------------------------------------------------
           14. EVENTOS DE CONTROLES
           -------------------------------------------------- */

        closeButton?.addEventListener(
            "click",
            closeLightbox
        );

        previousButton?.addEventListener(
            "click",
            showPrevious
        );

        nextButton?.addEventListener(
            "click",
            showNext
        );


        /* --------------------------------------------------
           15. EVENTOS TOUCH
           -------------------------------------------------- */

        lightbox.addEventListener(
            "touchstart",
            handleTouchStart,
            {
                passive: true
            }
        );

        lightbox.addEventListener(
            "touchend",
            handleTouchEnd,
            {
                passive: true
            }
        );


        /* --------------------------------------------------
           16. CERRAR CON ESCAPE
           EVENTO NATIVO CANCEL DE DIALOG
           -------------------------------------------------- */

        lightbox.addEventListener(
            "cancel",
            (event) => {

                event.preventDefault();

                closeLightbox();

            }
        );


        /* --------------------------------------------------
           17. CERRAR AL HACER CLICK EN BACKDROP
           -------------------------------------------------- */

        lightbox.addEventListener(
            "click",
            (event) => {

                if (event.target === lightbox) {

                    closeLightbox();

                }

            }
        );

    }

}