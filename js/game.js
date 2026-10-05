// ==========================================
// MOSSWOOD APOTHECARY
// Shared Game Data + Save System
// ==========================================

const SAVE_KEY = "mosswoodSave";


// ==========================================
// DEFAULT GAME STATE
// ==========================================

const defaultGame = {

    // --------------------------------------
    // CURRENCY
    // --------------------------------------

    coins: 100,


    // --------------------------------------
    // INGREDIENT INVENTORY
    // --------------------------------------

    inventory: {

        moonmint: 0,

        nightbell: 0

    },


    // --------------------------------------
    // SEEDS
    // --------------------------------------

    seeds: {

        moonmint: 3,

        unknown: 0,

        nightbell: 0

    },


    // --------------------------------------
    // POTIONS
    // --------------------------------------

    potions: {

        calm: 0

    },


    // --------------------------------------
    // DISCOVERIES
    // --------------------------------------

    discoveries: [],


    // --------------------------------------
    // GREENHOUSE
    // --------------------------------------

    greenhouse: {

        level: 1,

        plots: [
            null,
            null,
            null,
            null
        ]

    },


    // --------------------------------------
    // FORAGING
    // --------------------------------------

    forage: {

        active: false,

        location: null,

        startedAt: null,

        finishesAt: null,

        lastResult: null

    },


    // --------------------------------------
    // UPGRADES
    // --------------------------------------

    upgrades: {

        expansion: 0,

        irrigation: 0,

        growth: 0

    }

};


// ==========================================
// COPY DEFAULT DATA
// ==========================================

function getDefaultGame() {

    return JSON.parse(
        JSON.stringify(defaultGame)
    );

}


// ==========================================
// LOAD GAME
// ==========================================

function loadGame() {

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );


    if (!saved) {

        return getDefaultGame();

    }


    try {

        const oldGame =
            JSON.parse(saved);


        const newGame =
            getDefaultGame();


        // ----------------------------------
        // CURRENCY
        // ----------------------------------

        if (
            typeof oldGame.coins
            === "number"
        ) {

            newGame.coins =
                oldGame.coins;

        }


        // ----------------------------------
        // INVENTORY
        // ----------------------------------

        if (
            oldGame.inventory
        ) {

            newGame.inventory = {

                ...newGame.inventory,

                ...oldGame.inventory

            };

        }


        // ----------------------------------
        // SEEDS
        // ----------------------------------

        if (
            oldGame.seeds
        ) {

            newGame.seeds = {

                ...newGame.seeds,

                ...oldGame.seeds

            };

        }


        // ----------------------------------
        // POTIONS
        // ----------------------------------

        if (
            oldGame.potions &&
            typeof oldGame.potions
            === "object"
        ) {

            newGame.potions = {

                ...newGame.potions,

                ...oldGame.potions

            };

        }


        // ----------------------------------
        // DISCOVERIES
        // ----------------------------------

        if (
            Array.isArray(
                oldGame.discoveries
            )
        ) {

            newGame.discoveries =
                oldGame.discoveries;

        }


        // ----------------------------------
        // GREENHOUSE
        // ----------------------------------

        // Support very old saves that stored
        // plots directly on the game object.

        if (
            Array.isArray(
                oldGame.plots
            )
        ) {

            newGame.greenhouse.plots =
                oldGame.plots;

        }


        if (
            oldGame.greenhouse
        ) {

            newGame.greenhouse = {

                ...newGame.greenhouse,

                ...oldGame.greenhouse

            };


            if (
                Array.isArray(
                    oldGame.greenhouse.plots
                )
            ) {

                newGame.greenhouse.plots =
                    oldGame.greenhouse.plots;

            }

        }


        // ----------------------------------
        // FORAGING
        // ----------------------------------

        if (
            oldGame.forage
        ) {

            newGame.forage = {

                ...newGame.forage,

                ...oldGame.forage

            };

        }


        // ----------------------------------
        // UPGRADES
        // ----------------------------------

        if (
            oldGame.upgrades
        ) {

            newGame.upgrades = {

                ...newGame.upgrades,

                ...oldGame.upgrades

            };

        }


        // ----------------------------------
        // OLD UPGRADE MIGRATION
        // ----------------------------------

        // Some older saves used different
        // upgrade property names.

        if (
            typeof newGame.upgrades.expansion
            !== "number"
        ) {

            newGame.upgrades.expansion = 0;

        }


        if (
            typeof newGame.upgrades.irrigation
            !== "number"
        ) {

            newGame.upgrades.irrigation = 0;

        }


        if (
            typeof newGame.upgrades.growth
            !== "number"
        ) {

            newGame.upgrades.growth = 0;

        }


        return newGame;

    }

    catch (error) {

        console.error(
            "Mosswood save could not be loaded:",
            error
        );


        return getDefaultGame();

    }

}


// ==========================================
// CURRENT GAME
// ==========================================

let game =
    loadGame();


// ==========================================
// SAVE GAME
// ==========================================

function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );

}


// ==========================================
// TOTAL POTIONS
// ==========================================

function getTotalPotions() {

    return Object.values(
        game.potions
    ).reduce(

        (total, amount) => {

            if (
                typeof amount
                === "number"
            ) {

                return (
                    total + amount
                );

            }


            return total;

        },

        0

    );

}


// ==========================================
// TOTAL INGREDIENTS
// ==========================================

function getTotalIngredients() {

    return Object.values(
        game.inventory
    ).reduce(

        (total, amount) => {

            if (
                typeof amount
                === "number"
            ) {

                return (
                    total + amount
                );

            }


            return total;

        },

        0

    );

}


// ==========================================
// UPDATE RESOURCE BAR
// ==========================================

function updateResourceBar() {

    const coinsElement =
        document.getElementById(
            "coins"
        );


    const plantsElement =
        document.getElementById(
            "plants"
        );


    const potionsElement =
        document.getElementById(
            "potions"
        );


    if (
        coinsElement
    ) {

        coinsElement.textContent =
            game.coins;

    }


    if (
        plantsElement
    ) {

        plantsElement.textContent =
            getTotalIngredients();

    }


    if (
        potionsElement
    ) {

        potionsElement.textContent =
            getTotalPotions();

    }

}


// ==========================================
// INGREDIENT HELPERS
// ==========================================

function getIngredientAmount(
    ingredient
) {

    return (
        game.inventory[ingredient]
        || 0
    );

}


function addIngredient(
    ingredient,
    amount = 1
) {

    if (
        typeof game.inventory[
            ingredient
        ] !== "number"
    ) {

        game.inventory[
            ingredient
        ] = 0;

    }


    game.inventory[
        ingredient
    ] += amount;


    saveGame();

    updateResourceBar();

}


function removeIngredient(
    ingredient,
    amount = 1
) {

    const current =
        getIngredientAmount(
            ingredient
        );


    if (
        current < amount
    ) {

        return false;

    }


    game.inventory[
        ingredient
    ] -= amount;


    saveGame();

    updateResourceBar();


    return true;

}


// ==========================================
// SEED HELPERS
// ==========================================

function getSeedAmount(
    seed
) {

    return (
        game.seeds[seed]
        || 0
    );

}


function addSeeds(
    seed,
    amount = 1
) {

    if (
        typeof game.seeds[
            seed
        ] !== "number"
    ) {

        game.seeds[
            seed
        ] = 0;

    }


    game.seeds[
        seed
    ] += amount;


    saveGame();

}


// ==========================================
// POTION HELPERS
// ==========================================

function getPotionAmount(
    potion
) {

    return (
        game.potions[potion]
        || 0
    );

}


function addPotion(
    potion,
    amount = 1
) {

    if (
        typeof game.potions[
            potion
        ] !== "number"
    ) {

        game.potions[
            potion
        ] = 0;

    }


    game.potions[
        potion
    ] += amount;


    saveGame();

    updateResourceBar();

}


// ==========================================
// DISCOVERY HELPERS
// ==========================================

function hasDiscovered(
    discovery
) {

    return game.discoveries.includes(
        discovery
    );

}


function addDiscovery(
    discovery
) {

    if (
        hasDiscovered(
            discovery
        )
    ) {

        return false;

    }


    game.discoveries.push(
        discovery
    );


    saveGame();


    return true;

}


// ==========================================
// DEVELOPMENT RESET
// ==========================================

function resetMosswoodSave() {

    const confirmed =
        confirm(
            "Reset Mosswood Apothecary? This will erase your current game save."
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        SAVE_KEY
    );


    game =
        getDefaultGame();


    saveGame();


    window.location.reload();

}


// ==========================================
// INITIALIZE SHARED UI
// ==========================================

updateResourceBar();


// Save migrated data immediately.

saveGame();
