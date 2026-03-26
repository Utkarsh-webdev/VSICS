const dropdowns = document.querySelectorAll(".has-dropdown");

dropdowns.forEach(dropdown => {
  const button = dropdown.querySelector(".nav-link");

  button.addEventListener("click", (e) => {
    e.stopPropagation();

    // close others
    dropdowns.forEach(d => {
      if (d !== dropdown) d.classList.remove("active");
    });

    dropdown.classList.toggle("active");
  });
});

// close on outside click
document.addEventListener("click", () => {
  dropdowns.forEach(d => d.classList.remove("active"));
});