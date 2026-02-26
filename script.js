const dropdownItems = document.querySelectorAll(".has-dropdown");
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

const closeMobileMenu = () => {
    if (navbar) {
        navbar.classList.remove("nav-open");
    }
    if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }
};

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !navbar.classList.contains("nav-open");
        navbar.classList.toggle("nav-open", willOpen);
        menuToggle.classList.toggle("active", willOpen);
        menuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
}

if (dropdownItems.length) {
    const closeAllDropdowns = () => {
        dropdownItems.forEach((item) => {
            item.classList.remove("active");
            const toggle = item.querySelector(".nav-dropdown-toggle");
            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    };

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
        const clickedInsideDropdown = event.target.closest(".has-dropdown");
        const clickedToggle = event.target.closest(".menu-toggle");
        const clickedNavbar = event.target.closest(".navbar");

        if (!clickedInsideDropdown) {
            closeAllDropdowns();
        }

        if (!clickedToggle && !clickedNavbar) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
            closeMobileMenu();
        }
    });
}

if (navbar) {
    const directLinks = navbar.querySelectorAll("a");
    directLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });
}
