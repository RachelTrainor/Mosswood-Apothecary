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

        moonmint: 0

    },


    // --------------------------------------
    // SEEDS
    // --------------------------------------

    seeds: {

        moonmint: 3

    },


    // --------------------------------------
    // POTIONS
    // --------------------------------------

    potions: {

        calm: 0

    },


    // --------------------------------------
    // DISCOVERED RECIPES
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
    // FUTURE FORAGING DATA
    // --------------------------------------

    forage: {

        active: false,

        location: null,

        startedAt: null,

        finishesAt: null

    },


    // --------------------------------------
    // FUTURE UPGRADES
    // --------------------------------------

    upgrades: {

        greenhousePlots: 4,

        growthSpeed: 1,

        irrigation: 0

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
        localStorage.getItem(SAVE_KEY);


    // No save exists yet.

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
            typeof oldGame.coins === "number"
        ) {

            newGame.coins =
                oldGame.coins;

        }


        // ----------------------------------
        // INVENTORY
        // ----------------------------------

        if (oldGame.inventory) {

            newGame.inventory = {

                ...newGame.inventory,

                ...oldGame.inventory

            };

        }


        // ----------------------------------
        // SEEDS
        // ----------------------------------

        if (oldGame.seeds) {

            newGame.seeds = {

                ...newGame.seeds,

                ...oldGame.seeds

            };

        }


        // ----------------------------------
        // POTIONS
        // ----------------------------------

        /*
            Your original Greenhouse save used:

                potions: 0

            The new game uses:

                potions: {
                    calm: 0
                }

            This safely handles both versions.
        */

        if (
            oldGame.potions &&
            typeof oldGame.potions === "object"
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

        /*
            OLD SAVE:

                plots: [...]

            NEW SAVE:

                greenhouse: {
                    plots: [...]
                }

            This migrates your existing
            greenhouse automatically.
        */

        if (
            Array.isArray(
                oldGame.plots
            )
        ) {

            newGame.greenhouse.plots =
                oldGame.plots;

        }


        if (oldGame.greenhouse) {

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

        if (oldGame.forage) {

            newGame.forage = {

                ...newGame.forage,

                ...oldGame.forage

            };

        }


        // ----------------------------------
        // UPGRADES
        // ----------------------------------

        if (oldGame.upgrades) {

            newGame.upgrades = {

                ...newGame.upgrades,

                ...oldGame.upgrades

            };

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

let game = loadGame();


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
                typeof amount === "number"
            ) {

                return total + amount;

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
                typeof amount === "number"
            ) {

                return total + amount;

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
        document.getElementById("coins");


    const plantsElement =
        document.getElementById("plants");


    const potionsElement =
        document.getElementById("potions");


    if (coinsElement) {

        coinsElement.textContent =
            game.coins;

    }


    if (plantsElement) {

        plantsElement.textContent =
            getTotalIngredients();

    }


    if (potionsElement) {

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
        typeof game.inventory[ingredient]
        !== "number"
    ) {

        game.inventory[ingredient] = 0;

    }


    game.inventory[ingredient] +=
        amount;


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


    if (current < amount) {

        return false;

    }


    game.inventory[ingredient] -=
        amount;


    saveGame();

    updateResourceBar();


    return true;

}


// ==========================================
// SEED HELPERS
// ==========================================

function getSeedAmount(seed) {

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
        typeof game.seeds[seed]
        !== "number"
    ) {

        game.seeds[seed] = 0;

    }


    game.seeds[seed] += amount;


    saveGame();

}


// ==========================================
// POTION HELPERS
// ==========================================

function getPotionAmount(potion) {

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
        typeof game.potions[potion]
        !== "number"
    ) {

        game.potions[potion] = 0;

    }


    game.potions[potion] += amount;


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
        hasDiscovered(discovery)
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


    game = getDefaultGame();


    saveGame();


    window.location.reload();

}


// ==========================================
// INITIALIZE SHARED UI
// ==========================================

updateResourceBar();


// Save migrated data immediately.
// This converts older saves into the
// new Mosswood save structure.

saveGame();
