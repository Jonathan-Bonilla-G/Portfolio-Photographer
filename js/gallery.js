/* ==================================================
   GALLERY
   ================================================== */


/* --------------------------------------------------
   1. ELEMENTOS DE GALLERY
   -------------------------------------------------- */

const gallery = document.querySelector(".gallery");

if (gallery) {

    const filters = gallery.querySelectorAll(".gallery__filter");
    const items = gallery.querySelectorAll(".gallery__item");


    /* --------------------------------------------------
       2. FILTRAR GALERÍA
       -------------------------------------------------- */

    const filterGallery = (filter) => {

        items.forEach((item) => {

            const category = item.dataset.category;

            const shouldShow =
                filter === "all" ||
                category === filter;

            item.hidden = !shouldShow;

        });

    };


    /* --------------------------------------------------
       3. ACTUALIZAR FILTRO ACTIVO
       -------------------------------------------------- */

    const updateActiveFilter = (activeFilter) => {

        filters.forEach((button) => {

            const isActive = button === activeFilter;

            button.classList.toggle(
                "gallery__filter--active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive
            );

        });

    };


    /* --------------------------------------------------
       4. EVENTOS DE FILTROS
       -------------------------------------------------- */

    filters.forEach((button) => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            filterGallery(filter);
            updateActiveFilter(button);

        });

    });


    /* ==================================================
       LIGHTBOX
       ================================================== */


    /* --------------------------------------------------
       5. ELEMENTOS DEL LIGHTBOX
       -------------------------------------------------- */

    const lightbox = document.querySelector(".lightbox");

    if (lightbox) {

        const lightboxImage =
            lightbox.querySelector(".lightbox__image");

        const closeButton =
            lightbox.querySelector(".lightbox__close");

        const previousButton =
            lightbox.querySelector(".lightbox__control--prev");

        const nextButton =
            lightbox.querySelector(".lightbox__control--next");

        const counter =
            lightbox.querySelector(".lightbox__counter");


        /* --------------------------------------------------
           6. ESTADO DEL LIGHTBOX
           -------------------------------------------------- */

        let currentIndex = 0;


        /* --------------------------------------------------
           7. OBTENER FOTOGRAFÍAS VISIBLES
           -------------------------------------------------- */

        const getVisibleItems = () => {

            return Array.from(items).filter(
                (item) => !item.hidden
            );

        };


        /* --------------------------------------------------
           8. MOSTRAR FOTOGRAFÍA
           -------------------------------------------------- */

        const showImage = (index) => {

            const visibleItems = getVisibleItems();

            if (!visibleItems.length) {
                return;
            }

            /*
                Mantener el índice dentro
                de los límites de la galería.
            */

            if (index < 0) {
                index = visibleItems.length - 1;
            }

            if (index >= visibleItems.length) {
                index = 0;
            }

            currentIndex = index;

            const currentItem =
                visibleItems[currentIndex];

            const image =
                currentItem.querySelector(".gallery__image");

            if (!image) {
                return;
            }

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            counter.textContent =
                `${currentIndex + 1} / ${visibleItems.length}`;

        };


        /* --------------------------------------------------
           9. ABRIR LIGHTBOX
           -------------------------------------------------- */

        const openLightbox = (item) => {

            const visibleItems = getVisibleItems();

            const index =
                visibleItems.indexOf(item);

            if (index === -1) {
                return;
            }

            showImage(index);

            lightbox.showModal();

        };


        /* --------------------------------------------------
           10. CERRAR LIGHTBOX
           -------------------------------------------------- */

        const closeLightbox = () => {

            lightbox.close();

        };


        /* --------------------------------------------------
           11. FOTOGRAFÍA ANTERIOR
           -------------------------------------------------- */

        const showPrevious = () => {

            showImage(currentIndex - 1);

        };


        /* --------------------------------------------------
           12. FOTOGRAFÍA SIGUIENTE
           -------------------------------------------------- */

        const showNext = () => {

            showImage(currentIndex + 1);

        };


        /* --------------------------------------------------
           13. EVENTOS DE LAS FOTOGRAFÍAS
           -------------------------------------------------- */

        items.forEach((item) => {

            const imageButton =
                item.querySelector(".gallery__image-button");

            if (!imageButton) {
                return;
            }

            imageButton.addEventListener("click", () => {

                openLightbox(item);

            });

        });


        /* --------------------------------------------------
           14. EVENTOS DE CONTROLES
           -------------------------------------------------- */

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

        previousButton.addEventListener(
            "click",
            showPrevious
        );

        nextButton.addEventListener(
            "click",
            showNext
        );


        /* --------------------------------------------------
           15. CERRAR CON ESCAPE
           -------------------------------------------------- */

        lightbox.addEventListener("cancel", (event) => {

            event.preventDefault();

            closeLightbox();

        });


        /* --------------------------------------------------
           16. CERRAR AL HACER CLICK EN BACKDROP
           -------------------------------------------------- */

        lightbox.addEventListener("click", (event) => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });


        /* --------------------------------------------------
           17. NAVEGACIÓN CON TECLADO
           -------------------------------------------------- */

        document.addEventListener("keydown", (event) => {

            if (!lightbox.open) {
                return;
            }

            switch (event.key) {

                case "ArrowLeft":
                    showPrevious();
                    break;

                case "ArrowRight":
                    showNext();
                    break;

                case "Escape":
                    closeLightbox();
                    break;

            }

        });

    }

}