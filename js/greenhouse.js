// ==========================================
// MOSSWOOD APOTHECARY
// Greenhouse V3
// ==========================================


// ==========================================
// BASE PLANT SETTINGS
// ==========================================

const BASE_MOONMINT_GROW_TIME =
    60 * 1000;

const BASE_NIGHTBELL_GROW_TIME =
    75 * 1000;

const BASE_DRY_TIME =
    25 * 1000;


// ==========================================
// UPGRADE MIGRATION
// ==========================================

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
// NEW INVENTORY MIGRATION
// ==========================================

if (
    typeof game.inventory.nightbell
    !== "number"
) {

    game.inventory.nightbell = 0;

}

if (
    typeof game.seeds.unknown
    !== "number"
) {

    game.seeds.unknown = 0;

}

if (
    typeof game.seeds.nightbell
    !== "number"
) {

    game.seeds.nightbell = 0;

}


// ==========================================
// GREENHOUSE EXPANSION
// ==========================================

function getRequiredPlotCount() {

    return (
        4 +
        (
            game.upgrades.expansion * 2
        )
    );

}


function applyGreenhouseExpansion() {

    const requiredPlots =
        getRequiredPlotCount();


    if (!game.greenhouse.plots) {

        game.greenhouse.plots = [];

    }


    while (
        game.greenhouse.plots.length
        < requiredPlots
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
// OLD PLANT SAVE MIGRATION
// ==========================================

game.greenhouse.plots.forEach(
    (plot) => {

        if (!plot) {
            return;
        }


        // V2 plants used plantedAt.
        // Convert them into the new
        // accumulated-growth system.

        if (
            typeof plot.growthTime
            !== "number"
        ) {

            const now =
                Date.now();


            const plantedAt =
                plot.plantedAt || now;


            const lastWatered =
                plot.lastWatered || plantedAt;


            const dryTime =
                getDryTime();


            const hydratedUntil =
                lastWatered + dryTime;


            const activeUntil =
                Math.min(
                    now,
                    hydratedUntil
                );


            plot.growthTime =
                Math.max(
                    0,
                    activeUntil - plantedAt
                );

        }


        if (
            typeof plot.lastGrowthUpdate
            !== "number"
        ) {

            plot.lastGrowthUpdate =
                Date.now();

        }


        if (
            typeof plot.lastWatered
            !== "number"
        ) {

            plot.lastWatered =
                Date.now();

        }

    }
);


saveGame();


// ==========================================
// UPGRADE EFFECTS
// ==========================================

function getDryTime() {

    const bonus =
        game.upgrades.irrigation
        * 0.10;


    return (
        BASE_DRY_TIME *
        (
            1 + bonus
        )
    );

}


function getPlantGrowTime(
    plant
) {

    let baseTime =
        BASE_MOONMINT_GROW_TIME;


    if (
        plant === "nightbell"
        ||
        plant === "unknown"
    ) {

        baseTime =
            BASE_NIGHTBELL_GROW_TIME;

    }


    const reduction =
        game.upgrades.growth
        * 0.05;


    return (
        baseTime *
        (
            1 - reduction
        )
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
        Date.now()
        - plot.lastWatered
        >= getDryTime()
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
        typeof plot.growthTime
        !== "number"
    ) {

        plot.growthTime = 0;

    }


    if (
        typeof plot.lastGrowthUpdate
        !== "number"
    ) {

        plot.lastGrowthUpdate =
            now;

    }


    const previousUpdate =
        plot.lastGrowthUpdate;


    const hydratedUntil =
        plot.lastWatered
        + getDryTime();


    // Growth can only accumulate until
    // the moment the soil became dry.

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
            growthEnd
            - previousUpdate;

    }


    plot.lastGrowthUpdate =
        now;

}


function getGrowthProgress(
    plot
) {

    updatePlantGrowth(
        plot
    );


    const growTime =
        getPlantGrowTime(
            plot.plant
        );


    return Math.min(
        100,

        (
            plot.growthTime
            /
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
            plot.plant
        );


    const remaining =
        Math.max(
            0,
            growTime
            - plot.growthTime
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
        isPlantDry(plot)
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
// SEED MENU
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
// PLANT SEED
// ==========================================

function plantSeed(
    index,
    seedType
) {

    const plots =
        game.greenhouse.plots;


    if (
        plots[index]
    ) {

        return;

    }


    let plantType =
        seedType;


    // --------------------------------------
    // MOONMINT
    // --------------------------------------

    if (
        seedType === "moonmint"
    ) {

        if (
            getSeedAmount(
                "moonmint"
            ) <= 0
        ) {

            greenhouseMessage(
                "You don't have any Moonmint seeds."
            );

            return;

        }


        game.seeds.moonmint--;

    }


    // --------------------------------------
    // STRANGE SEED
    // --------------------------------------

    else if (
        seedType === "unknown"
    ) {

        if (
            getSeedAmount(
                "unknown"
            ) <= 0
        ) {

            greenhouseMessage(
                "You don't have any Strange Seeds."
            );

            return;

        }


        game.seeds.unknown--;


        plantType =
            "unknown";

    }


    // --------------------------------------
    // NIGHTBELL
    // --------------------------------------

    else if (
        seedType === "nightbell"
    ) {

        if (
            getSeedAmount(
                "nightbell"
            ) <= 0
        ) {

            greenhouseMessage(
                "You don't have any Nightbell seeds."
            );

            return;

        }


        game.seeds.nightbell--;

    }


    else {

        return;

    }


    const now =
        Date.now();


    plots[index] = {

        plant:
            plantType,

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


    if (
        seedType === "unknown"
    ) {

        greenhouseMessage(
            "You planted the Strange Seed. Something unfamiliar begins to take root."
        );

    }

    else if (
        seedType === "nightbell"
    ) {

        greenhouseMessage(
            "You planted a Nightbell seed."
        );

    }

    else {

        greenhouseMessage(
            "You planted a Moonmint seed."
        );

    }


    saveGame();

    renderGreenhouse();

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


    // Capture any growth earned before
    // changing the watering timestamp.

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
// HARVEST
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


    // ======================================
    // MOONMINT
    // ======================================

    if (
        plot.plant ===
        "moonmint"
    ) {

        game.inventory.moonmint++;


        // 25% chance to recover a seed.

        if (
            Math.random() < 0.25
        ) {

            game.seeds.moonmint++;


            greenhouseMessage(
                "You harvested Moonmint and recovered a seed."
            );

        }

        else {

            greenhouseMessage(
                "You harvested fresh Moonmint."
            );

        }

    }


    // ======================================
    // UNKNOWN PLANT
    // ======================================

    else if (
        plot.plant ===
        "unknown"
    ) {

        game.inventory.nightbell++;


        // First harvest identifies Nightbell.

        if (
            !hasDiscovered(
                "nightbell"
            )
        ) {

            addDiscovery(
                "nightbell"
            );


            greenhouseMessage(
                "Discovery! The Strange Seed has revealed Nightbell."
            );

        }

        else {

            greenhouseMessage(
                "You harvested Nightbell."
            );

        }


        // Once identified, seeds from this
        // plant are known as Nightbell Seeds.

        if (
            Math.random() < 0.35
        ) {

            game.seeds.nightbell++;

        }

    }


    // ======================================
    // KNOWN NIGHTBELL
    // ======================================

    else if (
        plot.plant ===
        "nightbell"
    ) {

        game.inventory.nightbell++;


        if (
            Math.random() < 0.35
        ) {

            game.seeds.nightbell++;


            greenhouseMessage(
                "You harvested Nightbell and recovered a seed."
            );

        }

        else {

            greenhouseMessage(
                "You harvested Nightbell."
            );

        }

    }


    game.greenhouse.plots[index] =
        null;


    saveGame();

    renderGreenhouse();

}


// ==========================================
// PLANT ICONS
// ==========================================

function getPlantIcon(
    plant,
    progress
) {

    // UNKNOWN PLANT

    if (
        plant === "unknown"
    ) {

        if (
            progress >= 100
        ) {

            return "🪻";

        }


        if (
            progress >= 65
        ) {

            return "🌿";

        }


        return "🌱";

    }


    // NIGHTBELL

    if (
        plant === "nightbell"
    ) {

        if (
            progress >= 100
        ) {

            return "🪻";

        }


        if (
            progress >= 50
        ) {

            return "🌿";

        }


        return "🌱";

    }


    // MOONMINT

    if (
        progress >= 100
    ) {

        return "🌿";

    }


    if (
        progress >= 75
    ) {

        return "☘️";

    }


    if (
        progress >= 35
    ) {

        return "🌿";

    }


    return "🌱";

}


// ==========================================
// PLANT DISPLAY NAME
// ==========================================

function getPlantName(
    plant
) {

    if (
        plant === "unknown"
    ) {

        return "Unknown Plant";

    }


    if (
        plant === "nightbell"
    ) {

        return "Nightbell";

    }


    return "Moonmint";

}


// ==========================================
// SEED SELECTION HTML
// ==========================================

function getSeedMenuHTML(
    index
) {

    const moonmintSeeds =
        getSeedAmount(
            "moonmint"
        );


    const strangeSeeds =
        getSeedAmount(
            "unknown"
        );


    const nightbellSeeds =
        getSeedAmount(
            "nightbell"
        );


    const knowsNightbell =
        hasDiscovered(
            "nightbell"
        );


    let nightbellOption =
        "";


    if (
        knowsNightbell
        ||
        nightbellSeeds > 0
    ) {

        nightbellOption = `

            <button
                class="seed-choice"
                onclick="plantSeed(${index}, 'nightbell')"
                ${nightbellSeeds <= 0 ? "disabled" : ""}>

                <span class="seed-choice-icon">
                    🪻
                </span>

                <span>
                    <strong>
                        Nightbell
                    </strong>

                    <small>
                        ${nightbellSeeds} seeds
                    </small>
                </span>

            </button>

        `;

    }


    return `

        <div class="seed-menu">

            <div class="seed-menu-title">
                Choose a Seed
            </div>


            <button
                class="seed-choice"
                onclick="plantSeed(${index}, 'moonmint')"
                ${moonmintSeeds <= 0 ? "disabled" : ""}>

                <span class="seed-choice-icon">
                    🌱
                </span>

                <span>
                    <strong>
                        Moonmint
                    </strong>

                    <small>
                        ${moonmintSeeds} seeds
                    </small>
                </span>

            </button>


            <button
                class="seed-choice strange-seed-choice"
                onclick="plantSeed(${index}, 'unknown')"
                ${strangeSeeds <= 0 ? "disabled" : ""}>

                <span class="seed-choice-icon">
                    ✦
                </span>

                <span>
                    <strong>
                        Strange Seed
                    </strong>

                    <small>
                        ${strangeSeeds} seeds
                    </small>
                </span>

            </button>


            ${nightbellOption}


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

                            Choose Seed

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
                getPlantIcon(
                    plot.plant,
                    progress
                );


            const plantName =
                getPlantName(
                    plot.plant
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


            let actionButton;


            // READY TO HARVEST

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


            // STILL GROWING

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
