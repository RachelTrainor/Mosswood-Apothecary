// ==========================================
// MOSSWOOD APOTHECARY
// Potion Room V1
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
// INGREDIENT INFORMATION
// ==========================================

const ingredientData = {

    moonmint: {
        name: "Moonmint",
        icon: "🌿",
        description:
            "A cool, fragrant herb harvested from the greenhouse."
    }

};


// ==========================================
// ADD INGREDIENT
// ==========================================

function addIngredientToExperiment(
    ingredient
) {

    // Maximum of three ingredients.

    if (experiment.length >= 3) {

        showPotionResult(
            "The cauldron is full.",
            "You can only experiment with three ingredients at a time."
        );

        return;
    }


    // Make sure this ingredient exists.

    if (!ingredientData[ingredient]) {

        return;
    }


    // Count how many of this ingredient
    // are already sitting in the cauldron.

    const selectedAmount =
        experiment.filter(
            item => item === ingredient
        ).length;


    // Amount currently owned.

    const availableAmount =
        getIngredientAmount(
            ingredient
        );


    // Prevent player from selecting
    // ingredients they don't own.

    if (
        selectedAmount >=
        availableAmount
    ) {

        showPotionResult(
            "Nothing left on the shelf.",
            `You don't have any more ${ingredientData[ingredient].name} available.`
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

    if (experiment.length === 0) {

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
// BREW EXPERIMENT
// ==========================================

function brewExperiment() {

    // Nothing selected.

    if (experiment.length === 0) {

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


        if (available < required) {

            showPotionResult(
                "Something is missing.",
                `You no longer have enough ${ingredientData[ingredient].name} for this experiment.`
            );


            experiment = [];

            renderPotionRoom();

            return;

        }

    }


    // --------------------------------------
    // CONSUME INGREDIENTS
    // --------------------------------------

    /*
        We change the inventory directly here
        and save once after the experiment.

        This avoids saving multiple times
        when recipes eventually use several
        different ingredients.
    */

    for (
        const ingredient
        in requiredIngredients
    ) {

        game.inventory[ingredient] -=
            requiredIngredients[
                ingredient
            ];

    }


    // --------------------------------------
    // CREATE RECIPE KEY
    // --------------------------------------

    /*
        Sorting means:

        Moonmint + Gloomcap

        is treated the same as:

        Gloomcap + Moonmint
    */

    const recipeKey =
        [...experiment]
            .sort()
            .join("+");


    // --------------------------------------
    // CHECK RECIPE
    // --------------------------------------

    let successfulRecipe = false;


    // ======================================
    // POTION OF CALM
    // ======================================

    if (
        recipeKey ===
        "moonmint+moonmint"
    ) {

        successfulRecipe = true;


        // Add potion to inventory.

        if (
            typeof game.potions.calm
            !== "number"
        ) {

            game.potions.calm = 0;

        }


        game.potions.calm++;


        // ----------------------------------
        // FIRST DISCOVERY
        // ----------------------------------

        const firstDiscovery =
            !hasDiscovered(
                "potionOfCalm"
            );


        if (firstDiscovery) {

            game.discoveries.push(
                "potionOfCalm"
            );


            showPotionResult(
                "✦ New Discovery: Potion of Calm ✦",

                "The mixture settles into a pale green draught carrying the cool scent of Moonmint. The recipe has been recorded in your Grimoire.",

                "discovery"
            );

        }


        // ----------------------------------
        // ALREADY DISCOVERED
        // ----------------------------------

        else {

            showPotionResult(
                "Potion of Calm",

                "The familiar pale green draught settles inside the bottle.",

                "success"
            );

        }

    }


    // ======================================
    // FAILED EXPERIMENT
    // ======================================

    if (!successfulRecipe) {

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


    // Update resources across this page.

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


    if (type === "discovery") {

        symbol = "✦";

    }


    if (type === "success") {

        symbol = "⚗";

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

        if (
            ingredient &&
            ingredientData[ingredient]
        ) {

            const data =
                ingredientData[
                    ingredient
                ];


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


        // ----------------------------------
        // EMPTY SLOT
        // ----------------------------------

        else {

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
        game.discoveries.length;


    if (amount === 1) {

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
