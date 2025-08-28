class Navigation {
  constructor() {
    this.toggleNavigation = document.querySelector(
      "[aria-controls='primary-navigation']",
    );
    this.navigationMenu = document.querySelectorAll(".navigation__list li");
    this.menuItems = [...this.navigationMenu].slice(0, 3);

    this.#initResizeObserver();
    this.#initMenuState();
    this.#initMobileToggle();
  }

  static #extractLocation(location) {
    return location.split("/").filter(Boolean).splice(2, 1).join("");
  }

  #initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      document.body.classList.add("resizing");
      requestAnimationFrame(() => {
        document.body.classList.remove("resizing");
      });
    });
    this.resizeObserver.observe(document.body);
  }

  #initMenuState() {
    const currentLocation = Navigation.#extractLocation(window.location.href);

    if (currentLocation === "index.html") {
      localStorage.setItem("activeMenuIdx", 0);
    } else if (currentLocation === "recipes.html") {
      localStorage.setItem("activeMenuIdx", 2);
    }

    this.menuItems.forEach((menu, index) => {
      menu.addEventListener("click", () => {
        localStorage.setItem("activeMenuIdx", index);
      });
    });

    const savedIndex = localStorage.getItem("activeMenuIdx");
    if (savedIndex !== null) {
      this.menuItems.forEach((menu) => menu.removeAttribute("data-active"));
      this.menuItems[savedIndex].setAttribute("data-active", "true");
    }
  }

  #initMobileToggle() {
    this.toggleNavigation.addEventListener("click", () => {
      const isOpen =
        this.toggleNavigation.getAttribute("aria-expanded") === "true";
      this.toggleNavigation.setAttribute("aria-expanded", !isOpen);
    });
  }
}

const navigation = new Navigation();

console.log(navigation);
