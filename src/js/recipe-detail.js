const recipesData = JSON.parse(sessionStorage.getItem("recipes"));
const searchParam = new URLSearchParams(window.location.search);

const recipeSlug = searchParam.get("id");
const recipe = recipesData.find((recipe) => recipe.slug === recipeSlug);

const breadcrumbTitle = document.querySelector(".recipe-detail__name");
const recipeImgContainer = document.querySelector(".recipe-detail__image");
const recipeTitle = document.querySelector(".recipe-detail__title");
const recipeDescription = document.querySelector(".recipe-detail__desc");
const recipePrepDetailsContainer = document.querySelector(
  ".recipe-detail__prep-details",
);
const recipeIngredientsContainer = document.querySelector(
  ".recipe-detail__ingredients-list",
);
const recipeInstructionsContainer = document.querySelector(
  ".recipe-detail__instructions-list",
);

const suggestedRecipesContainer = document.querySelector(
  ".recipe-detail__suggestions-box",
);

breadcrumbTitle.textContent = recipe.title;

const images = `
    <source srcset=.${recipe.image.large} media="(min-width: 48em)" type="image/webp" />    
    <img src=.${recipe.image.small} />
  `;
recipeImgContainer.innerHTML = images;

recipeTitle.textContent = recipe.title;
recipeDescription.textContent = recipe.overview;

const prepDetails = `
   <div>
    <img src="../img/svgicons/icon-servings.svg" class="recipe-detail__prep-icon" />
    <span>Servings: ${recipe.servings}</span>
  </div>
  <div>
    <img src="../img/svgicons/icon-prep-time.svg" class="recipe-detail__prep-icon" />
    <span>Prep: ${recipe.prepMinutes} ${recipe.prepMinutes > 1 ? "mins" : "min"}</span>
  </div>
  <div>
    <img src="../img/svgicons/icon-cook-time.svg" class="recipe-detail__prep-icon" />
    <span>Cook: ${recipe.cookMinutes} ${recipe.cookMinutes > 1 ? "mins" : "min"}</span>
  </div>
  `;
recipePrepDetailsContainer.innerHTML = prepDetails;

const ingredients = recipe.ingredients.map((ingredient) => {
  return `
       <li> 
        <article>
          <svg class="recipe-detail__ingredients-icon">
           <use href="../img/svgsprite/sprite.symbol.svg#icon-bullet-point" />
          </svg>
         <p>${ingredient}</p>
        </article>
      </li>
`;
});

recipeIngredientsContainer.innerHTML = ingredients.join("");

const instructions = recipe.instructions.map((instruction) => {
  return `
       <li> 
        <article>
          <svg class="recipe-detail__instructions-icon">
           <use href="../img/svgsprite/sprite.symbol.svg#icon-bullet-point" />
          </svg>
         <p>${instruction}</p>
        </article>
      </li>
`;
});

recipeInstructionsContainer.innerHTML = instructions.join("");

const filteredRecipes = recipesData.filter(
  (currentRecipe) => currentRecipe.id !== recipe.id,
);

const randomlyPickedRecipes = new Set();

while (
  randomlyPickedRecipes.size < 3 &&
  randomlyPickedRecipes.size < filteredRecipes.length
) {
  const randomIdx = Math.floor(Math.random() * filteredRecipes.length);
  randomlyPickedRecipes.add(filteredRecipes[randomIdx]);
}

const suggestedRecipes = [...randomlyPickedRecipes];

const moreRecipesToCheck = suggestedRecipes.map((recipe) => {
  return `<article class="recipe">
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
      <a href="../recipe-detail.html?id=${recipe.slug}" class="recipe__link button">View Recipe</a>
    </article>
  `;
});

suggestedRecipesContainer.innerHTML = moreRecipesToCheck.join("");
