import data from "../data.json" with { type: "json" };

const recipesSelectOptions = document.querySelectorAll(".recipes__select");
const toggleNavigation = document.querySelector(
  "[aria-controls='primary-navigation']",
);
const navigationMenu = document.querySelectorAll(".navigation__list li");
const recipesContainer = document.querySelector(".recipes__container");

const menuItems = [...navigationMenu].slice(0, 3);

// NOTE: Resize observer to add resizing class to body
const resizeObserver = new ResizeObserver(() => {
  document.body.classList.add("resizing");

  requestAnimationFrame(() => {
    document.body.classList.remove("resizing");
  });
});

resizeObserver.observe(document.body);

// NOTE: Page navigating
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

//NOTE: Active menu highlighting
const savedIndex = localStorage.getItem("activeMenu");
if (savedIndex !== null) {
  menuItems.forEach((el) => el.removeAttribute("data-active"));
  menuItems[savedIndex].setAttribute("data-active", "true");
}
if (window.location.href.includes("index") && savedIndex !== 0) {
  menuItems.forEach((el) => el.removeAttribute("data-active"));
  menuItems[0].setAttribute("data-active", "true");
}

//NOTE: Mobile navigation toggler
toggleNavigation.addEventListener("click", () => {
  const navigationOpened = toggleNavigation.getAttribute("aria-expanded");
  if (navigationOpened === "false") {
    toggleNavigation.setAttribute("aria-expanded", "true");
  } else {
    toggleNavigation.setAttribute("aria-expanded", "false");
  }
});

//NOTE: Recipes cook & prep time options
[...recipesSelectOptions].forEach((select) => {
  select.addEventListener("click", (e) => {
    const selectOpened = select.getAttribute("aria-expanded");
    if (selectOpened === "false") {
      select.setAttribute("aria-expanded", "true");
    } else {
      select.setAttribute("aria-expanded", "false");
    }
  });
});

const recipeDetail = data.map((recipe) => {
  return `
    <article class="recipe">
      <picture class="recipe__image">
          <source
            srcset=${recipe.image.large}
            type="image/webp"
            media="(min-width: 48em)"
          />
          <img
            loading="lazy"
            src=${recipe.image.small}
            alt="A Smiling family showing off by holding fresh tomatoes, greens, paprika, and lemon in their modern kitchen"
          />
      </picture>
      <div class="recipe__info">
          <h3 class="recipe__title">${recipe.title}</h3>
          <p class="recipe__desc">${recipe.overview}</p>
      </div>
      <div class="recipe__preparation">
        <div>
         <img src="../assets/images/icon-servings.svg" />
         <p>Servings: ${recipe.servings}</p>
       </div>

       <div>
         <img src="../assets/images/icon-prep-time.svg" />
         <p>Prep: ${recipe.prepMinutes}  ${recipe.prepMinutes > 1 ? "mins" : "min"}</p>
       </div>
      <div>
         <img src="../assets/images/icon-cook-time.svg" />
         <p>Cook: ${recipe.cookMinutes} ${recipe.cookMinutes > 1 ? "mins" : "min"} </p>
       </div>
       </div>
      <a href=${recipe.slug} class="recipe__link button">View Recipe</a>
    </article>
`;
});
recipesContainer.innerHTML = recipeDetail.join("");
