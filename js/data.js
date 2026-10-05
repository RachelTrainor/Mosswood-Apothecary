// ==========================================
// MOSSWOOD APOTHECARY
// Central Game Data
// ==========================================
//
// This file contains the definitions for
// plants, seeds, potions, recipes, and other
// expandable game content.
//
// Adding future content should happen here
// instead of being hard-coded across several
// different game files.
// ==========================================


// ==========================================
// PLANTS
// ==========================================

const PLANT_DATA = {

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

        growTime: 60 * 1000,

        dryTime: 25 * 1000,

        seedReturnChance: 0.25,

        startingSeeds: 3,

        alwaysKnown: true

    },


    nightbell: {

        id: "nightbell",

        name: "Nightbell",

        icon: "🪻",

        seedIcon: "🪻",

        type: "Woodland Flower",

        description:
            "A dusky woodland flower first identified after cultivating a mysterious Strange Seed.",

        fieldNotes:
            "Its deeper alchemical properties remain uncertain. Experimentation may reveal more.",

        growTime: 75 * 1000,

        dryTime: 25 * 1000,

        seedReturnChance: 0.25,

        startingSeeds: 0,

        alwaysKnown: false

    }

};


// ==========================================
// SPECIAL SEEDS
// ==========================================

const SPECIAL_SEED_DATA = {

    unknown: {

        id: "unknown",

        name: "Strange Seed",

        icon: "✦",

        description:
            "An unfamiliar seed gathered somewhere beyond the greenhouse.",

        startingAmount: 0

    }

};


// ==========================================
// POTIONS
// ==========================================

const POTION_DATA = {

    calm: {

        id: "calm",

        discoveryId: "potionOfCalm",

        name: "Potion of Calm",

        icon: "⚗",

        inventoryIcon: "🧪",

        description:
            "A pale green draught carrying the cool scent of Moonmint.",

        effect:
            "Calms the mind and settles restless thoughts.",

        sellPrice: 15,

        startingAmount: 0

    }

};


// ==========================================
// RECIPES
// ==========================================

const RECIPE_DATA = {

    potionOfCalm: {

        id: "potionOfCalm",

        potionId: "calm",

        ingredients: [
            "moonmint",
            "moonmint"
        ]

    }

};


// ==========================================
// FORAGE LOCATIONS
// ==========================================

const FORAGE_LOCATION_DATA = {

    forest: {

        id: "forest",

        name: "Mosswood Forest",

        unlocked: true

    },

    marsh: {

        id: "marsh",

        name: "Mistfen Marsh",

        unlocked: false

    },

    ruins: {

        id: "ruins",

        name: "Hollowmere Ruins",

        unlocked: false

    }

};


// ==========================================
// DATA HELPERS
// ==========================================

function getPlantData(
    plantId
) {

    return (
        PLANT_DATA[plantId]
        || null
    );

}


function getPotionData(
    potionId
) {

    return (
        POTION_DATA[potionId]
        || null
    );

}


function getRecipeData(
    recipeId
) {

    return (
        RECIPE_DATA[recipeId]
        || null
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
