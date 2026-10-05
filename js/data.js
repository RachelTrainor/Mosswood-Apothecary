// ==========================================
// MOSSWOOD APOTHECARY
// Shared Game Data + Save System
// V2 - Central Data Integration
// ==========================================

const SAVE_KEY = "mosswoodSave";


// ==========================================
// BUILD DEFAULT INVENTORY
// ==========================================

function buildDefaultInventory() {

    const inventory = {};


    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            inventory[
                plant.id
            ] = 0;

        }
    );


    return inventory;

}


// ==========================================
// BUILD DEFAULT SEEDS
// ==========================================

function buildDefaultSeeds() {

    const seeds = {};


    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            seeds[
                plant.id
            ] =
                plant.startingSeeds || 0;

        }
    );


    Object.values(
        SPECIAL_SEED_DATA
    ).forEach(
        seed => {

            seeds[
                seed.id
            ] =
                seed.startingAmount || 0;

        }
    );


    return seeds;

}


// ==========================================
// BUILD DEFAULT POTIONS
// ==========================================

function buildDefaultPotions() {

    const potions = {};


    Object.values(
        POTION_DATA
    ).forEach(
        potion => {

            potions[
                potion.id
            ] =
                potion.startingAmount || 0;

        }
    );


    return potions;

}


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

    inventory:
        buildDefaultInventory(),


    // --------------------------------------
    // SEEDS
    // --------------------------------------

    seeds:
        buildDefaultSeeds(),


    // --------------------------------------
    // POTIONS
    // --------------------------------------

    potions:
        buildDefaultPotions(),


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
        JSON.stringify(
            defaultGame
        )
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
            JSON.parse(
                saved
            );


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
            oldGame.inventory &&
            typeof oldGame.inventory
            === "object"
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
            oldGame.seeds &&
            typeof oldGame.seeds
            === "object"
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
            oldGame.greenhouse &&
            typeof oldGame.greenhouse
            === "object"
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
            typeof oldGame.forage
            === "object"
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
            typeof oldGame.upgrades
            === "object"
        ) {

            newGame.upgrades = {

                ...newGame.upgrades,

                ...oldGame.upgrades

            };

        }


        // ----------------------------------
        // UPGRADE MIGRATION
        // ----------------------------------

        if (
            typeof newGame.upgrades.expansion
            !== "number"
        ) {

            newGame.upgrades.expansion =
                0;

        }


        if (
            typeof newGame.upgrades.irrigation
            !== "number"
        ) {

            newGame.upgrades.irrigation =
                0;

        }


        if (
            typeof newGame.upgrades.growth
            !== "number"
        ) {

            newGame.upgrades.growth =
                0;

        }


        // ----------------------------------
        // ENSURE CURRENT PLANTS EXIST
        // ----------------------------------

        Object.values(
            PLANT_DATA
        ).forEach(
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


        // ----------------------------------
        // ENSURE SPECIAL SEEDS EXIST
        // ----------------------------------

        Object.values(
            SPECIAL_SEED_DATA
        ).forEach(
            seed => {

                if (
                    typeof newGame.seeds[
                        seed.id
                    ] !== "number"
                ) {

                    newGame.seeds[
                        seed.id
                    ] = 0;

                }

            }
        );


        // ----------------------------------
        // ENSURE CURRENT POTIONS EXIST
        // ----------------------------------

        Object.values(
            POTION_DATA
        ).forEach(
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
        JSON.stringify(
            game
        )
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
        game.inventory[
            ingredient
        ]
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
        game.seeds[
            seed
        ]
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
// REMOVE SEEDS
// ==========================================

function removeSeeds(
    seed,
    amount = 1
) {

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
// POTION HELPERS
// ==========================================

function getPotionAmount(
    potion
) {

    return (
        game.potions[
            potion
        ]
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
// REMOVE POTION
// ==========================================

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
// PLANT DISCOVERY
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
// RECIPE DISCOVERY
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
