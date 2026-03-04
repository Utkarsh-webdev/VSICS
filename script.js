const dropdownItems = document.querySelectorAll(".has-dropdown");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const noticeList = document.getElementById("noticeList");
const scrollUpBtn = document.getElementById("scrollUp");
const scrollDownBtn = document.getElementById("scrollDown");
const toggleScrollBtn = document.getElementById("toggleScroll");
const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryDots = document.getElementById("galleryDots");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
const testimonialDots = document.getElementById("testimonialDots");

const closeMobileMenu = () => {
    if (mainNav) {
        mainNav.classList.remove("nav-open");
    }
    if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }
};

const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => {
        item.classList.remove("active");
        const toggle = item.querySelector(".nav-dropdown-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    });
};

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !mainNav.classList.contains("nav-open");
        mainNav.classList.toggle("nav-open", willOpen);
        menuToggle.classList.toggle("active", willOpen);
        menuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
}

dropdownItems.forEach((item) => {
    const toggle = item.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !item.classList.contains("active");
        closeAllDropdowns();
        if (willOpen) {
            item.classList.add("active");
            toggle.setAttribute("aria-expanded", "true");
        }
    });
});

document.addEventListener("click", (event) => {
    const insideDropdown = event.target.closest(".has-dropdown");
    const insideMenuToggle = event.target.closest(".menu-toggle");
    const insideNav = event.target.closest(".main-nav");

    if (!insideDropdown) {
        closeAllDropdowns();
    }

    if (!insideMenuToggle && !insideNav) {
        closeMobileMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAllDropdowns();
        closeMobileMenu();
    }
});

if (mainNav) {
    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

if (noticeList) {
    let autoScrollTimer = null;
    let isPaused = false;
    const step = 38;

    const smoothScroll = (distance) => {
        noticeList.scrollBy({ top: distance, behavior: "smooth" });
    };

    const startAutoScroll = () => {
        autoScrollTimer = setInterval(() => {
            if (isPaused) return;
            const atEnd =
                noticeList.scrollTop + noticeList.clientHeight >= noticeList.scrollHeight - 2;
            if (atEnd) {
                noticeList.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            smoothScroll(step);
        }, 1900);
    };

    const stopAutoScroll = () => {
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
    };

    if (scrollUpBtn) {
        scrollUpBtn.addEventListener("click", () => smoothScroll(-step));
    }
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener("click", () => smoothScroll(step));
    }
    if (toggleScrollBtn) {
        toggleScrollBtn.addEventListener("click", () => {
            isPaused = !isPaused;
            toggleScrollBtn.innerHTML = isPaused
                ? '<i class="bi bi-play-fill"></i>'
                : '<i class="bi bi-pause-fill"></i>';
        });
    }

    noticeList.addEventListener("mouseenter", () => {
        isPaused = true;
        if (toggleScrollBtn) {
            toggleScrollBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        }
    });

    noticeList.addEventListener("mouseleave", () => {
        isPaused = false;
        if (toggleScrollBtn) {
            toggleScrollBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        }
    });

    startAutoScroll();
    window.addEventListener("beforeunload", stopAutoScroll);
}

if (galleryTrack) {
    const slides = Array.from(galleryTrack.querySelectorAll("img"));
    const getVisibleCount = () => {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };

    let visibleCount = getVisibleCount();
    let maxIndex = Math.max(0, slides.length - visibleCount);
    let currentIndex = 0;
    let sliderTimer = null;

    const buildDots = () => {
        if (!galleryDots) return;
        galleryDots.innerHTML = "";
        for (let i = 0; i <= maxIndex; i += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            if (i === currentIndex) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
                restartAutoSlide();
            });
            galleryDots.appendChild(dot);
        }
    };

    const updateSlider = () => {
        galleryTrack.style.setProperty("--slides-per-view", String(visibleCount));
        const translatePercent = (currentIndex * 100) / visibleCount;
        galleryTrack.style.transform = `translateX(-${translatePercent}%)`;
        if (galleryDots) {
            Array.from(galleryDots.children).forEach((dot, i) => {
                dot.classList.toggle("active", i === currentIndex);
            });
        }
    };

    const goNext = () => {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    };

    const goPrev = () => {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        sliderTimer = setInterval(goNext, 3000);
    };

    const stopAutoSlide = () => {
        if (sliderTimer) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    };

    const restartAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    if (galleryNext) {
        galleryNext.addEventListener("click", () => {
            goNext();
            restartAutoSlide();
        });
    }
    if (galleryPrev) {
        galleryPrev.addEventListener("click", () => {
            goPrev();
            restartAutoSlide();
        });
    }

    galleryTrack.addEventListener("mouseenter", stopAutoSlide);
    galleryTrack.addEventListener("mouseleave", startAutoSlide);

    const onResize = () => {
        const nextVisible = getVisibleCount();
        if (nextVisible !== visibleCount) {
            visibleCount = nextVisible;
            maxIndex = Math.max(0, slides.length - visibleCount);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            buildDots();
        }
        updateSlider();
    };

    buildDots();
    updateSlider();
    startAutoSlide();

    window.addEventListener("resize", onResize);
    window.addEventListener("beforeunload", stopAutoSlide);
}

if (testimonialTrack) {
    const cards = Array.from(testimonialTrack.querySelectorAll(".testimonial-card"));
    const getVisibleCards = () => (window.innerWidth <= 700 ? 1 : 2);

    let visibleCards = getVisibleCards();
    let maxIndex = Math.max(0, cards.length - visibleCards);
    let currentIndex = 0;
    let testimonialTimer = null;

    const renderDots = () => {
        if (!testimonialDots) return;
        testimonialDots.innerHTML = "";
        for (let i = 0; i <= maxIndex; i += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
            dot.classList.toggle("active", i === currentIndex);
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateTestimonials();
                restartTestimonials();
            });
            testimonialDots.appendChild(dot);
        }
    };

    const updateTestimonials = () => {
        const viewportWidth = testimonialTrack.parentElement
            ? testimonialTrack.parentElement.clientWidth
            : 0;
        const cardWidth = viewportWidth / visibleCards;
        testimonialTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        if (testimonialDots) {
            Array.from(testimonialDots.children).forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }
    };

    const nextTestimonial = () => {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateTestimonials();
    };

    const prevTestimonial = () => {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateTestimonials();
    };

    const startTestimonials = () => {
        stopTestimonials();
        testimonialTimer = setInterval(nextTestimonial, 3600);
    };

    const stopTestimonials = () => {
        if (testimonialTimer) {
            clearInterval(testimonialTimer);
            testimonialTimer = null;
        }
    };

    const restartTestimonials = () => {
        stopTestimonials();
        startTestimonials();
    };

    if (testimonialNext) {
        testimonialNext.addEventListener("click", () => {
            nextTestimonial();
            restartTestimonials();
        });
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener("click", () => {
            prevTestimonial();
            restartTestimonials();
        });
    }

    testimonialTrack.addEventListener("mouseenter", stopTestimonials);
    testimonialTrack.addEventListener("mouseleave", startTestimonials);

    const onTestimonialResize = () => {
        const nextVisible = getVisibleCards();
        if (nextVisible !== visibleCards) {
            visibleCards = nextVisible;
            maxIndex = Math.max(0, cards.length - visibleCards);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            renderDots();
        }
        updateTestimonials();
    };

    renderDots();
    updateTestimonials();
    startTestimonials();
    window.addEventListener("resize", onTestimonialResize);
    window.addEventListener("beforeunload", stopTestimonials);
}
