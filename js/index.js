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

menuItems.forEach((menu, index) => {
  menu.addEventListener("click", function (event) {
    event.preventDefault();
    const targetUrl = event.target.href;
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 100);
    localStorage.setItem("activeMenu", index);
  });
});

const savedIndex = localStorage.getItem("activeMenu");
if (savedIndex !== null) {
  menuItems.forEach((el) => el.removeAttribute("data-active"));
  menuItems[savedIndex].setAttribute("data-active", "true");
}
if (window.location.href.includes("index") && savedIndex !== 0) {
  menuItems.forEach((el) => el.removeAttribute("data-active"));
  menuItems[0].setAttribute("data-active", "true");
}

toggleNavigation.addEventListener("click", () => {
  const navigationOpened = toggleNavigation.getAttribute("aria-expanded");
  if (navigationOpened === "false") {
    toggleNavigation.setAttribute("aria-expanded", "true");
  } else {
    toggleNavigation.setAttribute("aria-expanded", "false");
  }
});
