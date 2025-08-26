const toggleNavigation = document.querySelector(
  "[aria-controls='primary-navigation']",
);

const navigationMenu = document.querySelectorAll(".navigation__list li");

const menuItems = [...navigationMenu].slice(0, 3);

function extractLocation(location) {
  return location.split("/").filter(Boolean).splice(2, 1).join("");
}

const currentLocation = extractLocation(window.location.href);

if (currentLocation === "index.html") {
  localStorage.setItem("activeMenuIdx", 0);
} else if (currentLocation === "recipes.html") {
  localStorage.setItem("activeMenuIdx", 2);
}

menuItems.forEach((menu, index) => {
  menu.addEventListener("click", () => {
    localStorage.setItem("activeMenuIdx", index);
  });
});

const savedIndex = localStorage.getItem("activeMenuIdx");

if (savedIndex !== null) {
  menuItems.forEach((menu) => menu.removeAttribute("data-active"));
  menuItems[savedIndex].setAttribute("data-active", "true");
}

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
