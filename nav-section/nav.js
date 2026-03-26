const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("nav-open");
});

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

document.addEventListener("click", () => {
  dropdowns.forEach(d => d.classList.remove("active"));
});