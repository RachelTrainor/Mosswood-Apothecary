// ==========================================
// MOSSWOOD APOTHECARY
// Greenhouse V1
// ==========================================

const SAVE_KEY = "mosswoodSave";

const MOONMINT_GROW_TIME = 60 * 1000;
const MOONMINT_DRY_TIME = 25 * 1000;


// ------------------------------------------
// DEFAULT GAME
// ------------------------------------------

const defaultGame = {

    coins: 100,

    potions: 0,

    inventory: {
        moonmint: 0
    },

    seeds: {
        moonmint: 3
    },

    plots: [
        null,
        null,
        null,
        null
    ]

};


// ------------------------------------------
// LOAD SAVE
// ------------------------------------------

function loadGame() {

    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) {

        return JSON.parse(
            JSON.stringify(defaultGame)
        );

    }

    try {

        const data = JSON.parse(saved);

        return {
            ...JSON.parse(JSON.stringify(defaultGame)),
            ...data
        };

    } catch {

        return JSON.parse(
            JSON.stringify(defaultGame)
        );

    }

}


let game = loadGame();


// ------------------------------------------
// SAVE
// ------------------------------------------

function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );

}


// ------------------------------------------
// MESSAGE
// ------------------------------------------

function message(text) {

    document.getElementById(
        "gameMessage"
    ).textContent = text;

}


// ------------------------------------------
// PLANT
// ------------------------------------------

function plantMoonmint(index) {

    if (game.plots[index]) {
        return;
    }

    if (game.seeds.moonmint <= 0) {

        message(
            "You don't have any Moonmint seeds."
        );

        return;

    }

    game.seeds.moonmint--;

    const now = Date.now();

    game.plots[index] = {

        plant: "moonmint",

        plantedAt: now,

        lastWatered: now

    };

    message(
        "You planted a Moonmint seed."
    );

    saveGame();

    render();

}


// ------------------------------------------
// WATER
// ------------------------------------------

function waterPlant(index) {

    const plot = game.plots[index];

    if (!plot) {
        return;
    }

    plot.lastWatered = Date.now();

    message(
        "The soil is damp again."
    );

    saveGame();

    render();

}


// ------------------------------------------
// HARVEST
// ------------------------------------------

function harvestPlant(index) {

    const plot = game.plots[index];

    if (!plot) {
        return;
    }

    const progress = getGrowthProgress(plot);

    if (progress < 100) {

        message(
            "This plant isn't ready yet."
        );

        return;

    }

    game.inventory.moonmint++;

    // Harvesting always returns one seed.
    game.seeds.moonmint++;

    // Small chance for a bonus seed.
    if (Math.random() < 0.35) {

        game.seeds.moonmint++;

        message(
            "You harvested Moonmint and found an extra seed!"
        );

    } else {

        message(
            "You harvested fresh Moonmint."
        );

    }

    game.plots[index] = null;

    saveGame();

    render();

}


// ------------------------------------------
// GROWTH
// ------------------------------------------

function getGrowthProgress(plot) {

    const elapsed =
        Date.now() - plot.plantedAt;

    return Math.min(
        100,
        (elapsed / MOONMINT_GROW_TIME) * 100
    );

}


function isDry(plot) {

    return (
        Date.now() - plot.lastWatered
        >= MOONMINT_DRY_TIME
    );

}


function formatRemaining(plot) {

    const elapsed =
        Date.now() - plot.plantedAt;

    const remaining =
        Math.max(
            0,
            MOONMINT_GROW_TIME - elapsed
        );

    const seconds =
        Math.ceil(remaining / 1000);

    if (seconds <= 0) {
        return "Ready to harvest";
    }

    return `${seconds}s remaining`;

}


// ------------------------------------------
// RENDER PLOTS
// ------------------------------------------

function renderPlots() {

    const container =
        document.getElementById("plots");

    container.innerHTML = "";

    game.plots.forEach(
        (plot, index) => {

            const card =
                document.createElement("div");

            card.className = "plot";


            // EMPTY PLOT

            if (!plot) {

                card.innerHTML = `

                    <div class="plot-content">

                        <div class="plot-number">
                            PLOT ${index + 1}
                        </div>

                        <div class="plant-icon">
                            ◌
                        </div>

                        <h4>Empty Plot</h4>

                        <div class="plot-status">
                            Rich soil waits beneath the glass.
                        </div>

                    </div>

                    <div class="plot-actions">

                        <button
                            class="game-button"
                            onclick="plantMoonmint(${index})"
                        >
                            Plant Moonmint
                        </button>

                    </div>

                `;

            }


            // ACTIVE PLANT

            else {

                const progress =
                    getGrowthProgress(plot);

                const dry =
                    isDry(plot);

                let plantIcon = "🌱";

                if (progress >= 35) {
                    plantIcon = "🌿";
                }

                if (progress >= 75) {
                    plantIcon = "☘️";
                }

                if (progress >= 100) {
                    plantIcon = "🌿";
                }


                let status =
                    formatRemaining(plot);

                if (
                    dry &&
                    progress < 100
                ) {

                    status =
                        "Soil is dry • " +
                        status;

                }


                card.innerHTML = `

                    <div class="plot-content">

                        <div class="plot-number">
                            PLOT ${index + 1}
                        </div>

                        <div class="plant-icon">
                            ${plantIcon}
                        </div>

                        <h4>Moonmint</h4>

                        <div class="plot-status">
                            ${status}
                        </div>

                        <div class="progress-track">

                            <div
                                class="progress-bar"
                                style="width:
                                ${progress}%"
                            >
                            </div>

                        </div>

                    </div>


                    <div class="plot-actions">

                        ${
                            progress >= 100

                            ?

                            `
                            <button
                                class="game-button"
                                onclick="harvestPlant(${index})"
                            >
                                Harvest
                            </button>
                            `

                            :

                            `
                            <button
                                class="game-button secondary"
                                onclick="waterPlant(${index})"
                                ${dry ? "" : "disabled"}
                            >
                                ${
                                    dry
                                    ? "Water Plant"
                                    : "Soil Moist"
                                }
                            </button>
                            `
                        }

                    </div>

                `;

            }


            container.appendChild(card);

        }
    );

}


// ------------------------------------------
// RESOURCES
// ------------------------------------------

function renderResources() {

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
        game.potions;


    document.getElementById(
        "moonmintSeeds"
    ).textContent =
        game.seeds.moonmint;


    document.getElementById(
        "moonmintInventory"
    ).textContent =
        game.inventory.moonmint;

}


// ------------------------------------------
// MAIN RENDER
// ------------------------------------------

function render() {

    renderResources();

    renderPlots();

}


// ------------------------------------------
// GAME LOOP
// ------------------------------------------

render();

setInterval(
    render,
    1000
);
