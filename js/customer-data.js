// ==========================================
// MOSSWOOD APOTHECARY
// Customer Data
// V1
// ==========================================


// ==========================================
// CUSTOMER DATA
// ==========================================
//
// Customers are NOT tied to specific potions.
//
// customers.js will randomly choose:
// 1. A customer
// 2. A potion the player has discovered
// 3. A quantity
// 4. A reward
//
// Dialogue belongs to the customer, so the
// same customer can request any potion.
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
// CUSTOMER REQUEST SETTINGS
// ==========================================

const CUSTOMER_REQUEST_SETTINGS = {

    // How long a customer waits.
    // 10 minutes.

    requestDuration:
        10 * 60 * 1000,


    // Delay before another customer arrives
    // after an order is completed or expires.
    // Random between 30 and 90 seconds.

    minArrivalDelay:
        30 * 1000,

    maxArrivalDelay:
        90 * 1000,


    // Customers pay more than the normal
    // Apothecary sell value.

    minRewardMultiplier:
        1.20,

    maxRewardMultiplier:
        1.60,


    // Maximum number of potions that can
    // currently be requested.

    maxQuantity:
        3

};


// ==========================================
// CUSTOMER HELPERS
// ==========================================

function getCustomerData(customerId) {

    return CUSTOMER_DATA[customerId] || null;

}


function getAllCustomers() {

    return Object.values(CUSTOMER_DATA);

}
