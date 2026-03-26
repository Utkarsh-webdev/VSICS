const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");   // 🔥 animation
  nav.classList.toggle("nav-open");
});

// dropdowns
const dropdowns = document.querySelectorAll(".has-dropdown");

dropdowns.forEach(dropdown => {
  const btn = dropdown.querySelector(".nav-link");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    dropdowns.forEach(d => {
      if (d !== dropdown) d.classList.remove("active");
    });

    dropdown.classList.toggle("active");
  });
});

// close all
document.addEventListener("click", () => {
  dropdowns.forEach(d => d.classList.remove("active"));
});