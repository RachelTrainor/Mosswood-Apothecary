// ==========================================
// MOSSWOOD APOTHECARY
// Foraging Data
// V1
// ==========================================


// ==========================================
// ACTIVE FORAGING SETTINGS
// ==========================================

const FORAGE_ACTIVE_CLICK_BOOST =
    1000;


// ==========================================
// FORAGING LOCATIONS
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

        type:
            "FOREST",

        icon:
            "🌲",

        description:
            "A shadowed woodland filled with moss, old trees, and plants that thrive far from the greenhouse.",

        duration:
            30 * 1000,

        unlockedByDefault:
            true,

        unlockCost:
            0,

        discoveryRequirement:
            null,

        findLabel:
            "Common Finds",

        activeText:
            "Your familiar is searching the forest floor, roots, and forgotten paths."

    },


    // --------------------------------------
    // MISTFEN MARSH
    // --------------------------------------

    marsh: {

        id:
            "marsh",

        name:
            "Mistfen Marsh",

        type:
            "MARSH",

        icon:
            "🌫️",

        description:
            "Pale lights drift through the reeds. Something unusual grows beneath the mist.",

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

        findLabel:
            "Uncommon Finds",

        activeText:
            "Your familiar disappears into the reeds and pale marsh mist."

    },


    // --------------------------------------
    // HOLLOWMERE RUINS
    // --------------------------------------

    ruins: {

        id:
            "ruins",

        name:
            "Hollowmere Ruins",

        type:
            "RUINS",

        icon:
            "🕯️",

        description:
            "Crumbling stone lies hidden beneath vines and roots. Few paths still lead there.",

        duration:
            60 * 1000,

        unlockedByDefault:
            false,

        unlockCost:
            null,

        discoveryRequirement:
            null,

        requirementHidden:
            true,

        findLabel:
            "Unknown Finds",

        activeText:
            "Your familiar moves carefully among the forgotten stones."

    }

};


// ==========================================
// FOREST REWARD TABLE
// ==========================================

const FOREST_FORAGE_REWARDS = [

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

        text:
            "Your familiar returned carrying fresh Moonmint gathered beneath the forest canopy."
    },


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

        text:
            "A few small seeds were discovered tangled among the moss."
    },


    {
        chance:
            0.17,

        type:
            "mysterySeed",

        revealsPlant:
            "nightbell",

        minAmount:
            1,

        maxAmount:
            1,

        icon:
            "✦",

        title:
            "Found a Strange Seed",

        text:
            "Your familiar returned with a dark, unfamiliar seed. Whatever it grows into remains a mystery."
    },


    {
        chance:
            0.08,

        type:
            "nothing",

        icon:
            "🐈‍⬛",

        title:
            "Nothing This Time",

        text:
            "Your familiar returned empty-pawed, though perhaps the forest will be more generous next time."
    }

];


// ==========================================
// TEMPORARY MARSH REWARD TABLE
// ==========================================
//
// No new botanical is being introduced yet.
// When we create the next plant, this is where
// we can add its Strange Seed reward.
// ==========================================

const MARSH_FORAGE_REWARDS = [

    {
        chance:
            0.40,

        type:
            "ingredient",

        itemId:
            "moonmint",

        minAmount:
            2,

        maxAmount:
            3,

        icon:
            "🌿",

        text:
            "Your familiar found Moonmint growing thickly along the damp edges of the marsh."
    },


    {
        chance:
            0.30,

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

        text:
            "A cluster of Nightbell was discovered among the mist-covered reeds."
    },


    {
        chance:
            0.20,

        type:
            "seed",

        itemId:
            "nightbell",

        minAmount:
            1,

        maxAmount:
            1,

        icon:
            "🪻",

        text:
            "Your familiar returned with a Nightbell seed caught carefully between its paws."
    },


    {
        chance:
            0.10,

        type:
            "nothing",

        icon:
            "🐈‍⬛",

        title:
            "Lost in the Mist",

        text:
            "The marsh gave up no treasures this time. Your familiar returned damp, annoyed, and empty-pawed."
    }

];


// ==========================================
// LOCATION HELPERS
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
// REWARD TABLE HELPER
// ==========================================

function getForageRewardTable(
    locationId
) {

    if (
        locationId ===
        "forest"
    ) {

        return FOREST_FORAGE_REWARDS;

    }


    if (
        locationId ===
        "marsh"
    ) {

        return MARSH_FORAGE_REWARDS;

    }


    return [];

}
