// ==========================================
// MOSSWOOD APOTHECARY
// Grimoire V3
// Dynamic Discovery System
// ==========================================


// ==========================================
// CHECK PLANT DISCOVERY
// ==========================================

function isPlantDiscovered(
    plant
) {

    if (
        plant.alwaysKnown
    ) {

        return true;

    }


    return hasDiscovered(
        plant.id
    );

}


// ==========================================
// CHECK RECIPE DISCOVERY
// ==========================================

function isRecipeDiscovered(
    recipe
) {

    return hasDiscovered(
        recipe.id
    );

}


// ==========================================
// CREATE BOTANICAL ENTRY
// ==========================================

function createBotanicalEntry(
    plant
) {

    return `

        <article class="botanical-card discovered">

            <div class="botanical-icon">
                ${plant.icon}
            </div>


            <div class="botanical-content">

                <span class="card-label">
                    ${
                        plant.type
                            ? plant.type.toUpperCase()
                            : "BOTANICAL"
                    }
                </span>


                <h4>
                    ${plant.name}
                </h4>


                <p>
                    ${plant.description}
                </p>


                <div class="botanical-notes">

                    <span class="recipe-subheading">
                        FIELD NOTES
                    </span>

                    <p>
                        ${
                            plant.fieldNotes ||
                            "Further study may reveal more about this plant."
                        }
                    </p>

                </div>

            </div>

        </article>

    `;

}


// ==========================================
// CREATE UNKNOWN BOTANICAL
// ==========================================

function createUnknownBotanical() {

    return `

        <article class="botanical-card locked">

            <div class="botanical-icon">
                ?
            </div>


            <div class="botanical-content">

                <span class="card-label">
                    UNIDENTIFIED
                </span>


                <h4>
                    Unknown Botanical
                </h4>


                <p>
                    Mosswood still holds plants
                    that have yet to be identified.
                </p>


                <div class="botanical-notes">

                    <span class="recipe-subheading">
                        FIELD NOTES
                    </span>

                    <p>
                        Cultivate unfamiliar seeds
                        to learn what grows from them.
                    </p>

                </div>

            </div>

        </article>

    `;

}


// ==========================================
// RENDER BOTANICALS
// ==========================================

function renderBotanicals() {

    const botanicalGrid =
        document.getElementById(
            "botanicalGrid"
        );


    if (!botanicalGrid) {

        return;

    }


    botanicalGrid.innerHTML =
        "";


    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            if (
                isPlantDiscovered(
                    plant
                )
            ) {

                botanicalGrid.innerHTML +=
                    createBotanicalEntry(
                        plant
                    );

            }

            else {

                botanicalGrid.innerHTML +=
                    createUnknownBotanical();

            }

        }
    );

}


// ==========================================
// INGREDIENT DISPLAY
// ==========================================

function createIngredientDisplay(
    ingredientId
) {

    const plant =
        getPlantData(
            ingredientId
        );


    if (!plant) {

        return `

            <span class="recipe-ingredient">
                ? Unknown Ingredient
            </span>

        `;

    }


    return `

        <span class="recipe-ingredient">
            ${plant.icon} ${plant.name}
        </span>

    `;

}


// ==========================================
// CREATE DISCOVERED RECIPE
// ==========================================

function createDiscoveredRecipe(
    recipe
) {

    const potion =
        getPotionData(
            recipe.potionId
        );


    if (!potion) {

        return "";

    }


    const ingredients =
        recipe.ingredients
            .map(
                ingredient =>
                    createIngredientDisplay(
                        ingredient
                    )
            )
            .join("");


    return `

        <article class="recipe-card discovered">

            <div class="recipe-card-top">

                <div class="recipe-icon">
                    ${potion.icon}
                </div>


                <div>

                    <span class="card-label">
                        DISCOVERED RECIPE
                    </span>

                    <h4>
                        ${potion.name}
                    </h4>

                </div>

            </div>


            <p class="recipe-description">
                ${potion.description}
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
                    ${potion.effect}
                </p>

            </div>

        </article>

    `;

}


// ==========================================
// CREATE UNKNOWN RECIPE
// ==========================================

function createUnknownRecipe(
    recipe
) {

    const ingredientCount =
        recipe.ingredients.length;


    let mysteryIngredients =
        "";


    for (
        let i = 0;
        i < ingredientCount;
        i++
    ) {

        mysteryIngredients += `

            <span>
                ???
            </span>

        `;


        if (
            i <
            ingredientCount - 1
        ) {

            mysteryIngredients += `

                <span>
                    +
                </span>

            `;

        }

    }


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

                ${mysteryIngredients}

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


    recipeGrid.innerHTML =
        "";


    Object.values(
        RECIPE_DATA
    ).forEach(
        recipe => {

            if (
                isRecipeDiscovered(
                    recipe
                )
            ) {

                recipeGrid.innerHTML +=
                    createDiscoveredRecipe(
                        recipe
                    );

            }

            else {

                recipeGrid.innerHTML +=
                    createUnknownRecipe(
                        recipe
                    );

            }

        }
    );

}


// ==========================================
// DISCOVERY COUNTS
// ==========================================

function renderDiscoveryCount() {

    // --------------------------------------
    // RECIPES
    // --------------------------------------

    const recipeCountElement =
        document.getElementById(
            "discoveredRecipeCount"
        );


    if (
        recipeCountElement
    ) {

        const discoveredRecipes =
            Object.values(
                RECIPE_DATA
            ).filter(
                recipe =>
                    isRecipeDiscovered(
                        recipe
                    )
            );


        recipeCountElement.textContent =
            discoveredRecipes.length;

    }


    // --------------------------------------
    // PLANTS
    // --------------------------------------

    const plantCountElement =
        document.getElementById(
            "discoveredPlantCount"
        );


    if (
        plantCountElement
    ) {

        const discoveredPlants =
            Object.values(
                PLANT_DATA
            ).filter(
                plant =>
                    isPlantDiscovered(
                        plant
                    )
            );


        plantCountElement.textContent =
            discoveredPlants.length;

    }

}


// ==========================================
// RENDER GRIMOIRE
// ==========================================

function renderGrimoire() {

    updateResourceBar();

    renderBotanicals();

    renderRecipes();

    renderDiscoveryCount();

}


// ==========================================
// START GRIMOIRE
// ==========================================

renderGrimoire();
