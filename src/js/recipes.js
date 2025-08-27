const recipesData = JSON.parse(sessionStorage.getItem("recipes"));
const recipesContainer = document.querySelector(".recipes__container");
const recipesSelectOptionsContainer =
  document.querySelectorAll(".recipes__select");
const selectOptions = document.querySelectorAll(
  ".recipes__select-options div input",
);
const prepTimeOptions = document.getElementsByName("prepTime");
const cookTimeOptions = document.getElementsByName("cookTime");
const filterTitles = document.querySelectorAll(".recipes__select p");
const recipeSearchValue = document.querySelector(".recipes__search");
const filtersClearBtn = document.querySelectorAll(".recipes__select-btn");

//NOTE: Recipes cook & prep time options
[...recipesSelectOptionsContainer].forEach((select) => {
  select.addEventListener("click", () => {
    const selectOpened = select.getAttribute("aria-expanded");
    select.focus();
    if (selectOpened === "false") {
      select.setAttribute("aria-expanded", "true");
    } else {
      select.setAttribute("aria-expanded", "false");
    }
  });
});

const currentFilters = {
  prepTime: null,
  cookTime: null,
  searchValue: "",
};

//PERF: for better animation (reference)
// function addViewTransitionName() {
//   [...recipesContainer.children].map((recipe, idx) => {
//     const recipeId = `recipe-${idx + 1}`;
//     recipe.style.viewTransitionName = `card-${recipeId}`;
//   });
// }

function renderRecipesWithAnimation(recipesArray) {
  if (!document.startViewTransition()) {
    renderRecipes(recipesArray);
    return;
  }

  document.startViewTransition(() => renderRecipes(recipesArray));
}

function filterRecipes() {
  let recipes = recipesData.filter((recipe) => {
    let matches = true;

    if (currentFilters.prepTime) {
      matches = matches && recipe.prepMinutes === currentFilters.prepTime;
    }

    if (currentFilters.cookTime) {
      matches = matches && recipe.cookMinutes === currentFilters.cookTime;
    }

    if (currentFilters.searchValue) {
      const searchValue = currentFilters.searchValue.toLowerCase();
      const title = recipe.title.toLowerCase().includes(searchValue);
      const ingredients = recipe.ingredients
        .join("")
        .toLowerCase()
        .includes(searchValue);

      matches = matches && (title || ingredients);
    }

    return matches;
  });

  return recipes;
}

function updateFilters(e) {
  const filterType = e.target.name;
  currentFilters[filterType] =
    filterType !== "searchValue" ? Number(e.target.value) : e.target.value;
  filterTitles.forEach((title) => {
    if (title.dataset.name === filterType) {
      title.textContent = `${e.target.value} ${Number(e.target.value) < 1 ? "minute" : "minutes"}`;
    }
  });

  const recipes = filterRecipes();
  renderRecipesWithAnimation(recipes);
}

function clearFilters(e) {
  const filterType = e.target.name;
  if (!filterType) return;
  currentFilters[filterType] = null;
  filterTitles.forEach((title) => {
    if (title.dataset.name === filterType) {
      title.textContent =
        filterType === "prepTime" ? "Max Prep Time" : "Max Cook Time";
    }
  });

  selectOptions.forEach((option) => {
    if (option.checked && option.name === filterType) {
      option.checked = false;
    }
  });
}

function debounce(callback, delay = 1000) {
  let time;
  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const getSearchValue = debounce((event) => {
  updateFilters(event);
}, 500);

recipeSearchValue.addEventListener("input", (event) => {
  getSearchValue(event);
});

[...prepTimeOptions, ...cookTimeOptions].forEach((option) => {
  option.addEventListener("click", (event) => {
    updateFilters(event);
  });
});

[...filtersClearBtn].forEach((btn) => {
  btn.addEventListener("click", function (e) {
    clearFilters(e);
  });
});

function renderRecipes(recipesArray = recipesData) {
  const recipes = recipesArray.map((recipe, idx) => {
    return `
    <article class="recipe">
      <picture class="recipe__image" >
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
         <img src="./img/svgicons/icon-servings.svg" />
         <p>Servings: ${recipe.servings}</p>
       </div>

       <div>
         <img src="./img/svgicons/icon-prep-time.svg" />
         <p>Prep: ${recipe.prepMinutes}  ${recipe.prepMinutes > 1 ? "mins" : "min"}</p>
       </div>
      <div>
         <img src="./img/svgicons/icon-cook-time.svg" />
         <p>Cook: ${recipe.cookMinutes} ${recipe.cookMinutes > 1 ? "mins" : "min"} </p>
       </div>
       </div>
      <a href="./recipe-detail.html?id=${recipe.slug}" class="recipe__link button">View Recipe</a>
    </article>
`;
  });

  if (!recipes.length) {
    recipesContainer.innerHTML = `<p class="no-result">No recipes found. Try adjusting your filters.</p>`;
    return;
  }
  recipesContainer.innerHTML = recipes.join("");
}

renderRecipes();
