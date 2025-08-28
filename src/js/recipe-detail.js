class RecipeDetail {
  constructor() {
    this.recipesData = JSON.parse(sessionStorage.getItem("recipes")) || [];
    this.searchParam = new URLSearchParams(window.location.search);
    this.recipeSlug = this.searchParam.get("id");

    this.recipe = this.recipesData.find(
      (recipe) => recipe.slug === this.recipeSlug,
    );

    this.breadcrumbTitle = document.querySelector(".recipe-detail__name");
    this.recipeImgContainer = document.querySelector(".recipe-detail__image");
    this.recipeTitle = document.querySelector(".recipe-detail__title");
    this.recipeDescription = document.querySelector(".recipe-detail__desc");
    this.recipePrepDetailsContainer = document.querySelector(
      ".recipe-detail__prep-details",
    );
    this.recipeIngredientsContainer = document.querySelector(
      ".recipe-detail__ingredients-list",
    );
    this.recipeInstructionsContainer = document.querySelector(
      ".recipe-detail__instructions-list",
    );
    this.suggestedRecipesContainer = document.querySelector(
      ".recipe-detail__suggestions-box",
    );

    this.renderRecipeDetail();
  }

  renderRecipeDetail() {
    this.breadcrumbTitle.textContent = this.recipe.title;
    this.images = `
     <source srcset=${this.recipe.image.large} media="(min-width: 48em)" type="image/webp" />
     <img src=${this.recipe.image.small} />
   `;

    this.recipeImgContainer.innerHTML = this.images;
    this.recipeTitle.textContent = this.recipe.title;
    this.recipeDescription.textContent = this.recipe.overview;

    this.prepDetails = `
     <div>
       <img src="./img/svgicons/icon-servings.svg" class="recipe-detail__prep-icon" />
       <span>Servings: ${this.recipe.servings}</span>
     </div>
     <div>
       <img src="./img/svgicons/icon-prep-time.svg" class="recipe-detail__prep-icon" />
       <span>Prep: ${this.recipe.prepMinutes} ${this.recipe.prepMinutes > 1 ? "mins" : "min"}</span>
     </div>
     <div>
       <img src="./img/svgicons/icon-cook-time.svg" class="recipe-detail__prep-icon" />
       <span>Cook: ${this.recipe.cookMinutes} ${this.recipe.cookMinutes > 1 ? "mins" : "min"}</span>
     </div>
   `;

    this.recipePrepDetailsContainer.innerHTML = this.prepDetails;

    this.ingredients = this.recipe.ingredients.map((ingredient) => {
      return `
       <li>
        <article>
          <svg class="recipe-detail__ingredients-icon">
           <use href="./img/svgsprite/sprite.symbol.svg#icon-bullet-point" />
          </svg>
         <p>${ingredient}</p>
        </article>
      </li>
          `;
    });
    this.recipeIngredientsContainer.innerHTML = this.ingredients.join("");

    this.instructions = this.recipe.instructions.map((instruction) => {
      return `
       <li>
        <article>
          <svg class="recipe-detail__instructions-icon">
           <use href="./img/svgsprite/sprite.symbol.svg#icon-bullet-point" />
          </svg>
         <p>${instruction}</p>
        </article>
      </li>
`;
    });

    this.recipeInstructionsContainer.innerHTML = this.instructions.join("");

    this.filteredRecipes = this.recipesData.filter(
      (currentRecipe) => currentRecipe.id !== this.recipe.id,
    );

    this.randomlyPickedRecipes = new Set();

    while (
      this.randomlyPickedRecipes.size < 3 &&
      this.randomlyPickedRecipes.size < this.filteredRecipes.length
    ) {
      this.randomIdx = Math.floor(Math.random() * this.filteredRecipes.length);
      this.randomlyPickedRecipes.add(this.filteredRecipes[this.randomIdx]);
    }

    this.suggestedRecipes = [...this.randomlyPickedRecipes];

    this.moreRecipesToCheck = this.suggestedRecipes.map((recipe) => {
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
      <a href="./recipe-detail.html?id=${recipe.slug}" class="recipe__link button">View Recipe</a>
    </article>
  `;
    });

    this.suggestedRecipesContainer.innerHTML = this.moreRecipesToCheck.join("");
    //NOTE: init() ends here
  }
}

new RecipeDetail();
