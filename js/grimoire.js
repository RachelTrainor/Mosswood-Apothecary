// ==========================================
// MOSSWOOD APOTHECARY
// Grimoire V2
// ==========================================


// ==========================================
// BOTANICAL INFORMATION
// ==========================================

const grimoirePlants = [

    {
        id: "moonmint",
        name: "Moonmint",
        icon: "🌿",
        type: "Herb",
        description:
            "A cool-scented herb commonly cultivated in the Mosswood greenhouse.",
        notes:
            "Known for its calming properties and pale, fragrant leaves.",
        alwaysKnown: true
    },

    {
        id: "nightbell",
        name: "Nightbell",
        icon: "🪻",
        type: "Woodland Flower",
        description:
            "A dusky woodland flower first identified after cultivating a mysterious Strange Seed.",
        notes:
            "Its deeper alchemical properties remain uncertain. Experimentation may reveal more.",
        alwaysKnown: false
    }

];


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
                    ${plant.type.toUpperCase()}
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
                        ${plant.notes}
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


    grimoirePlants.forEach(
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
// CREATE DISCOVERED RECIPE
// ==========================================

function createDiscoveredRecipe(
    recipe
) {

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


    recipeGrid.innerHTML =
        "";


    grimoireRecipes.forEach(
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
                    createUnknownRecipe();

            }

        }
    );

}


// ==========================================
// DISCOVERY COUNTS
// ==========================================

function renderDiscoveryCount() {

    const recipeCountElement =
        document.getElementById(
            "discoveredRecipeCount"
        );


    if (
        recipeCountElement
    ) {

        const discoveredRecipes =
            grimoireRecipes.filter(
                recipe =>
                    isRecipeDiscovered(
                        recipe
                    )
            );


        recipeCountElement.textContent =
            discoveredRecipes.length;

    }


    const plantCountElement =
        document.getElementById(
            "discoveredPlantCount"
        );


    if (
        plantCountElement
    ) {

        const discoveredPlants =
            grimoirePlants.filter(
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
