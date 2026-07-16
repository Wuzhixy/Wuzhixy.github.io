document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const desktopBreakpoint = 900;

    const setMenuState = (isOpen) => {
        if (!header || !menuToggle) return;

        header.classList.toggle("nav-open", isOpen);
        document.body.classList.toggle("nav-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    menuToggle?.addEventListener("click", () => {
        setMenuState(!header.classList.contains("nav-open"));
    });

    menu?.addEventListener("click", (event) => {
        if (event.target.closest("a") && window.innerWidth <= desktopBreakpoint) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            document.querySelectorAll(".menu-more[open]").forEach((details) => {
                details.removeAttribute("open");
            });
        }
    });

    document.addEventListener("click", (event) => {
        document.querySelectorAll(".menu-more[open]").forEach((details) => {
            if (!details.contains(event.target)) details.removeAttribute("open");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > desktopBreakpoint) setMenuState(false);
    });

    const updateHeader = () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    document.querySelectorAll(".gallery-shell").forEach((shell) => {
        const track = shell.querySelector(".gallery-track");
        const previous = shell.querySelector(".scroll-btn.left");
        const next = shell.querySelector(".scroll-btn.right");

        if (!track) return;

        const updateControls = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (previous) previous.disabled = track.scrollLeft <= 4;
            if (next) next.disabled = track.scrollLeft >= maxScroll - 4;
        };

        const scrollGallery = (direction) => {
            const amount = Math.max(track.clientWidth * 0.82, 320);
            track.scrollBy({ left: amount * direction, behavior: "smooth" });
        };

        previous?.addEventListener("click", () => scrollGallery(-1));
        next?.addEventListener("click", () => scrollGallery(1));
        track.addEventListener("scroll", updateControls, { passive: true });
        window.addEventListener("resize", updateControls);
        updateControls();
    });

    document.querySelectorAll("[data-drag-scroll]").forEach((scroller) => {
        let isDragging = false;
        let startX = 0;
        let startScroll = 0;

        scroller.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "touch" || event.button !== 0) return;
            isDragging = true;
            startX = event.clientX;
            startScroll = scroller.scrollLeft;
            scroller.classList.add("is-dragging");
            scroller.setPointerCapture(event.pointerId);
        });

        scroller.addEventListener("pointermove", (event) => {
            if (!isDragging) return;
            scroller.scrollLeft = startScroll - (event.clientX - startX);
        });

        const stopDragging = (event) => {
            if (!isDragging) return;
            isDragging = false;
            scroller.classList.remove("is-dragging");
            if (scroller.hasPointerCapture(event.pointerId)) {
                scroller.releasePointerCapture(event.pointerId);
            }
        };

        scroller.addEventListener("pointerup", stopDragging);
        scroller.addEventListener("pointercancel", stopDragging);
    });
});
