import { loadComponent } from "./utilities";

loadComponent("navigation", "../html/navigation.html").then(() => {
  const toggleNavigation = document.querySelector(
    "[aria-controls='primary-navigation']",
  );
  const navigationMenu = document.querySelectorAll(".navigation__list li");

  const menuItems = [...navigationMenu].slice(0, 3);

  menuItems.forEach((menu) => {
    menu.addEventListener("click", function () {
      const isActive = this.hasAttribute("data-active");
      if (isActive) return;

      menuItems.forEach((element) => element.removeAttribute("data-active"));
      menu.setAttribute("data-active", "true");
    });
  });

  toggleNavigation.addEventListener("click", () => {
    const navigationOpened = toggleNavigation.getAttribute("aria-expanded");
    if (navigationOpened === "false") {
      toggleNavigation.setAttribute("aria-expanded", "true");
    } else {
      toggleNavigation.setAttribute("aria-expanded", "false");
    }
  });
});

loadComponent("cta", "../html/cta.html");
// loadComponent("footer", "../html/footer.html");
