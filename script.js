const dropdownItems = document.querySelectorAll(".has-dropdown");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const noticeList = document.getElementById("noticeList");
const scrollUpBtn = document.getElementById("scrollUp");
const scrollDownBtn = document.getElementById("scrollDown");
const toggleScrollBtn = document.getElementById("toggleScroll");

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
