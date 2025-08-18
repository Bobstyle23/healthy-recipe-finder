import { loadComponent } from "./utilities";

loadComponent("navigation", "../html/navigation.html").then(() => {
  const toggleNavigation = document.querySelector(
    "[aria-controls='primary-navigation']",
  );

  toggleNavigation.addEventListener("click", () => {
    const navigationOpened = toggleNavigation.getAttribute("aria-expanded");
    if (navigationOpened === "false") {
      toggleNavigation.setAttribute("aria-expanded", "true");
    } else {
      toggleNavigation.setAttribute("aria-expanded", "false");
    }
  });
});

// loadComponent("footer", "../html/footer.html");
