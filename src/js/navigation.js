const toggleNavigation = document.querySelector(
  "[aria-controls='primary-navigation']",
);

const navigationMenu = document.querySelectorAll(".navigation__list li");

const menuItems = [...navigationMenu].slice(0, 3);

const resizeObserver = new ResizeObserver(() => {
  document.body.classList.add("resizing");

  requestAnimationFrame(() => {
    document.body.classList.remove("resizing");
  });
});

resizeObserver.observe(document.body);

//NOTE: Mobile navigation toggler
toggleNavigation.addEventListener("click", () => {
  console.log("clicked");
  const navigationOpened = toggleNavigation.getAttribute("aria-expanded");
  if (navigationOpened === "false") {
    toggleNavigation.setAttribute("aria-expanded", "true");
  } else {
    toggleNavigation.setAttribute("aria-expanded", "false");
  }
});
