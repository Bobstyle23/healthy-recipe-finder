const recipesContainer = document.querySelector(".recipes__container");
const recipesSelectOptions = document.querySelectorAll(".recipes__select");
const prepTimeOptions = document.getElementsByName("prepTime");
const cookTimeOptions = document.getElementsByName("cookTime");
const recipesData = JSON.parse(sessionStorage.getItem("recipes"));

const currentFilters = {
  prepTime: 0,
  cookTime: 0,
  searchValue: "",
};

//NOTE: Recipes cook & prep time options
[...recipesSelectOptions].forEach((select) => {
  select.addEventListener("click", (e) => {
    const selectOpened = select.getAttribute("aria-expanded");
    select.focus();
    if (selectOpened === "false") {
      select.setAttribute("aria-expanded", "true");
    } else {
      select.setAttribute("aria-expanded", "false");
    }
  });
});

function updateFilters(e) {
  const filterType = e.target.name;
  currentFilters[filterType] = Number(e.target.value);
}

prepTimeOptions.forEach((option, idx) => {
  option.addEventListener("click", (e) => {
    updateFilters(e);
  });
});

cookTimeOptions.forEach((option) => {
  option.addEventListener("click", (e) => updateFilters(e));
});

const recipes = recipesData.map((recipe) => {
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
