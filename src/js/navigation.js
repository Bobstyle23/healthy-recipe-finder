const _activeMenu = new WeakMap();

class Navigation {
  constructor() {
    this.#initResizeObserver();

    this.cacheDOM();
    this.checkActiveMenu();
    this.#initMobileToggle();
  }

  set activeMenuName(menuName) {
    if (!String(menuName)) {
      throw new Error("Menu name must be a string!");
    }
    _activeMenu.set(this, menuName);
  }

  get activeMenuName() {
    return _activeMenu.get(this);
  }

  static #extractLocation(location) {
    return location.split("/").filter(Boolean).slice(-1).join("");
  }

  cacheDOM() {
    document.body.addEventListener("click", () => this.closeMobileNavigaiton());

    window.addEventListener("scroll", () => this.closeMobileNavigaiton());

    this.toggleNavigation = document.querySelector(
      "[aria-controls='primary-navigation']",
    );
    this.navigationMenu = document.querySelectorAll(".navigation__list li a");
    this.menuItems = [...this.navigationMenu].slice(0, 3);
  }

  checkActiveMenu() {
    const currentLocation = Navigation.#extractLocation(window.location.href);
    this.activeMenuName = currentLocation;

    this.menuItems.forEach((menu) => {
      menu.removeAttribute("data-active");
      if (menu.getAttribute("href").includes(this.activeMenuName)) {
        menu.setAttribute("data-active", "true");
      }
    });
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

  #initMobileToggle() {
    this.toggleNavigation.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen =
        this.toggleNavigation.getAttribute("aria-expanded") === "true";
      this.toggleNavigation.setAttribute("aria-expanded", !isOpen);
    });
  }

  closeMobileNavigaiton() {
    this.toggleNavigation.setAttribute("aria-expanded", "false");
  }
}

const navigation = new Navigation();
