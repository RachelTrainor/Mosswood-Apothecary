// ==========================================
// MOSSWOOD APOTHECARY
// Potion Room V1
// ==========================================

const SAVE_KEY = "mosswoodSave";

let experiment = [];


// ==========================================
// LOAD GAME
// ==========================================

function loadGame() {

    const saved = localStorage.getItem(SAVE_KEY);

    let game;

    if (saved) {

        try {
            game = JSON.parse(saved);
        }

        catch {
            game = {};
        }

    } else {

        game = {};

    }


    // Make sure older saves contain
    // the new Potion Room data.

    if (typeof game.coins !== "number") {
        game.coins = 0;
    }


    if (!game.inventory) {

        game.inventory = {
            moonmint: 0
        };

    }


    if (typeof game.inventory.moonmint !== "number") {
        game.inventory.moonmint = 0;
    }


    /*
        Older Greenhouse saves stored
        potions as a number.

        Convert that into the new
        potion inventory system.
    */

    if (
        !game.potions ||
        typeof game.potions !== "object"
    ) {

        game.potions = {
            calm: 0
        };

    }


    if (typeof game.potions.calm !== "number") {
        game.potions.calm = 0;
    }


    if (!Array.isArray(game.discoveries)) {
        game.discoveries = [];
    }


    saveGame(game);

    return game;
}


let game = loadGame();


// ==========================================
// SAVE GAME
// ==========================================

function saveGame(data = game) {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );

}


// ==========================================
// ADD INGREDIENT
// ==========================================

function addMoonmint() {

    if (experiment.length >= 3) {

        showResult(
            "The cauldron is full.",
            "You can only experiment with three ingredients at a time."
        );

        return;
    }


    const selectedMoonmint =
        experiment.filter(
            ingredient =>
                ingredient === "moonmint"
        ).length;


    if (
        selectedMoonmint >=
        game.inventory.moonmint
    ) {

        showResult(
            "Nothing left on the shelf.",
            "You don't have any more Moonmint available."
        );

        return;
    }


    experiment.push("moonmint");

    render();
}


// ==========================================
// REMOVE INGREDIENT
// ==========================================

function removeIngredient(index) {

    experiment.splice(index, 1);

    render();
}


// ==========================================
// CLEAR
// ==========================================

function clearExperiment() {

    experiment = [];

    render();


    showResult(
        "The cauldron has been cleared.",
        "Your unused ingredients were returned to the shelf."
    );

}


// ==========================================
// BREW
// ==========================================

function brewExperiment() {

    if (experiment.length === 0) {

        showResult(
            "The cauldron is empty.",
            "Add at least one ingredient before experimenting."
        );

        return;
    }


    const moonmintNeeded =
        experiment.filter(
            ingredient =>
                ingredient === "moonmint"
        ).length;


    if (
        game.inventory.moonmint <
        moonmintNeeded
    ) {

        showResult(
            "Something is missing.",
            "You no longer have enough Moonmint for this experiment."
        );

        experiment = [];

        render();

        return;
    }


    // Ingredients are consumed when brewing.

    game.inventory.moonmint -=
        moonmintNeeded;


    const recipe =
        [...experiment]
            .sort()
            .join("+");


    // ======================================
    // SECRET RECIPE
    // ======================================

    if (
        recipe ===
        "moonmint+moonmint"
    ) {

        game.potions.calm++;


        const alreadyDiscovered =
            game.discoveries.includes(
                "potionOfCalm"
            );


        if (!alreadyDiscovered) {

            game.discoveries.push(
                "potionOfCalm"
            );


            showResult(
                "✦ New Discovery: Potion of Calm ✦",
                "The mixture settles into a pale green draught carrying the cool scent of Moonmint. The recipe has been recorded in your Grimoire.",
                "discovery"
            );

        }

        else {

            showResult(
                "Potion of Calm",
                "The familiar pale green draught settles inside the bottle.",
                "success"
            );

        }

    }


    // ======================================
    // FAILED EXPERIMENT
    // ======================================

    else {

        showResult(
            "Failed Experiment",
            "The mixture bubbles hopefully for a moment before fading into a murky, useless liquid.",
            "failure"
        );

    }


    experiment = [];

    saveGame();

    render();
}


// ==========================================
// RESULT
// ==========================================

function showResult(
    title,
    description,
    type = ""
) {

    const result =
        document.getElementById(
            "experimentResult"
        );


    result.className =
        "experiment-result";


    if (type) {
        result.classList.add(type);
    }


    result.innerHTML = `

        <span class="result-symbol">
            ${
                type === "discovery"
                    ? "✦"
                    : "☾"
            }
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
// RENDER SLOTS
// ==========================================

function renderSlots() {

    const container =
        document.getElementById(
            "ingredientSlots"
        );


    container.innerHTML = "";


    for (let i = 0; i < 3; i++) {

        const slot =
            document.createElement("button");


        const ingredient =
            experiment[i];


        if (ingredient === "moonmint") {

            slot.className =
                "ingredient-slot filled";


            slot.innerHTML = `

                <span class="slot-plant">
                    🌿
                </span>

                <strong>
                    Moonmint
                </strong>

                <small>
                    Remove
                </small>

            `;


            slot.addEventListener(
                "click",
                () => removeIngredient(i)
            );

        }

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


        container.appendChild(slot);

    }

}


// ==========================================
// RESOURCE BAR
// ==========================================

function renderResources() {

    const totalPotions =
        Object.values(game.potions)
            .reduce(
                (total, amount) =>
                    total + amount,
                0
            );


    document.getElementById(
        "coins"
    ).textContent =
        game.coins;


    document.getElementById(
        "plants"
    ).textContent =
        game.inventory.moonmint;


    document.getElementById(
        "potions"
    ).textContent =
        totalPotions;


    document.getElementById(
        "moonmintAvailable"
    ).textContent =
        game.inventory.moonmint;


    const discovered =
        game.discoveries.length;


    document.getElementById(
        "recipeCount"
    ).textContent =
        discovered === 1
            ? "1 recipe discovered"
            : `${discovered} recipes discovered`;

}


// ==========================================
// RENDER
// ==========================================

function render() {

    renderResources();

    renderSlots();

}


// ==========================================
// BUTTONS
// ==========================================

document
    .getElementById("addMoonmint")
    .addEventListener(
        "click",
        addMoonmint
    );


document
    .getElementById("brewButton")
    .addEventListener(
        "click",
        brewExperiment
    );


document
    .getElementById("clearButton")
    .addEventListener(
        "click",
        clearExperiment
    );


// ==========================================
// START
// ==========================================

render();
