const recipesContainer = document.querySelector(".recipes__container");
const recipesSelectOptions = document.querySelectorAll(".recipes__select");
const selectOptions = document.querySelectorAll(
  ".recipes__select-options div input",
);
const prepTimeOptions = document.getElementsByName("prepTime");
const cookTimeOptions = document.getElementsByName("cookTime");
const optionTitles = document.querySelectorAll(".recipes__select p");
const recipeSearchValue = document.querySelector(".recipes__search");
const optionsClearBtn = document.querySelectorAll(".recipes__select-btn");
const recipesData = JSON.parse(sessionStorage.getItem("recipes"));

//NOTE: Recipes cook & prep time options
[...recipesSelectOptions].forEach((select) => {
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

function filterRecipes() {
  let recipes = recipesData.reduce((filteredRecipes, currentRecipe) => {
    if (
      (currentFilters.prepTime &&
        currentRecipe.prepMinutes === currentFilters.prepTime) ||
      (currentFilters.cookTime &&
        currentRecipe.cookMinutes === currentFilters.cookTime)
    ) {
      filteredRecipes.push(currentRecipe);
    }
    return filteredRecipes;
  }, []);

  return recipes.length > 0 ? recipes : recipesData;
}

function updateFilters(e) {
  const filterType = e.target.name;
  currentFilters[filterType] = Number(e.target.value);
  optionTitles.forEach((title) => {
    if (title.dataset.name === filterType) {
      title.textContent = `${e.target.value} ${Number(e.target.value) < 1 ? "minute" : "minutes"}`;
    }
  });

  const recipes = filterRecipes();
  if (!document.startViewTransition()) {
    renderRecipes(recipes);
    return;
  }
  document.startViewTransition(() => renderRecipes(recipes));
}

function clearFilters(e) {
  const filterType = e.target.name;
  if (!filterType) return;
  currentFilters[filterType] = null;
  optionTitles.forEach((title) => {
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
  currentFilters.searchValue = event.target.value;
}, 500);

recipeSearchValue.addEventListener("input", (event) => {
  getSearchValue(event);
});

[...prepTimeOptions, ...cookTimeOptions].forEach((option) => {
  option.addEventListener("click", (event) => {
    updateFilters(event);
  });
});

[...optionsClearBtn].forEach((btn) => {
  btn.addEventListener("click", function (e) {
    clearFilters(e);
  });
});

function renderRecipes(recipesArray = recipesData) {
  const recipes = recipesArray.map((recipe) => {
    // if (recipe.ingredients.join("").includes("eggs")) {
    //   console.log(recipe);
    // }
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

  recipesContainer.innerHTML = recipes.join("");
}

renderRecipes();
