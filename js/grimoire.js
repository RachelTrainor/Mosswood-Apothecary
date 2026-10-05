// ==========================================
// MOSSWOOD APOTHECARY
// Grimoire V1
// ==========================================


// ==========================================
// RECIPE INFORMATION
// ==========================================

const grimoireRecipes = [

    {
        id: "potionOfCalm",
        name: "Potion of Calm",
        icon: "⚗",
        ingredients: [
            "Moonmint",
            "Moonmint"
        ],
        description:
            "A pale green draught carrying the cool scent of Moonmint.",
        effect:
            "Calms the mind and settles restless thoughts."
    },

    {
        id: "unknownRecipeTwo",
        name: "???",
        icon: "?",
        ingredients: [],
        description:
            "This formula has not yet been discovered.",
        effect:
            "Unknown"
    },

    {
        id: "unknownRecipeThree",
        name: "???",
        icon: "?",
        ingredients: [],
        description:
            "The pages here remain strangely blank.",
        effect:
            "Unknown"
    },

    {
        id: "unknownRecipeFour",
        name: "???",
        icon: "?",
        ingredients: [],
        description:
            "Perhaps another combination will reveal its secrets.",
        effect:
            "Unknown"
    }

];


// ==========================================
// CHECK RECIPE DISCOVERY
// ==========================================

function isRecipeDiscovered(recipe) {

    return game.discoveries.includes(
        recipe.id
    );

}


// ==========================================
// CREATE DISCOVERED RECIPE
// ==========================================

function createDiscoveredRecipe(recipe) {

    const ingredients =
        recipe.ingredients
            .map(
                ingredient => `
                    <span class="recipe-ingredient">
                        🌿 ${ingredient}
                    </span>
                `
            )
            .join("");


    return `

        <article class="recipe-card discovered">

            <div class="recipe-card-top">

                <div class="recipe-icon">
                    ${recipe.icon}
                </div>

                <div>

                    <span class="card-label">
                        DISCOVERED RECIPE
                    </span>

                    <h4>
                        ${recipe.name}
                    </h4>

                </div>

            </div>


            <p class="recipe-description">
                ${recipe.description}
            </p>


            <div class="recipe-divider">
            </div>


            <span class="recipe-subheading">
                INGREDIENTS
            </span>


            <div class="recipe-ingredients">

                ${ingredients}

            </div>


            <div class="recipe-effect">

                <span class="recipe-subheading">
                    EFFECT
                </span>

                <p>
                    ${recipe.effect}
                </p>

            </div>

        </article>

    `;

}


// ==========================================
// CREATE UNKNOWN RECIPE
// ==========================================

function createUnknownRecipe() {

    return `

        <article class="recipe-card locked">

            <div class="locked-recipe-symbol">
                ?
            </div>


            <span class="card-label">
                UNDISCOVERED
            </span>


            <h4>
                Unknown Formula
            </h4>


            <p>
                Experiment with different ingredients
                in the Potion Room to uncover this recipe.
            </p>


            <div class="mystery-recipe">

                <span>
                    ???
                </span>

                <span>
                    +
                </span>

                <span>
                    ???
                </span>

            </div>

        </article>

    `;

}


// ==========================================
// RENDER RECIPES
// ==========================================

function renderRecipes() {

    const recipeGrid =
        document.getElementById(
            "recipeGrid"
        );


    if (!recipeGrid) {

        return;

    }


    recipeGrid.innerHTML = "";


    grimoireRecipes.forEach(
        recipe => {

            if (
                isRecipeDiscovered(recipe)
            ) {

                recipeGrid.innerHTML +=
                    createDiscoveredRecipe(
                        recipe
                    );

            }

            else {

                recipeGrid.innerHTML +=
                    createUnknownRecipe();

            }

        }
    );

}


// ==========================================
// DISCOVERY COUNT
// ==========================================

function renderDiscoveryCount() {

    const countElement =
        document.getElementById(
            "discoveredRecipeCount"
        );


    if (!countElement) {

        return;

    }


    const discoveredRecipes =
        grimoireRecipes.filter(
            recipe =>
                isRecipeDiscovered(
                    recipe
                )
        );


    countElement.textContent =
        discoveredRecipes.length;

}


// ==========================================
// RENDER GRIMOIRE
// ==========================================

function renderGrimoire() {

    updateResourceBar();

    renderRecipes();

    renderDiscoveryCount();

}


// ==========================================
// START GRIMOIRE
// ==========================================

renderGrimoire();
