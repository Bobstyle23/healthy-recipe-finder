//PERF: for better animation (reference)
// function addViewTransitionName() {
//   [...recipesContainer.children].map((recipe, idx) => {
//     const recipeId = `recipe-${idx + 1}`;
//     recipe.style.viewTransitionName = `card-${recipeId}`;
//   });
// }

class Recipe {
  constructor() {
    this.recipesData = JSON.parse(sessionStorage.getItem("recipes")) || [];
    this.currentFilters = { prepTime: null, cookTime: null, searchValue: "" };

    this.recipesContainer = document.querySelector(".recipes__container");
    this.recipeSearchValue = document.querySelector(".recipes__search");
    this.dropdownTitles = document.querySelectorAll(".recipes__select p");
    this.dropdownOptions = document.querySelectorAll(
      ".recipes__select-options div input",
    );
    this.prepTimeOptions = document.getElementsByName("prepTime");
    this.cookTimeOptions = document.getElementsByName("cookTime");
    this.filtersClearBtn = document.querySelectorAll(".recipes__select-btn");
    this.dropdownContainer = document.querySelectorAll(".recipes__select");

    this.initEvents();
    this.renderRecipes();
  }

  initEvents() {
    [...this.dropdownContainer].forEach((dropdown) => {
      dropdown.addEventListener("click", () => {
        const dropdownOpened = dropdown.getAttribute("aria-expanded");
        dropdown.focus();
        dropdown.setAttribute(
          "aria-expanded",
          dropdownOpened === "false" ? "true" : "false",
        );
      });
    });

    this.recipeSearchValue.addEventListener(
      "input",
      this.debounce((e) => this.updateFilters(e), 500),
    );

    [...this.prepTimeOptions, ...this.cookTimeOptions].forEach((option) => {
      option.addEventListener("click", (e) => this.updateFilters(e));
    });

    [...this.filtersClearBtn].forEach((btn) => {
      btn.addEventListener("click", (e) => this.clearFilters(e));
    });
  }

  debounce(callback, delay = 1000) {
    let time;
    return function (...args) {
      clearTimeout(time);
      time = setTimeout(() => callback(...args), delay);
    };
  }

  filterRecipes() {
    return this.recipesData.filter((recipe) => {
      let matches = true;

      if (this.currentFilters.prepTime) {
        matches =
          matches && recipe.prepMinutes === this.currentFilters.prepTime;
      }

      if (this.currentFilters.cookTime) {
        matches =
          matches && recipe.cookMinutes === this.currentFilters.cookTime;
      }

      if (this.currentFilters.searchValue) {
        const searchValue = this.currentFilters.searchValue.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(searchValue);
        const ingredientsMatch = recipe.ingredients
          .join("")
          .toLowerCase()
          .includes(searchValue);

        matches = matches && (titleMatch || ingredientsMatch);
      }

      return matches;
    });
  }

  updateFilters(e) {
    const filterType = e.target.name;
    this.currentFilters[filterType] =
      filterType !== "searchValue" ? Number(e.target.value) : e.target.value;

    this.dropdownTitles.forEach((title) => {
      if (title.dataset.name === filterType) {
        title.textContent = `${e.target.value} ${Number(e.target.value) < 1 ? "minute" : "minutes"}`;
      }
    });

    const recipes = this.filterRecipes();
    this.renderRecipesWithAnimation(recipes);
  }

  clearFilters(e) {
    const filterType = e.target.name;
    if (!filterType) return;

    this.currentFilters[filterType] = null;

    this.dropdownTitles.forEach((title) => {
      if (title.dataset.name === filterType) {
        title.textContent =
          filterType === "prepTime" ? "Max Prep Time" : "Max Cook Time";
      }
    });

    this.dropdownOptions.forEach((option) => {
      if (option.checked && option.name === filterType) {
        option.checked = false;
      }
    });
  }

  renderRecipesWithAnimation(recipesArray) {
    if (!document.startViewTransition()) {
      this.renderRecipes(recipesArray);
      return;
    }

    document.startViewTransition(() => this.renderRecipes(recipesArray));
  }

  renderRecipes(recipesArray = this.recipesData) {
    const recipes = recipesArray.map((recipe, idx) => {
      return `
        <article class="recipe">
          <picture class="recipe__image">
            <source srcset=${recipe.image.large} type="image/webp" media="(min-width: 48em)" />
            <img loading="lazy" src=${recipe.image.small} alt="${recipe.title}" />
          </picture>
          <div class="recipe__info">
              <h3 class="recipe__title">${recipe.title}</h3>
              <p class="recipe__desc">${recipe.overview}</p>
          </div>
          <div class="recipe__preparation">
            <div><img src="./img/svgicons/icon-servings.svg" /><p>Servings: ${recipe.servings}</p></div>
            <div><img src="./img/svgicons/icon-prep-time.svg" /><p>Prep: ${recipe.prepMinutes} ${recipe.prepMinutes > 1 ? "mins" : "min"}</p></div>
            <div><img src="./img/svgicons/icon-cook-time.svg" /><p>Cook: ${recipe.cookMinutes} ${recipe.cookMinutes > 1 ? "mins" : "min"}</p></div>
          </div>
          <a href="./recipe-detail.html?id=${recipe.slug}" class="recipe__link button">View Recipe</a>
        </article>`;
    });

    this.recipesContainer.innerHTML =
      recipes.length > 0
        ? recipes.join("")
        : `<p class="no-result">No recipes found. Try adjusting your filters.</p>`;
  }
}

new Recipe();
