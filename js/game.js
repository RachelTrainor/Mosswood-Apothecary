// ==========================================
// MOSSWOOD APOTHECARY
// Shared Game Data + Save System
// V4 - Customer Request Support
// ==========================================

const SAVE_KEY = "mosswoodSave";


// ==========================================
// BUILD DEFAULT INVENTORY
// ==========================================

function buildDefaultInventory() {

    const inventory = {};

    Object.values(PLANT_DATA).forEach(
        plant => {

            inventory[plant.id] = 0;

        }
    );

    return inventory;

}


// ==========================================
// BUILD DEFAULT SEEDS
// ==========================================
//
// Normal KNOWN seeds are stored here.
//
// Mystery / Strange Seeds are NOT stored
// here anymore. They are stored individually
// in game.mysterySeeds.
// ==========================================

function buildDefaultSeeds() {

    const seeds = {};

    Object.values(PLANT_DATA).forEach(
        plant => {

            seeds[plant.id] =
                plant.startingSeeds || 0;

        }
    );

    return seeds;

}


// ==========================================
// BUILD DEFAULT POTIONS
// ==========================================

function buildDefaultPotions() {

    const potions = {};

    Object.values(POTION_DATA).forEach(
        potion => {

            potions[potion.id] =
                potion.startingAmount || 0;

        }
    );

    return potions;

}


// ==========================================
// DEFAULT GAME STATE
// ==========================================

const defaultGame = {

    coins: 100,

    inventory:
        buildDefaultInventory(),

    seeds:
        buildDefaultSeeds(),

    // Each Strange Seed is stored separately.
    //
    // Example:
    //
    // {
    //     id: "mystery_12345_1",
    //     revealsPlant: "nightbell"
    // }

    mysterySeeds: [],

    potions:
        buildDefaultPotions(),

    discoveries: [],

    greenhouse: {

        level: 1,

        plots: [
            null,
            null,
            null,
            null
        ]

    },

    forage: {

        active: false,
        location: null,
        startedAt: null,
        finishesAt: null,
        lastResult: null

    },

    upgrades: {

        expansion: 0,
        irrigation: 0,
        growth: 0

    },

    // --------------------------------------
    // CUSTOMER REQUEST SYSTEM
    // --------------------------------------

    customers: {

        active: null,

        nextCustomerAt: 0

    },

    migrations: {

        mysterySeedsV1: false

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
// CREATE MYSTERY SEED ID
// ==========================================

let mysterySeedIdCounter = 0;


function createMysterySeedId() {

    mysterySeedIdCounter++;

    return (
        "mystery_"
        + Date.now()
        + "_"
        + mysterySeedIdCounter
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
            typeof oldGame.coins === "number"
        ) {

            newGame.coins =
                oldGame.coins;

        }


        // ----------------------------------
        // INVENTORY
        // ----------------------------------

        if (
            oldGame.inventory &&
            typeof oldGame.inventory === "object"
        ) {

            newGame.inventory = {

                ...newGame.inventory,
                ...oldGame.inventory

            };

        }


        // ----------------------------------
        // NORMAL SEEDS
        // ----------------------------------

        if (
            oldGame.seeds &&
            typeof oldGame.seeds === "object"
        ) {

            newGame.seeds = {

                ...newGame.seeds,
                ...oldGame.seeds

            };

        }


        // ----------------------------------
        // MYSTERY SEEDS
        // ----------------------------------

        if (
            Array.isArray(
                oldGame.mysterySeeds
            )
        ) {

            newGame.mysterySeeds =
                oldGame.mysterySeeds;

        }


        // ----------------------------------
        // POTIONS
        // ----------------------------------

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

        // Support older saves that stored
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
            oldGame.greenhouse &&
            typeof oldGame.greenhouse === "object"
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
            oldGame.forage &&
            typeof oldGame.forage === "object"
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
            oldGame.upgrades &&
            typeof oldGame.upgrades === "object"
        ) {

            newGame.upgrades = {

                ...newGame.upgrades,
                ...oldGame.upgrades

            };

        }


        // ----------------------------------
        // CUSTOMERS
        // ----------------------------------

        if (
            oldGame.customers &&
            typeof oldGame.customers === "object"
        ) {

            newGame.customers = {

                ...newGame.customers,
                ...oldGame.customers

            };

        }


        // ----------------------------------
        // MIGRATION FLAGS
        // ----------------------------------

        if (
            oldGame.migrations &&
            typeof oldGame.migrations === "object"
        ) {

            newGame.migrations = {

                ...newGame.migrations,
                ...oldGame.migrations

            };

        }


        // ==================================
        // UPGRADE SAFETY
        // ==================================

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


        // ==================================
        // CUSTOMER SAFETY
        // ==================================

        if (
            !newGame.customers ||
            typeof newGame.customers !== "object"
        ) {

            newGame.customers = {

                active: null,
                nextCustomerAt: 0

            };

        }


        if (
            typeof newGame.customers.nextCustomerAt
            !== "number"
        ) {

            newGame.customers.nextCustomerAt = 0;

        }


        if (
            newGame.customers.active !== null &&
            typeof newGame.customers.active !== "object"
        ) {

            newGame.customers.active = null;

        }


        // ==================================
        // ENSURE ALL PLANTS EXIST
        // ==================================

        Object.values(PLANT_DATA).forEach(
            plant => {

                if (
                    typeof newGame.inventory[
                        plant.id
                    ] !== "number"
                ) {

                    newGame.inventory[
                        plant.id
                    ] = 0;

                }


                if (
                    typeof newGame.seeds[
                        plant.id
                    ] !== "number"
                ) {

                    newGame.seeds[
                        plant.id
                    ] = 0;

                }

            }
        );


        // ==================================
        // ENSURE ALL POTIONS EXIST
        // ==================================

        Object.values(POTION_DATA).forEach(
            potion => {

                if (
                    typeof newGame.potions[
                        potion.id
                    ] !== "number"
                ) {

                    newGame.potions[
                        potion.id
                    ] = 0;

                }

            }
        );


        // ==================================
        // OLD STRANGE SEED MIGRATION
        // ==================================
        //
        // Old versions stored Strange Seeds
        // as:
        //
        // game.seeds.unknown = number
        //
        // At that point Nightbell was the
        // only possible mystery plant.
        //
        // Convert those old seeds into
        // individual mystery seed objects.
        //
        // This migration only runs once.
        // ==================================

        if (
            !newGame.migrations.mysterySeedsV1
        ) {

            let oldStrangeSeedAmount = 0;


            if (
                oldGame.seeds &&
                typeof oldGame.seeds.unknown
                === "number"
            ) {

                oldStrangeSeedAmount =
                    Math.max(
                        0,
                        Math.floor(
                            oldGame.seeds.unknown
                        )
                    );

            }


            for (
                let i = 0;
                i < oldStrangeSeedAmount;
                i++
            ) {

                newGame.mysterySeeds.push({

                    id:
                        createMysterySeedId(),

                    revealsPlant:
                        "nightbell"

                });

            }


            newGame.migrations.mysterySeedsV1 =
                true;

        }


        // Old "unknown" seed count is no
        // longer used after migration.

        if (
            Object.prototype.hasOwnProperty.call(
                newGame.seeds,
                "unknown"
            )
        ) {

            delete newGame.seeds.unknown;

        }


        // ==================================
        // MYSTERY SEED SAFETY
        // ==================================

        if (
            !Array.isArray(
                newGame.mysterySeeds
            )
        ) {

            newGame.mysterySeeds = [];

        }


        // Remove malformed mystery seeds.

        newGame.mysterySeeds =
            newGame.mysterySeeds.filter(
                seed => {

                    return (
                        seed &&
                        typeof seed === "object" &&
                        typeof seed.revealsPlant
                            === "string" &&
                        PLANT_DATA[
                            seed.revealsPlant
                        ]
                    );

                }
            );


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
// NORMAL SEED HELPERS
// ==========================================

function getSeedAmount(
    seed
) {

    // Compatibility:
    //
    // Existing pages still ask for
    // getSeedAmount("unknown").
    //
    // Return the number of individual
    // mystery seeds instead.

    if (
        seed === "unknown"
    ) {

        return getMysterySeedAmount();

    }


    return (
        game.seeds[seed]
        || 0
    );

}


function addSeeds(
    seed,
    amount = 1
) {

    // Compatibility for old code.
    //
    // If something tries to add an
    // "unknown" seed before forage.js
    // is updated, create Nightbell
    // mystery seeds instead.
    //
    // Once forage.js is updated it will
    // call addMysterySeed() directly.

    if (
        seed === "unknown"
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            addMysterySeed(
                "nightbell"
            );

        }

        return;

    }


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


function removeSeeds(
    seed,
    amount = 1
) {

    // Compatibility for old code.

    if (
        seed === "unknown"
    ) {

        if (
            getMysterySeedAmount()
            < amount
        ) {

            return false;

        }


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            takeMysterySeed();

        }


        saveGame();

        return true;

    }


    const current =
        getSeedAmount(
            seed
        );


    if (
        current < amount
    ) {

        return false;

    }


    game.seeds[
        seed
    ] -= amount;


    saveGame();

    return true;

}


// ==========================================
// MYSTERY SEED HELPERS
// ==========================================

function getMysterySeedAmount() {

    if (
        !Array.isArray(
            game.mysterySeeds
        )
    ) {

        return 0;

    }


    return game.mysterySeeds.length;

}


// ==========================================
// ADD MYSTERY SEED
// ==========================================
//
// This is what forage.js will eventually
// use.
//
// Example:
//
// addMysterySeed("nightbell");
//
// Later:
//
// addMysterySeed("ghostcap");
// ==========================================

function addMysterySeed(
    revealsPlant
) {

    const plant =
        getPlantData(
            revealsPlant
        );


    if (!plant) {

        console.warn(
            "Cannot create mystery seed. Unknown plant:",
            revealsPlant
        );

        return null;

    }


    if (
        !Array.isArray(
            game.mysterySeeds
        )
    ) {

        game.mysterySeeds = [];

    }


    const mysterySeed = {

        id:
            createMysterySeedId(),

        revealsPlant:
            revealsPlant

    };


    game.mysterySeeds.push(
        mysterySeed
    );


    saveGame();

    return mysterySeed;

}


// ==========================================
// PEEK AT NEXT MYSTERY SEED
// ==========================================
//
// Used internally by the game.
// The player is not shown revealsPlant.
// ==========================================

function peekMysterySeed() {

    if (
        !Array.isArray(
            game.mysterySeeds
        )
        ||
        game.mysterySeeds.length === 0
    ) {

        return null;

    }


    return game.mysterySeeds[0];

}


// ==========================================
// TAKE MYSTERY SEED
// ==========================================
//
// Removes and returns one Strange Seed.
// Greenhouse will use this when the player
// plants one.
// ==========================================

function takeMysterySeed() {

    if (
        !Array.isArray(
            game.mysterySeeds
        )
        ||
        game.mysterySeeds.length === 0
    ) {

        return null;

    }


    const mysterySeed =
        game.mysterySeeds.shift();


    saveGame();

    return mysterySeed;

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


function removePotion(
    potion,
    amount = 1
) {

    const current =
        getPotionAmount(
            potion
        );


    if (
        current < amount
    ) {

        return false;

    }


    game.potions[
        potion
    ] -= amount;


    saveGame();
    updateResourceBar();

    return true;

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
// PLANT DISCOVERY HELPER
// ==========================================

function isPlantKnown(
    plantId
) {

    const plant =
        getPlantData(
            plantId
        );


    if (!plant) {

        return false;

    }


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
// RECIPE DISCOVERY HELPER
// ==========================================

function isRecipeKnown(
    recipeId
) {

    return hasDiscovered(
        recipeId
    );

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
