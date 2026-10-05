// ==========================================
// MOSSWOOD APOTHECARY
// Greenhouse V5
// Dynamic Planting Materials
// Generic Plants + Mystery Seeds
// ==========================================


// ==========================================
// UPGRADE SAFETY
// ==========================================

if (!game.upgrades) {

    game.upgrades = {
        expansion: 0,
        irrigation: 0,
        growth: 0
    };

}

if (typeof game.upgrades.expansion !== "number") {
    game.upgrades.expansion = 0;
}

if (typeof game.upgrades.irrigation !== "number") {
    game.upgrades.irrigation = 0;
}

if (typeof game.upgrades.growth !== "number") {
    game.upgrades.growth = 0;
}


// ==========================================
// GREENHOUSE SAFETY
// ==========================================

if (!game.greenhouse) {

    game.greenhouse = {
        level: 1,
        plots: []
    };

}

if (!Array.isArray(game.greenhouse.plots)) {
    game.greenhouse.plots = [];
}


// ==========================================
// GREENHOUSE EXPANSION
// ==========================================

function getRequiredPlotCount() {

    return (
        4 +
        (game.upgrades.expansion * 2)
    );

}


function applyGreenhouseExpansion() {

    const requiredPlots =
        getRequiredPlotCount();

    while (
        game.greenhouse.plots.length <
        requiredPlots
    ) {

        game.greenhouse.plots.push(
            null
        );

    }

    game.greenhouse.level =
        game.upgrades.expansion + 1;

}


applyGreenhouseExpansion();


// ==========================================
// PLANT DATA FOR A PLOT
// ==========================================

function getPlotPlantData(
    plot
) {

    if (!plot) {
        return null;
    }


    if (
        plot.plant === "unknown"
    ) {

        if (
            plot.revealsPlant
        ) {

            return getPlantData(
                plot.revealsPlant
            );

        }


        // Old mystery plants were Nightbell.
        return getPlantData(
            "nightbell"
        );

    }


    return getPlantData(
        plot.plant
    );

}


// ==========================================
// OLD PLOT MIGRATION
// ==========================================

game.greenhouse.plots.forEach(
    plot => {

        if (!plot) {
            return;
        }


        if (
            plot.plant === "unknown" &&
            !plot.revealsPlant
        ) {

            plot.revealsPlant =
                "nightbell";

        }


        const now =
            Date.now();


        if (
            typeof plot.lastWatered !==
            "number"
        ) {

            plot.lastWatered =
                plot.plantedAt || now;

        }


        if (
            typeof plot.growthTime !==
            "number"
        ) {

            const plantedAt =
                plot.plantedAt || now;


            const plantData =
                getPlotPlantData(
                    plot
                );


            const baseDryTime =
                plantData
                    ? plantData.dryTime
                    : 25 * 1000;


            const irrigationBonus =
                game.upgrades.irrigation *
                0.10;


            const dryTime =
                baseDryTime *
                (1 + irrigationBonus);


            const hydratedUntil =
                plot.lastWatered +
                dryTime;


            const activeUntil =
                Math.min(
                    now,
                    hydratedUntil
                );


            plot.growthTime =
                Math.max(
                    0,
                    activeUntil -
                    plantedAt
                );

        }


        if (
            typeof plot.lastGrowthUpdate !==
            "number"
        ) {

            plot.lastGrowthUpdate =
                now;

        }

    }
);


saveGame();


// ==========================================
// UPGRADE EFFECTS
// ==========================================

function getDryTime(
    plot
) {

    const plant =
        getPlotPlantData(
            plot
        );


    const baseDryTime =
        plant &&
        typeof plant.dryTime === "number"

            ? plant.dryTime

            : 25 * 1000;


    const bonus =
        game.upgrades.irrigation *
        0.10;


    return (
        baseDryTime *
        (1 + bonus)
    );

}


function getPlantGrowTime(
    plot
) {

    const plant =
        getPlotPlantData(
            plot
        );


    const baseTime =
        plant &&
        typeof plant.growTime === "number"

            ? plant.growTime

            : 60 * 1000;


    const reduction =
        game.upgrades.growth *
        0.05;


    return (
        baseTime *
        (1 - reduction)
    );

}


// ==========================================
// GREENHOUSE MESSAGE
// ==========================================

function greenhouseMessage(
    text
) {

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
// SOIL / GROWTH
// ==========================================

function isPlantDry(
    plot
) {

    return (
        Date.now() -
        plot.lastWatered >=
        getDryTime(plot)
    );

}


function updatePlantGrowth(
    plot
) {

    if (!plot) {
        return;
    }


    const now =
        Date.now();


    if (
        typeof plot.growthTime !==
        "number"
    ) {

        plot.growthTime = 0;

    }


    if (
        typeof plot.lastGrowthUpdate !==
        "number"
    ) {

        plot.lastGrowthUpdate =
            now;

    }


    const previousUpdate =
        plot.lastGrowthUpdate;


    const hydratedUntil =
        plot.lastWatered +
        getDryTime(plot);


    const growthEnd =
        Math.min(
            now,
            hydratedUntil
        );


    if (
        growthEnd >
        previousUpdate
    ) {

        plot.growthTime +=
            growthEnd -
            previousUpdate;

    }


    plot.lastGrowthUpdate =
        now;

}


// ==========================================
// GROWTH PROGRESS
// ==========================================

function getGrowthProgress(
    plot
) {

    updatePlantGrowth(
        plot
    );


    const growTime =
        getPlantGrowTime(
            plot
        );


    return Math.min(
        100,
        (
            plot.growthTime /
            growTime
        ) * 100
    );

}


// ==========================================
// TIME REMAINING
// ==========================================

function formatGrowthTime(
    plot
) {

    updatePlantGrowth(
        plot
    );


    const growTime =
        getPlantGrowTime(
            plot
        );


    const remaining =
        Math.max(
            0,
            growTime -
            plot.growthTime
        );


    if (
        remaining <= 0
    ) {

        return "Ready to harvest";

    }


    const seconds =
        Math.ceil(
            remaining / 1000
        );


    if (
        isPlantDry(
            plot
        )
    ) {

        return (
            `Growth paused • ${seconds}s remaining`
        );

    }


    return (
        `${seconds}s remaining`
    );

}


// ==========================================
// PLANTING MENU
// ==========================================

let selectedPlantPlot =
    null;


function openSeedMenu(
    index
) {

    selectedPlantPlot =
        index;

    renderGreenhouse();

}


function closeSeedMenu() {

    selectedPlantPlot =
        null;

    renderGreenhouse();

}


// ==========================================
// CAN SHOW PLANTING MATERIAL
// ==========================================

function canDisplayPlantSeed(
    plant
) {

    if (
        plant.alwaysKnown
    ) {

        return true;

    }


    if (
        isPlantKnown(
            plant.id
        )
    ) {

        return true;

    }


    return (
        getSeedAmount(
            plant.id
        ) > 0
    );

}


// ==========================================
// PLANT NORMAL MATERIAL
// ==========================================

function plantNormalSeed(
    index,
    plantId
) {

    const plots =
        game.greenhouse.plots;


    if (
        plots[index]
    ) {

        return;

    }


    const plant =
        getPlantData(
            plantId
        );


    if (!plant) {

        greenhouseMessage(
            "That planting material cannot be used."
        );

        return;

    }


    if (
        getSeedAmount(
            plantId
        ) <= 0
    ) {

        greenhouseMessage(
            `You don't have any ${getPlantingItemName(
                plantId,
                2
            )}.`
        );

        return;

    }


    const removed =
        removeSeeds(
            plantId,
            1
        );


    if (!removed) {
        return;
    }


    const now =
        Date.now();


    plots[index] = {

        plant:
            plantId,

        plantedAt:
            now,

        lastWatered:
            now,

        lastGrowthUpdate:
            now,

        growthTime:
            0

    };


    selectedPlantPlot =
        null;


    greenhouseMessage(
        `You planted a ${getPlantingItemName(
            plantId,
            1
        )}.`
    );


    saveGame();

    renderGreenhouse();

}


// ==========================================
// PLANT MYSTERY SEED
// ==========================================

function plantMysterySeed(
    index
) {

    const plots =
        game.greenhouse.plots;


    if (
        plots[index]
    ) {

        return;

    }


    if (
        getMysterySeedAmount() <=
        0
    ) {

        greenhouseMessage(
            "You don't have any Strange Seeds."
        );

        return;

    }


    const mysterySeed =
        takeMysterySeed();


    if (!mysterySeed) {

        greenhouseMessage(
            "You don't have any Strange Seeds."
        );

        return;

    }


    const hiddenPlant =
        getPlantData(
            mysterySeed.revealsPlant
        );


    if (!hiddenPlant) {

        game.mysterySeeds.unshift(
            mysterySeed
        );


        saveGame();


        greenhouseMessage(
            "Something is wrong with this Strange Seed."
        );

        return;

    }


    const now =
        Date.now();


    plots[index] = {

        plant:
            "unknown",

        revealsPlant:
            mysterySeed.revealsPlant,

        plantedAt:
            now,

        lastWatered:
            now,

        lastGrowthUpdate:
            now,

        growthTime:
            0

    };


    selectedPlantPlot =
        null;


    greenhouseMessage(
        "You planted the Strange Seed. Something unfamiliar begins to take root."
    );


    saveGame();

    renderGreenhouse();

}


// ==========================================
// PLANT MATERIAL
// ==========================================
//
// Function name stays plantSeed()
// for compatibility with existing code.
// ==========================================

function plantSeed(
    index,
    seedType
) {

    if (
        seedType === "unknown"
    ) {

        plantMysterySeed(
            index
        );

        return;

    }


    plantNormalSeed(
        index,
        seedType
    );

}


// ==========================================
// WATER PLANT
// ==========================================

function waterPlant(
    index
) {

    const plot =
        game.greenhouse.plots[index];


    if (!plot) {
        return;
    }


    updatePlantGrowth(
        plot
    );


    const now =
        Date.now();


    plot.lastWatered =
        now;


    plot.lastGrowthUpdate =
        now;


    greenhouseMessage(
        "The soil is damp again. Growth resumes."
    );


    saveGame();

    renderGreenhouse();

}


// ==========================================
// HARVEST NORMAL PLANT
// ==========================================

function harvestNormalPlant(
    plot
) {

    const plant =
        getPlantData(
            plot.plant
        );


    if (!plant) {

        greenhouseMessage(
            "This plant could not be identified."
        );

        return false;

    }


    addIngredient(
        plant.id,
        1
    );


    let discoveredNow =
        false;


    if (
        !plant.alwaysKnown &&
        !isPlantKnown(
            plant.id
        )
    ) {

        addDiscovery(
            plant.id
        );

        discoveredNow =
            true;

    }


    const foundSeed =
        Math.random() <
        (
            plant.seedReturnChance ||
            0
        );


    if (
        foundSeed
    ) {

        addSeeds(
            plant.id,
            1
        );

    }


    const recoveredItem =
        getPlantingItemName(
            plant.id,
            1
        );


    if (
        discoveredNow
    ) {

        if (
            foundSeed
        ) {

            greenhouseMessage(
                `Discovery! You identified ${plant.name} and recovered a ${recoveredItem}.`
            );

        }

        else {

            greenhouseMessage(
                `Discovery! You identified ${plant.name}.`
            );

        }

    }

    else if (
        foundSeed
    ) {

        greenhouseMessage(
            `You harvested ${plant.name} and recovered a ${recoveredItem}.`
        );

    }

    else {

        greenhouseMessage(
            `You harvested ${plant.name}.`
        );

    }


    return true;

}


// ==========================================
// HARVEST MYSTERY PLANT
// ==========================================

function harvestMysteryPlant(
    plot
) {

    const revealedPlantId =
        plot.revealsPlant;


    const plant =
        getPlantData(
            revealedPlantId
        );


    if (!plant) {

        greenhouseMessage(
            "The unfamiliar plant could not be identified."
        );

        return false;

    }


    addIngredient(
        plant.id,
        1
    );


    const alreadyKnown =
        isPlantKnown(
            plant.id
        );


    if (
        !alreadyKnown
    ) {

        addDiscovery(
            plant.id
        );

    }


    const foundSeed =
        Math.random() <
        (
            plant.seedReturnChance ||
            0
        );


    if (
        foundSeed
    ) {

        addSeeds(
            plant.id,
            1
        );

    }


    const recoveredItem =
        getPlantingItemName(
            plant.id,
            1
        );


    if (
        !alreadyKnown
    ) {

        if (
            foundSeed
        ) {

            greenhouseMessage(
                `Discovery! The Strange Seed has revealed ${plant.name}. You also recovered a ${recoveredItem}.`
            );

        }

        else {

            greenhouseMessage(
                `Discovery! The Strange Seed has revealed ${plant.name}.`
            );

        }

    }

    else if (
        foundSeed
    ) {

        greenhouseMessage(
            `The Strange Seed grew into ${plant.name}. You recovered a ${recoveredItem}.`
        );

    }

    else {

        greenhouseMessage(
            `The Strange Seed grew into ${plant.name}.`
        );

    }


    return true;

}


// ==========================================
// HARVEST PLANT
// ==========================================

function harvestPlant(
    index
) {

    const plot =
        game.greenhouse.plots[index];


    if (!plot) {
        return;
    }


    const progress =
        getGrowthProgress(
            plot
        );


    if (
        progress < 100
    ) {

        greenhouseMessage(
            "This plant isn't ready yet."
        );

        return;

    }


    let harvested =
        false;


    if (
        plot.plant === "unknown"
    ) {

        harvested =
            harvestMysteryPlant(
                plot
            );

    }

    else {

        harvested =
            harvestNormalPlant(
                plot
            );

    }


    if (!harvested) {
        return;
    }


    game.greenhouse.plots[index] =
        null;


    saveGame();

    renderGreenhouse();

}


// ==========================================
// PLANT ICON
// ==========================================

function getGreenhousePlantIcon(
    plot,
    progress
) {

    // Mystery plant stays visually unknown.

    if (
        plot.plant === "unknown"
    ) {

        if (
            progress >= 75
        ) {

            return "🌿";

        }


        if (
            progress >= 35
        ) {

            return "☘️";

        }


        return "🌱";

    }


    const plant =
        getPlantData(
            plot.plant
        );


    if (!plant) {

        return "❔";

    }


    if (
        progress >= 100
    ) {

        return plant.icon;

    }


    if (
        progress >= 65
    ) {

        return "🌿";

    }


    if (
        progress >= 30
    ) {

        return "☘️";

    }


    return "🌱";

}


// ==========================================
// PLANT DISPLAY NAME
// ==========================================

function getGreenhousePlantName(
    plot
) {

    if (
        plot.plant === "unknown"
    ) {

        return "Unknown Plant";

    }


    const plant =
        getPlantData(
            plot.plant
        );


    if (!plant) {

        return "Unknown Plant";

    }


    return plant.name;

}


// ==========================================
// NORMAL PLANTING CHOICE HTML
// ==========================================

function createNormalSeedChoiceHTML(
    index,
    plant
) {

    const seedAmount =
        getSeedAmount(
            plant.id
        );


    const plantingName =
        getPlantingItemName(
            plant.id,
            1
        );


    const plantingCountName =
        getPlantingItemGenericName(
            plant.id,
            seedAmount
        );


    const plantingIcon =
        getPlantingItemIcon(
            plant.id
        );


    return `

        <button
            class="seed-choice"
            onclick="plantSeed(${index}, '${plant.id}')"
            ${seedAmount <= 0 ? "disabled" : ""}>

            <span class="seed-choice-icon">
                ${plantingIcon}
            </span>

            <span>

                <strong>
                    ${plantingName}
                </strong>

                <small>
                    ${seedAmount} ${plantingCountName}
                </small>

            </span>

        </button>

    `;

}


// ==========================================
// PLANTING SELECTION HTML
// ==========================================

function getSeedMenuHTML(
    index
) {

    let normalSeedChoices =
        "";


    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            if (
                !canDisplayPlantSeed(
                    plant
                )
            ) {

                return;

            }


            normalSeedChoices +=
                createNormalSeedChoiceHTML(
                    index,
                    plant
                );

        }
    );


    const mysterySeedAmount =
        getMysterySeedAmount();


    const specialSeed =
        getSpecialSeedData(
            "unknown"
        );


    const mysteryIcon =
        specialSeed
            ? specialSeed.icon
            : "✦";


    const mysteryName =
        specialSeed
            ? specialSeed.name
            : "Strange Seed";


    let mysterySeedChoice =
        "";


    if (
        mysterySeedAmount > 0
    ) {

        mysterySeedChoice = `

            <button
                class="seed-choice strange-seed-choice"
                onclick="plantSeed(${index}, 'unknown')">

                <span class="seed-choice-icon">
                    ${mysteryIcon}
                </span>

                <span>

                    <strong>
                        ${mysteryName}
                    </strong>

                    <small>
                        ${mysterySeedAmount}
                        ${
                            mysterySeedAmount === 1
                                ? "seed"
                                : "seeds"
                        }
                    </small>

                </span>

            </button>

        `;

    }


    return `

        <div class="seed-menu">

            <div class="seed-menu-title">
                Choose Planting Material
            </div>


            ${normalSeedChoices}

            ${mysterySeedChoice}


            <button
                class="seed-menu-cancel"
                onclick="closeSeedMenu()">

                Cancel

            </button>

        </div>

    `;

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


    container.innerHTML =
        "";


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

                let actions;


                if (
                    selectedPlantPlot ===
                    index
                ) {

                    actions =
                        getSeedMenuHTML(
                            index
                        );

                }

                else {

                    actions = `

                        <button
                            class="game-button"
                            onclick="openSeedMenu(${index})">

                            Choose Plant

                        </button>

                    `;

                }


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

                        ${actions}

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
                getGreenhousePlantIcon(
                    plot,
                    progress
                );


            const plantName =
                getGreenhousePlantName(
                    plot
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
                    "Soil is dry • " +
                    status;

            }


            let actionButton;


            if (
                progress >= 100
            ) {

                actionButton = `

                    <button
                        class="game-button"
                        onclick="harvestPlant(${index})">

                        Harvest

                    </button>

                `;

            }

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
                        ${plantName}
                    </h4>


                    <div class="plot-status">
                        ${status}
                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-bar"
                            style="width: ${progress}%;">
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
// GREENHOUSE INFORMATION
// ==========================================

function renderGreenhouseInfo() {

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
    function () {

        renderGreenhouse();

        saveGame();

    },

    1000
);
