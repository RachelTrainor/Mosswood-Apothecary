// ==========================================
// MOSSWOOD APOTHECARY
// Central Game Data
// V5 - Ghostcap
// ==========================================


// ==========================================
// PLANTS
// ==========================================

const PLANT_DATA = {

    // --------------------------------------
    // MOONMINT
    // --------------------------------------

    moonmint: {

        id:
            "moonmint",

        name:
            "Moonmint",

        icon:
            "🌿",

        seedIcon:
            "🌱",

        type:
            "Herb",

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

        id:
            "nightbell",

        name:
            "Nightbell",

        icon:
            "🪻",

        seedIcon:
            "🪻",

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

    },


    // --------------------------------------
    // GHOSTCAP
    // --------------------------------------

    ghostcap: {

        id:
            "ghostcap",

        name:
            "Ghostcap",

        icon:
            "🍄",

        seedIcon:
            "🍄",

        type:
            "Marsh Fungus",

        description:
            "A pale, spectral fungus found in the mist-covered reaches of Mistfen Marsh.",

        fieldNotes:
            "Its faintly luminous cap seems unusually sensitive to moonlight and nearby movement.",

        growTime:
            90 * 1000,

        dryTime:
            30 * 1000,

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
// seed is stored with that individual seed
// inside the player's save.
//
// Example:
//
// {
//     id: "mystery_seed_1",
//     revealsPlant: "nightbell"
// }
//
// Another seed could be:
//
// {
//     id: "mystery_seed_2",
//     revealsPlant: "ghostcap"
// }
//
// Both appear to the player as a
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

    // --------------------------------------
    // MOONMINT INFUSION
    // 1 Moonmint
    // --------------------------------------

    moonmintInfusion: {

        id:
            "moonmintInfusion",

        discoveryId:
            "moonmintInfusionRecipe",

        name:
            "Moonmint Infusion",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A simple herbal infusion carrying the cool scent of fresh Moonmint.",

        effect:
            "Gently eases tension and quiets a restless mind.",

        sellPrice:
            6,

        startingAmount:
            0

    },


    // --------------------------------------
    // NIGHTBELL DRAUGHT
    // 1 Nightbell
    // --------------------------------------

    nightbellDraught: {

        id:
            "nightbellDraught",

        discoveryId:
            "nightbellDraughtRecipe",

        name:
            "Nightbell Draught",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A dusky violet draught with a faint floral fragrance.",

        effect:
            "Brings a gentle drowsiness and a lingering sense of calm.",

        sellPrice:
            9,

        startingAmount:
            0

    },


    // --------------------------------------
    // POTION OF CALM
    // 2 Moonmint
    // --------------------------------------

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

    },


    // --------------------------------------
    // DREAMVEIL TONIC
    // 1 Moonmint + 1 Nightbell
    // --------------------------------------

    dreamveil: {

        id:
            "dreamveil",

        discoveryId:
            "dreamveilTonicRecipe",

        name:
            "Dreamveil Tonic",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A soft violet tonic that shimmers faintly when held to the light.",

        effect:
            "Encourages restful sleep and unusually vivid dreams.",

        sellPrice:
            20,

        startingAmount:
            0

    },


    // --------------------------------------
    // LUNAR ELIXIR
    // 2 Nightbell
    // --------------------------------------

    lunarElixir: {

        id:
            "lunarElixir",

        discoveryId:
            "lunarElixirRecipe",

        name:
            "Lunar Elixir",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A deep violet elixir with a silvery sheen drifting across its surface.",

        effect:
            "Sharpens awareness beneath moonlight and quiets the senses.",

        sellPrice:
            24,

        startingAmount:
            0

    },


    // --------------------------------------
    // SERENITY ELIXIR
    // 3 Moonmint
    // --------------------------------------

    serenityElixir: {

        id:
            "serenityElixir",

        discoveryId:
            "serenityElixirRecipe",

        name:
            "Serenity Elixir",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A concentrated emerald elixir with an intensely cool herbal aroma.",

        effect:
            "Produces a deep and lasting sense of tranquility.",

        sellPrice:
            28,

        startingAmount:
            0

    },


    // --------------------------------------
    // TRANQUIL DREAM TONIC
    // 2 Moonmint + 1 Nightbell
    // --------------------------------------

    tranquilDream: {

        id:
            "tranquilDream",

        discoveryId:
            "tranquilDreamTonicRecipe",

        name:
            "Tranquil Dream Tonic",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A muted lavender tonic with a soothing herbal fragrance.",

        effect:
            "Brings deep relaxation followed by peaceful, gentle dreams.",

        sellPrice:
            32,

        startingAmount:
            0

    },


    // --------------------------------------
    // MOONVEIL POTION
    // 1 Moonmint + 2 Nightbell
    // --------------------------------------

    moonveil: {

        id:
            "moonveil",

        discoveryId:
            "moonveilPotionRecipe",

        name:
            "Moonveil Potion",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "A dark violet potion filled with tiny silver flecks that drift like stars.",

        effect:
            "Deepens dreams and heightens awareness of strange nocturnal visions.",

        sellPrice:
            36,

        startingAmount:
            0

    },


    // --------------------------------------
    // MIDNIGHT ESSENCE
    // 3 Nightbell
    // --------------------------------------

    midnightEssence: {

        id:
            "midnightEssence",

        discoveryId:
            "midnightEssenceRecipe",

        name:
            "Midnight Essence",

        icon:
            "⚗",

        inventoryIcon:
            "🧪",

        description:
            "An almost black essence that catches the light with a faint violet glow.",

        effect:
            "Induces an unusually deep dream state filled with vivid and mysterious visions.",

        sellPrice:
            42,

        startingAmount:
            0

    }

};


// ==========================================
// RECIPES
// ==========================================

const RECIPE_DATA = {

    // --------------------------------------
    // ONE INGREDIENT
    // --------------------------------------

    moonmintInfusionRecipe: {

        id:
            "moonmintInfusionRecipe",

        potionId:
            "moonmintInfusion",

        ingredients: [
            "moonmint"
        ]

    },


    nightbellDraughtRecipe: {

        id:
            "nightbellDraughtRecipe",

        potionId:
            "nightbellDraught",

        ingredients: [
            "nightbell"
        ]

    },


    // --------------------------------------
    // TWO INGREDIENTS
    // --------------------------------------

    potionOfCalm: {

        id:
            "potionOfCalm",

        potionId:
            "calm",

        ingredients: [
            "moonmint",
            "moonmint"
        ]

    },


    dreamveilTonicRecipe: {

        id:
            "dreamveilTonicRecipe",

        potionId:
            "dreamveil",

        ingredients: [
            "moonmint",
            "nightbell"
        ]

    },


    lunarElixirRecipe: {

        id:
            "lunarElixirRecipe",

        potionId:
            "lunarElixir",

        ingredients: [
            "nightbell",
            "nightbell"
        ]

    },


    // --------------------------------------
    // THREE INGREDIENTS
    // --------------------------------------

    serenityElixirRecipe: {

        id:
            "serenityElixirRecipe",

        potionId:
            "serenityElixir",

        ingredients: [
            "moonmint",
            "moonmint",
            "moonmint"
        ]

    },


    tranquilDreamTonicRecipe: {

        id:
            "tranquilDreamTonicRecipe",

        potionId:
            "tranquilDream",

        ingredients: [
            "moonmint",
            "moonmint",
            "nightbell"
        ]

    },


    moonveilPotionRecipe: {

        id:
            "moonveilPotionRecipe",

        potionId:
            "moonveil",

        ingredients: [
            "moonmint",
            "nightbell",
            "nightbell"
        ]

    },


    midnightEssenceRecipe: {

        id:
            "midnightEssenceRecipe",

        potionId:
            "midnightEssence",

        ingredients: [
            "nightbell",
            "nightbell",
            "nightbell"
        ]

    }

};


// ==========================================
// PLANT HELPERS
// ==========================================

function getPlantData(
    plantId
) {

    return (
        PLANT_DATA[
            plantId
        ] ||
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
        POTION_DATA[
            potionId
        ] ||
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
        RECIPE_DATA[
            recipeId
        ] ||
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
        SPECIAL_SEED_DATA[
            seedId
        ] ||
        null
    );

}
