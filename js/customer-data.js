// ==========================================
// MOSSWOOD APOTHECARY
// Customer Data
// V1
// ==========================================


// ==========================================
// CUSTOMER DATA
// ==========================================
//
// Customers are not tied to specific potions.
//
// customers.js chooses:
// - a random customer
// - a random discovered potion
// - a quantity
// - a bonus reward
//
// Dialogue stays with the customer regardless
// of which potion they request.
// ==========================================

const CUSTOMER_DATA = {

    wearyTraveler: {

        id: "wearyTraveler",

        name: "The Weary Traveler",

        dialogue:
            "I was hoping you might have something for me.",

        weight: 10

    },


    woodlandHunter: {

        id: "woodlandHunter",

        name: "The Woodland Hunter",

        dialogue:
            "I have another journey ahead of me. Perhaps you have something useful.",

        weight: 10

    },


    quietScholar: {

        id: "quietScholar",

        name: "The Quiet Scholar",

        dialogue:
            "I believe you may have something I need.",

        weight: 10

    },


    villageHerbalist: {

        id: "villageHerbalist",

        name: "The Village Herbalist",

        dialogue:
            "I heard your shelves have been growing rather interesting lately.",

        weight: 10

    },


    tiredCourier: {

        id: "tiredCourier",

        name: "The Tired Courier",

        dialogue:
            "I cannot stay long. Do you have anything to spare?",

        weight: 10

    },


    wanderingMerchant: {

        id: "wanderingMerchant",

        name: "The Wandering Merchant",

        dialogue:
            "Perhaps we can make a small trade.",

        weight: 8

    },


    cloakedStranger: {

        id: "cloakedStranger",

        name: "The Cloaked Stranger",

        dialogue:
            "I was told this was the place to come.",

        weight: 6

    },


    strangeVisitor: {

        id: "strangeVisitor",

        name: "The Strange Visitor",

        dialogue:
            "You have something I require. I am certain of it.",

        weight: 4

    }

};


// ==========================================
// REQUEST SETTINGS
// ==========================================

const CUSTOMER_REQUEST_SETTINGS = {

    // Customer stays for 10 minutes.

    requestDuration:
        10 * 60 * 1000,


    // Another customer arrives between
    // 30 and 90 seconds later.

    minArrivalDelay:
        30 * 1000,

    maxArrivalDelay:
        90 * 1000,


    // Customer requests pay more than
    // selling directly from the shelf.

    minRewardMultiplier:
        1.20,

    maxRewardMultiplier:
        1.60,


    // Current maximum order size.

    maxQuantity:
        3

};


// ==========================================
// CUSTOMER HELPERS
// ==========================================

function getCustomerData(
    customerId
) {

    return (
        CUSTOMER_DATA[
            customerId
        ] || null
    );

}


function getAllCustomers() {

    return Object.values(
        CUSTOMER_DATA
    );

}
