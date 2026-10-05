// ==========================================
// MOSSWOOD APOTHECARY
// Central Game Data
// V2 - Expandable Content System
// ==========================================


// ==========================================
// PLANTS
// ==========================================

const PLANT_DATA = {

    // --------------------------------------
    // MOONMINT
    // --------------------------------------

    moonmint: {

        id: "moonmint",

        name: "Moonmint",

        icon: "🌿",

        seedIcon: "🌱",

        type: "Herb",

        description:
            "A cool-scented herb commonly cultivated in the Mosswood greenhouse.",

        fieldNotes:
            "Known for its calming properties and pale, fragrant leaves.",

        growTime:
            60 * 1000,

        dryTime:
            25 * 1000,

        seedReturnChance:
            0.25,

        startingSeeds:
            3,

        alwaysKnown:
            true

    },


    // --------------------------------------
    // NIGHTBELL
    // --------------------------------------

    nightbell: {

        id: "nightbell",

        name: "Nightbell",

        icon: "🪻",

        seedIcon: "🪻",

        type:
            "Woodland Flower",

        description:
            "A dusky woodland flower first identified after cultivating a mysterious seed.",

        fieldNotes:
            "Its deeper alchemical properties remain uncertain. Experimentation may reveal more.",

        growTime:
            75 * 1000,

        dryTime:
            25 * 1000,

        seedReturnChance:
            0.25,

        startingSeeds:
            0,

        alwaysKnown:
            false

    }

};


// ==========================================
// MYSTERY SEED SETTINGS
// ==========================================
//
// Mystery seeds are intentionally NOT tied
// to one specific plant here.
//
// The actual plant hidden inside a mystery
// seed will be stored with that individual
// seed in the player's save.
//
// Example:
//
// {
//     id: "mystery_seed_1",
//     revealsPlant: "nightbell"
// }
//
// Later another seed could be:
//
// {
//     id: "mystery_seed_2",
//     revealsPlant: "ghostcap"
// }
//
// Both still appear to the player as
// "Strange Seed" until planted and revealed.
// ==========================================

const SPECIAL_SEED_DATA = {

    unknown: {

        id:
            "unknown",

        name:
            "Strange Seed",

        icon:
            "✦",

        description:
            "An unfamiliar seed gathered somewhere beyond the greenhouse.",

        startingAmount:
            0

    }

};


// ==========================================
// POTIONS
// ==========================================

const POTION_DATA = {

    calm: {

        id:
            "calm",

        discoveryId:
            "potionOfCalm",

        name:
            "Potion of Calm",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A pale green draught carrying the cool scent of Moonmint.",

        effect:
            "Calms the mind and settles restless thoughts.",

        sellPrice:
            15,

        startingAmount:
            0

    }

};


// ==========================================
// RECIPES
// ==========================================

const RECIPE_DATA = {

    potionOfCalm: {

        id:
            "potionOfCalm",

        potionId:
            "calm",

        ingredients: [
            "moonmint",
            "moonmint"
        ]

    }

};


// ==========================================
// FORAGING LOCATIONS
// ==========================================

const FORAGE_LOCATION_DATA = {

    forest: {

        id:
            "forest",

        name:
            "Mosswood Forest",

        unlocked:
            true

    },


    marsh: {

        id:
            "marsh",

        name:
            "Mistfen Marsh",

        unlocked:
            false

    },


    ruins: {

        id:
            "ruins",

        name:
            "Hollowmere Ruins",

        unlocked:
            false

    }

};


// ==========================================
// PLANT HELPERS
// ==========================================

function getPlantData(
    plantId
) {

    return (
        PLANT_DATA[plantId] ||
        null
    );

}


function getPlantName(
    plantId
) {

    const plant =
        getPlantData(
            plantId
        );

    if (!plant) {

        return "Unknown Plant";

    }

    return plant.name;

}


function getPlantIcon(
    plantId
) {

    const plant =
        getPlantData(
            plantId
        );

    if (!plant) {

        return "❔";

    }

    return plant.icon;

}


// ==========================================
// POTION HELPERS
// ==========================================

function getPotionData(
    potionId
) {

    return (
        POTION_DATA[potionId] ||
        null
    );

}


// ==========================================
// RECIPE HELPERS
// ==========================================

function getRecipeData(
    recipeId
) {

    return (
        RECIPE_DATA[recipeId] ||
        null
    );

}


// ==========================================
// SPECIAL SEED HELPERS
// ==========================================

function getSpecialSeedData(
    seedId
) {

    return (
        SPECIAL_SEED_DATA[seedId] ||
        null
    );

}


// ==========================================
// FORAGING LOCATION HELPERS
// ==========================================

function getForageLocationData(
    locationId
) {

    return (
        FORAGE_LOCATION_DATA[
            locationId
        ] ||
        null
    );

}
