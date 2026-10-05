// ==========================================
// MOSSWOOD APOTHECARY
// Greenhouse V2
// ==========================================


// ==========================================
// BASE PLANT SETTINGS
// ==========================================

// Short times for development/testing.
// These can become much longer later.

const BASE_MOONMINT_GROW_TIME =
    60 * 1000;

const BASE_MOONMINT_DRY_TIME =
    25 * 1000;


// ==========================================
// UPGRADE MIGRATION
// ==========================================

// Older saves may not contain upgrades yet.
// Add them without resetting existing progress.

if (!game.upgrades) {

    game.upgrades = {
        expansion: 0,
        irrigation: 0,
        growth: 0
    };

}


if (
    typeof game.upgrades.expansion
    !== "number"
) {

    game.upgrades.expansion = 0;

}


if (
    typeof game.upgrades.irrigation
    !== "number"
) {

    game.upgrades.irrigation = 0;

}


if (
    typeof game.upgrades.growth
    !== "number"
) {

    game.upgrades.growth = 0;

}


// ==========================================
// GREENHOUSE EXPANSION
// ==========================================

function getRequiredPlotCount() {

    const expansionLevel =
        game.upgrades.expansion;

    // Level 0 = 4 plots
    // Level 1 = 6 plots
    // Level 2 = 8 plots
    // Level 3 = 10 plots
    // Level 4 = 12 plots

    return (
        4 +
        (
            expansionLevel * 2
        )
    );

}


function applyGreenhouseExpansion() {

    const requiredPlots =
        getRequiredPlotCount();


    if (!game.greenhouse.plots) {

        game.greenhouse.plots = [];

    }


    // Only ADD plots.
    // Never remove existing plots or plants.

    while (
        game.greenhouse.plots.length
        < requiredPlots
    ) {

        game.greenhouse.plots.push(
            null
        );

    }


    // Greenhouse level follows expansion level.

    game.greenhouse.level =
        game.upgrades.expansion + 1;

}


// Apply expansion immediately when page loads.

applyGreenhouseExpansion();

saveGame();


// ==========================================
// IRRIGATION UPGRADE
// ==========================================

function getMoonmintDryTime() {

    const irrigationLevel =
        game.upgrades.irrigation;


    // Each level keeps soil moist
    // 10% longer.

    const bonus =
        irrigationLevel * 0.10;


    return (
        BASE_MOONMINT_DRY_TIME *
        (
            1 + bonus
        )
    );

}


// ==========================================
// GROWTH UPGRADE
// ==========================================

function getMoonmintGrowTime() {

    const growthLevel =
        game.upgrades.growth;


    // Each level reduces total
    // growth time by 5%.

    const reduction =
        growthLevel * 0.05;


    return (
        BASE_MOONMINT_GROW_TIME *
        (
            1 - reduction
        )
    );

}


// ==========================================
// GREENHOUSE MESSAGE
// ==========================================

function greenhouseMessage(text) {

    const element =
        document.getElementById(
            "gameMessage"
        );


    if (element) {

        element.textContent =
            text;

    }

}


// ==========================================
// PLANT MOONMINT
// ==========================================

function plantMoonmint(index) {

    const plots =
        game.greenhouse.plots;


    // Plot already contains something.

    if (plots[index]) {
        return;
    }


    // No seeds available.

    if (
        getSeedAmount("moonmint")
        <= 0
    ) {

        greenhouseMessage(
            "You don't have any Moonmint seeds."
        );

        return;

    }


    // Remove one seed.

    game.seeds.moonmint--;


    const now =
        Date.now();


    // Create plant.

    plots[index] = {

        plant: "moonmint",

        plantedAt: now,

        lastWatered: now

    };


    greenhouseMessage(
        "You planted a Moonmint seed."
    );


    saveGame();

    renderGreenhouse();

}


// ==========================================
// WATER PLANT
// ==========================================

function waterPlant(index) {

    const plot =
        game.greenhouse.plots[index];


    if (!plot) {
        return;
    }


    plot.lastWatered =
        Date.now();


    greenhouseMessage(
        "The soil is damp again."
    );


    saveGame();

    renderGreenhouse();

}


// ==========================================
// HARVEST PLANT
// ==========================================

function harvestPlant(index) {

    const plot =
        game.greenhouse.plots[index];


    if (!plot) {
        return;
    }


    const progress =
        getGrowthProgress(
            plot
        );


    if (progress < 100) {

        greenhouseMessage(
            "This plant isn't ready yet."
        );

        return;

    }


    // --------------------------------------
    // HARVEST INGREDIENT
    // --------------------------------------

    game.inventory.moonmint++;


    // --------------------------------------
    // RETURN ONE SEED
    // --------------------------------------

    game.seeds.moonmint++;


    // --------------------------------------
    // BONUS SEED CHANCE
    // --------------------------------------

    if (
        Math.random() < 0.35
    ) {

        game.seeds.moonmint++;


        greenhouseMessage(
            "You harvested Moonmint and found an extra seed!"
        );

    }

    else {

        greenhouseMessage(
            "You harvested fresh Moonmint."
        );

    }


    // Clear plot.

    game.greenhouse.plots[index] =
        null;


    saveGame();

    renderGreenhouse();

}


// ==========================================
// GROWTH PROGRESS
// ==========================================

function getGrowthProgress(plot) {

    const elapsed =
        Date.now()
        - plot.plantedAt;


    const growTime =
        getMoonmintGrowTime();


    const progress =
        (
            elapsed /
            growTime
        ) * 100;


    return Math.min(
        100,
        progress
    );

}


// ==========================================
// CHECK SOIL
// ==========================================

function isPlantDry(plot) {

    const dryTime =
        getMoonmintDryTime();


    return (
        Date.now()
        - plot.lastWatered
        >= dryTime
    );

}


// ==========================================
// TIME REMAINING
// ==========================================

function formatGrowthTime(plot) {

    const elapsed =
        Date.now()
        - plot.plantedAt;


    const growTime =
        getMoonmintGrowTime();


    const remaining =
        Math.max(
            0,

            growTime
            - elapsed
        );


    const seconds =
        Math.ceil(
            remaining / 1000
        );


    if (seconds <= 0) {

        return "Ready to harvest";

    }


    return `${seconds}s remaining`;

}


// ==========================================
// PLANT ICON
// ==========================================

function getMoonmintIcon(
    progress
) {

    if (progress >= 100) {

        return "🌿";

    }


    if (progress >= 75) {

        return "☘️";

    }


    if (progress >= 35) {

        return "🌿";

    }


    return "🌱";

}


// ==========================================
// RENDER PLOTS
// ==========================================

function renderGreenhousePlots() {

    const container =
        document.getElementById(
            "plots"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    game.greenhouse.plots.forEach(
        (plot, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "plot";


            // ==================================
            // EMPTY PLOT
            // ==================================

            if (!plot) {

                card.innerHTML = `

                    <div class="plot-content">

                        <div class="plot-number">
                            PLOT ${index + 1}
                        </div>

                        <div class="plant-icon">
                            ◌
                        </div>

                        <h4>
                            Empty Plot
                        </h4>

                        <div class="plot-status">
                            Rich soil waits beneath the glass.
                        </div>

                    </div>


                    <div class="plot-actions">

                        <button
                            class="game-button"
                            onclick="plantMoonmint(${index})">

                            Plant Moonmint

                        </button>

                    </div>

                `;


                container.appendChild(
                    card
                );


                return;

            }


            // ==================================
            // ACTIVE PLANT
            // ==================================

            const progress =
                getGrowthProgress(
                    plot
                );


            const dry =
                isPlantDry(
                    plot
                );


            const icon =
                getMoonmintIcon(
                    progress
                );


            let status =
                formatGrowthTime(
                    plot
                );


            if (
                dry &&
                progress < 100
            ) {

                status =
                    "Soil is dry • "
                    + status;

            }


            // ----------------------------------
            // HARVEST BUTTON
            // ----------------------------------

            let actionButton;


            if (progress >= 100) {

                actionButton = `

                    <button
                        class="game-button"
                        onclick="harvestPlant(${index})">

                        Harvest

                    </button>

                `;

            }


            // ----------------------------------
            // WATER BUTTON
            // ----------------------------------

            else {

                actionButton = `

                    <button
                        class="game-button secondary"
                        onclick="waterPlant(${index})"
                        ${dry ? "" : "disabled"}>

                        ${
                            dry
                                ? "Water Plant"
                                : "Soil Moist"
                        }

                    </button>

                `;

            }


            card.innerHTML = `

                <div class="plot-content">

                    <div class="plot-number">
                        PLOT ${index + 1}
                    </div>


                    <div class="plant-icon">
                        ${icon}
                    </div>


                    <h4>
                        Moonmint
                    </h4>


                    <div class="plot-status">
                        ${status}
                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-bar"
                            style="
                                width:
                                ${progress}%;
                            ">
                        </div>

                    </div>

                </div>


                <div class="plot-actions">

                    ${actionButton}

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// RENDER GREENHOUSE INFORMATION
// ==========================================

function renderGreenhouseInfo() {

    // --------------------------------------
    // SEEDS
    // --------------------------------------

    const seedElement =
        document.getElementById(
            "moonmintSeeds"
        );


    if (seedElement) {

        seedElement.textContent =
            getSeedAmount(
                "moonmint"
            );

    }


    // --------------------------------------
    // MOONMINT INVENTORY
    // --------------------------------------

    const inventoryElement =
        document.getElementById(
            "moonmintInventory"
        );


    if (inventoryElement) {

        inventoryElement.textContent =
            getIngredientAmount(
                "moonmint"
            );

    }


    // --------------------------------------
    // GREENHOUSE LEVEL
    // --------------------------------------

    const levelElement =
        document.getElementById(
            "greenhouseLevel"
        );


    if (levelElement) {

        levelElement.textContent =
            game.greenhouse.level;

    }

}


// ==========================================
// RENDER GREENHOUSE
// ==========================================

function renderGreenhouse() {

    // Make sure newly purchased expansion
    // levels are reflected in the plots.

    applyGreenhouseExpansion();


    updateResourceBar();

    renderGreenhouseInfo();

    renderGreenhousePlots();

}


// ==========================================
// GAME LOOP
// ==========================================

renderGreenhouse();


setInterval(
    renderGreenhouse,
    1000
);
