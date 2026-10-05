// ==========================================
// MOSSWOOD APOTHECARY
// Forage Data V5
// Dynamic Discovery Rewards
// ==========================================


// ==========================================
// FORAGE LOCATIONS
// ==========================================

const FORAGE_LOCATION_DATA = {

    // --------------------------------------
    // MOSSWOOD FOREST
    // --------------------------------------

    forest: {

        id:
            "forest",

        name:
            "Mosswood Forest",

        icon:
            "🌲",

        type:
            "WOODLAND",

        findLabel:
            "COMMON FINDS",

        description:
            "A shadowed woodland surrounding the apothecary, rich with familiar herbs and hidden growth.",

        activeText:
            "Your familiar searches beneath roots, moss, and fallen branches.",

        duration:
            30 * 1000,

        unlockedByDefault:
            true,

        unlockCost:
            0,

        discoveryRequirement:
            null,

        discoveryRequirementName:
            null,

        requirementHidden:
            false

    },


    // --------------------------------------
    // MISTFEN MARSH
    // --------------------------------------

    marsh: {

        id:
            "marsh",

        name:
            "Mistfen Marsh",

        icon:
            "🌫️",

        type:
            "MARSHLAND",

        findLabel:
            "UNCOMMON FINDS",

        description:
            "A pale marsh wrapped in drifting mist where strange fungi and uncommon botanicals thrive.",

        activeText:
            "Your familiar moves carefully through the reeds and drifting marsh mist.",

        duration:
            45 * 1000,

        unlockedByDefault:
            false,

        unlockCost:
            500,

        discoveryRequirement:
            "nightbell",

        discoveryRequirementName:
            "Nightbell",

        requirementHidden:
            false

    },


    // --------------------------------------
    // HOLLOWMERE RUINS
    // --------------------------------------

    ruins: {

        id:
            "ruins",

        name:
            "Hollowmere Ruins",

        icon:
            "🏚️",

        type:
            "RUINS",

        findLabel:
            "UNKNOWN FINDS",

        description:
            "Ancient stonework lies beyond the overgrowth. Whatever grows there has remained undisturbed for years.",

        activeText:
            "Your familiar slips between the ancient stones, searching the forgotten ruins.",

        duration:
            60 * 1000,

        unlockedByDefault:
            false,

        unlockCost:
            0,

        discoveryRequirement:
            null,

        discoveryRequirementName:
            null,

        requirementHidden:
            true

    }

};


// ==========================================
// FORAGE REWARD TABLES
// ==========================================
//
// chance values for each location should
// add up to 1.00.
//
// discoverySeed:
//
// Before the plant is discovered:
//     Gives a Strange Seed.
//
// After the plant is discovered:
//     Gives the plant's identified
//     planting material.
//
// The display name/icon for the identified
// planting material comes from PLANT_DATA.
// ==========================================

const FORAGE_REWARD_DATA = {

    // ======================================
    // MOSSWOOD FOREST
    // ======================================

    forest: [

        // ----------------------------------
        // MOONMINT INGREDIENT
        // 45%
        // ----------------------------------

        {

            chance:
                0.45,

            type:
                "ingredient",

            itemId:
                "moonmint",

            minAmount:
                1,

            maxAmount:
                2,

            icon:
                "🌿",

            title:
                "Found Moonmint",

            text:
                "Your familiar returned with fresh Moonmint gathered beneath the trees."

        },


        // ----------------------------------
        // MOONMINT SEED
        // 30%
        // ----------------------------------

        {

            chance:
                0.30,

            type:
                "seed",

            itemId:
                "moonmint",

            minAmount:
                1,

            maxAmount:
                2,

            icon:
                "🌱",

            title:
                "Found Moonmint Seeds",

            text:
                "A few Moonmint seeds were tucked among the leaves and moss."

        },


        // ----------------------------------
        // NIGHTBELL DISCOVERY
        // 17%
        // ----------------------------------

        {

            chance:
                0.17,

            type:
                "discoverySeed",

            plantId:
                "nightbell",

            minAmount:
                1,

            maxAmount:
                1,

            mysteryIcon:
                "✦",

            mysteryTitle:
                "Found a Strange Seed",

            mysteryText:
                "Your familiar returned carrying an unfamiliar seed from deeper within the forest.",

            discoveredText:
                "Your familiar returned with a Nightbell seed gathered from the woodland undergrowth."

        },


        // ----------------------------------
        // NOTHING
        // 8%
        // ----------------------------------

        {

            chance:
                0.08,

            type:
                "nothing",

            icon:
                "🍂",

            title:
                "Nothing Useful",

            text:
                "Your familiar searched the forest but returned with only leaves and damp moss."

        }

    ],


    // ======================================
    // MISTFEN MARSH
    // ======================================

    marsh: [

        // ----------------------------------
        // NIGHTBELL INGREDIENT
        // 40%
        // ----------------------------------

        {

            chance:
                0.40,

            type:
                "ingredient",

            itemId:
                "nightbell",

            minAmount:
                1,

            maxAmount:
                2,

            icon:
                "🪻",

            title:
                "Found Nightbell",

            text:
                "Your familiar returned with Nightbell gathered along the misty marsh edge."

        },


        // ----------------------------------
        // NIGHTBELL SEED
        // 25%
        // ----------------------------------

        {

            chance:
                0.25,

            type:
                "seed",

            itemId:
                "nightbell",

            minAmount:
                1,

            maxAmount:
                2,

            icon:
                "🪻",

            title:
                "Found Nightbell Seeds",

            text:
                "Several Nightbell seeds were gathered from plants growing near the water."

        },


        // ----------------------------------
        // GHOSTCAP DISCOVERY
        // 25%
        // ----------------------------------

        {

            chance:
                0.25,

            type:
                "discoverySeed",

            plantId:
                "ghostcap",

            minAmount:
                1,

            maxAmount:
                1,

            mysteryIcon:
                "✦",

            mysteryTitle:
                "Found Something Strange",

            mysteryText:
                "Your familiar returned from the deepest part of the marsh carrying something pale and unfamiliar. Whatever it may grow into remains a mystery.",

            discoveredText:
                "Your familiar returned with Ghostcap spores gathered from the misty marsh floor."

        },


        // ----------------------------------
        // NOTHING
        // 10%
        // ----------------------------------

        {

            chance:
                0.10,

            type:
                "nothing",

            icon:
                "🌫️",

            title:
                "Lost in the Mist",

            text:
                "The marsh mist grew too thick to search safely. Your familiar returned empty-pawed."

        }

    ],


    // ======================================
    // HOLLOWMERE RUINS
    // ======================================

    ruins: [

        {

            chance:
                1.00,

            type:
                "nothing",

            icon:
                "🕯️",

            title:
                "The Ruins Remain Silent",

            text:
                "The way into Hollowmere remains hidden for now."

        }

    ]

};


// ==========================================
// GET FORAGE LOCATION
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


// ==========================================
// GET REWARD TABLE
// ==========================================

function getForageRewardTable(
    locationId
) {

    return (
        FORAGE_REWARD_DATA[
            locationId
        ] ||
        []
    );

}
