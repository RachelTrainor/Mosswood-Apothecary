// ==========================================
// MOSSWOOD APOTHECARY
// Potion Room V2
// Central Data Integration
// ==========================================


// ==========================================
// CURRENT EXPERIMENT
// ==========================================

// Ingredients placed into the cauldron
// are stored here temporarily.
//
// They are NOT removed from inventory
// until the player actually brews.

let experiment = [];


// ==========================================
// INGREDIENT DATA HELPERS
// ==========================================

function getPotionIngredientData(
    ingredientId
) {

    const plant =
        PLANT_DATA[
            ingredientId
        ];


    if (!plant) {

        return null;

    }


    return {

        id:
            plant.id,

        name:
            plant.name,

        icon:
            plant.icon,

        description:
            plant.description

    };

}


// ==========================================
// ADD INGREDIENT
// ==========================================

function addIngredientToExperiment(
    ingredient
) {

    // Maximum of three ingredients.

    if (
        experiment.length >= 3
    ) {

        showPotionResult(
            "The cauldron is full.",
            "You can only experiment with three ingredients at a time."
        );

        return;

    }


    // Make sure the ingredient exists.

    const ingredientInfo =
        getPotionIngredientData(
            ingredient
        );


    if (!ingredientInfo) {

        return;

    }


    // Count how many of this ingredient
    // are already in the cauldron.

    const selectedAmount =
        experiment.filter(
            item =>
                item === ingredient
        ).length;


    // Amount currently owned.

    const availableAmount =
        getIngredientAmount(
            ingredient
        );


    // Prevent selecting more than owned.

    if (
        selectedAmount >=
        availableAmount
    ) {

        showPotionResult(
            "Nothing left on the shelf.",
            `You don't have any more ${ingredientInfo.name} available.`
        );

        return;

    }


    experiment.push(
        ingredient
    );


    renderPotionRoom();

}


// ==========================================
// REMOVE INGREDIENT
// ==========================================

function removeExperimentIngredient(
    index
) {

    if (
        index < 0 ||
        index >= experiment.length
    ) {

        return;

    }


    experiment.splice(
        index,
        1
    );


    renderPotionRoom();

}


// ==========================================
// CLEAR CAULDRON
// ==========================================

function clearExperiment() {

    if (
        experiment.length === 0
    ) {

        showPotionResult(
            "The cauldron is already empty.",
            "Choose an ingredient from the shelf when you're ready to experiment."
        );

        return;

    }


    experiment = [];


    renderPotionRoom();


    showPotionResult(
        "The cauldron has been cleared.",
        "The unused ingredients were returned to the shelf."
    );

}


// ==========================================
// CREATE RECIPE KEY
// ==========================================

function createRecipeKey(
    ingredients
) {

    return [...ingredients]
        .sort()
        .join("+");

}


// ==========================================
// FIND RECIPE
// ==========================================

function findRecipeByIngredients(
    ingredients
) {

    const experimentKey =
        createRecipeKey(
            ingredients
        );


    return Object.values(
        RECIPE_DATA
    ).find(
        recipe => {

            const recipeKey =
                createRecipeKey(
                    recipe.ingredients
                );


            return (
                recipeKey ===
                experimentKey
            );

        }
    ) || null;

}


// ==========================================
// BREW EXPERIMENT
// ==========================================

function brewExperiment() {

    // Nothing selected.

    if (
        experiment.length === 0
    ) {

        showPotionResult(
            "The cauldron is empty.",
            "Add at least one ingredient before experimenting."
        );

        return;

    }


    // --------------------------------------
    // COUNT REQUIRED INGREDIENTS
    // --------------------------------------

    const requiredIngredients = {};


    experiment.forEach(
        ingredient => {

            if (
                !requiredIngredients[
                    ingredient
                ]
            ) {

                requiredIngredients[
                    ingredient
                ] = 0;

            }


            requiredIngredients[
                ingredient
            ]++;

        }
    );


    // --------------------------------------
    // VERIFY INVENTORY
    // --------------------------------------

    for (
        const ingredient
        in requiredIngredients
    ) {

        const required =
            requiredIngredients[
                ingredient
            ];


        const available =
            getIngredientAmount(
                ingredient
            );


        if (
            available < required
        ) {

            const ingredientInfo =
                getPotionIngredientData(
                    ingredient
                );


            const ingredientName =
                ingredientInfo
                    ? ingredientInfo.name
                    : "ingredient";


            showPotionResult(
                "Something is missing.",
                `You no longer have enough ${ingredientName} for this experiment.`
            );


            experiment = [];


            renderPotionRoom();


            return;

        }

    }


    // --------------------------------------
    // FIND MATCHING RECIPE
    // --------------------------------------

    const recipe =
        findRecipeByIngredients(
            experiment
        );


    // --------------------------------------
    // CONSUME INGREDIENTS
    // --------------------------------------

    for (
        const ingredient
        in requiredIngredients
    ) {

        game.inventory[
            ingredient
        ] -=
            requiredIngredients[
                ingredient
            ];

    }


    // ======================================
    // SUCCESSFUL RECIPE
    // ======================================

    if (recipe) {

        const potion =
            POTION_DATA[
                recipe.potionId
            ];


        if (potion) {

            // ----------------------------------
            // ADD POTION
            // ----------------------------------

            if (
                typeof game.potions[
                    potion.id
                ] !== "number"
            ) {

                game.potions[
                    potion.id
                ] = 0;

            }


            game.potions[
                potion.id
            ]++;


            // ----------------------------------
            // FIRST DISCOVERY
            // ----------------------------------

            const firstDiscovery =
                !hasDiscovered(
                    recipe.id
                );


            if (firstDiscovery) {

                game.discoveries.push(
                    recipe.id
                );


                showPotionResult(
                    `✦ New Discovery: ${potion.name} ✦`,
                    `${potion.description} The recipe has been recorded in your Grimoire.`,
                    "discovery"
                );

            }


            // ----------------------------------
            // ALREADY DISCOVERED
            // ----------------------------------

            else {

                showPotionResult(
                    potion.name,
                    potion.description,
                    "success"
                );

            }

        }


        else {

            showPotionResult(
                "Unstable Mixture",
                "The ingredients react strangely, but no usable potion can be recovered.",
                "failure"
            );

        }

    }


    // ======================================
    // FAILED EXPERIMENT
    // ======================================

    else {

        showPotionResult(
            "Failed Experiment",
            "The mixture bubbles hopefully for a moment before fading into a murky, useless liquid.",
            "failure"
        );

    }


    // --------------------------------------
    // EMPTY CAULDRON
    // --------------------------------------

    experiment = [];


    // --------------------------------------
    // SAVE SHARED GAME
    // --------------------------------------

    saveGame();


    // Update resource bar.

    updateResourceBar();


    // Refresh Potion Room UI.

    renderPotionRoom();

}


// ==========================================
// RESULT MESSAGE
// ==========================================

function showPotionResult(
    title,
    description,
    type = ""
) {

    const result =
        document.getElementById(
            "experimentResult"
        );


    if (!result) {

        return;

    }


    result.className =
        "experiment-result";


    if (type) {

        result.classList.add(
            type
        );

    }


    let symbol = "☾";


    if (
        type === "discovery"
    ) {

        symbol = "✦";

    }


    if (
        type === "success"
    ) {

        symbol = "⚗";

    }


    if (
        type === "failure"
    ) {

        symbol = "☁";

    }


    result.innerHTML = `

        <span class="result-symbol">
            ${symbol}
        </span>

        <div>

            <strong>
                ${title}
            </strong>

            <p>
                ${description}
            </p>

        </div>

    `;

}


// ==========================================
// RENDER INGREDIENT SLOTS
// ==========================================

function renderExperimentSlots() {

    const container =
        document.getElementById(
            "ingredientSlots"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // Three cauldron slots.

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const slot =
            document.createElement(
                "button"
            );


        const ingredient =
            experiment[i];


        // ----------------------------------
        // FILLED SLOT
        // ----------------------------------

        if (ingredient) {

            const data =
                getPotionIngredientData(
                    ingredient
                );


            if (data) {

                slot.className =
                    "ingredient-slot filled";


                slot.innerHTML = `

                    <span class="slot-plant">
                        ${data.icon}
                    </span>

                    <strong>
                        ${data.name}
                    </strong>

                    <small>
                        Remove
                    </small>

                `;


                slot.addEventListener(
                    "click",
                    () => {

                        removeExperimentIngredient(
                            i
                        );

                    }
                );

            }

        }


        // ----------------------------------
        // EMPTY SLOT
        // ----------------------------------

        if (
            !ingredient ||
            !getPotionIngredientData(
                ingredient
            )
        ) {

            slot.className =
                "ingredient-slot empty";


            slot.innerHTML = `

                <span class="empty-plus">
                    +
                </span>

                <small>
                    Empty
                </small>

            `;


            slot.disabled = true;

        }


        container.appendChild(
            slot
        );

    }

}


// ==========================================
// RENDER INGREDIENT SHELF
// ==========================================

function renderIngredientShelf() {

    const moonmintAmount =
        document.getElementById(
            "moonmintAvailable"
        );


    if (moonmintAmount) {

        moonmintAmount.textContent =
            getIngredientAmount(
                "moonmint"
            );

    }

}


// ==========================================
// GET DISCOVERED RECIPE COUNT
// ==========================================

function getDiscoveredRecipeCount() {

    return Object.keys(
        RECIPE_DATA
    ).filter(
        recipeId =>
            hasDiscovered(
                recipeId
            )
    ).length;

}


// ==========================================
// RENDER DISCOVERY COUNT
// ==========================================

function renderDiscoveryCount() {

    const element =
        document.getElementById(
            "recipeCount"
        );


    if (!element) {

        return;

    }


    const amount =
        getDiscoveredRecipeCount();


    if (
        amount === 1
    ) {

        element.textContent =
            "1 recipe discovered";

    }

    else {

        element.textContent =
            `${amount} recipes discovered`;

    }

}


// ==========================================
// RENDER POTION ROOM
// ==========================================

function renderPotionRoom() {

    updateResourceBar();

    renderExperimentSlots();

    renderIngredientShelf();

    renderDiscoveryCount();

}


// ==========================================
// BUTTON EVENTS
// ==========================================

const addMoonmintButton =
    document.getElementById(
        "addMoonmint"
    );


if (addMoonmintButton) {

    addMoonmintButton.addEventListener(
        "click",
        () => {

            addIngredientToExperiment(
                "moonmint"
            );

        }
    );

}


const brewButton =
    document.getElementById(
        "brewButton"
    );


if (brewButton) {

    brewButton.addEventListener(
        "click",
        brewExperiment
    );

}


const clearButton =
    document.getElementById(
        "clearButton"
    );


if (clearButton) {

    clearButton.addEventListener(
        "click",
        clearExperiment
    );

}


// ==========================================
// START POTION ROOM
// ==========================================

renderPotionRoom();
