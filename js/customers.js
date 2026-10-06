// ==========================================
// MOSSWOOD APOTHECARY
// Customer Request System
// V1
// ==========================================


// ==========================================
// CUSTOMER STATE
// ==========================================

let customerTimerInterval = null;


// ==========================================
// GET DISCOVERED POTIONS
// ==========================================

function getCustomerRequestPotions() {

    if (
        typeof POTION_DATA === "undefined"
    ) {
        return [];
    }


    return Object.values(POTION_DATA)
        .filter(potion => {

            if (!potion.discoveryId) {
                return true;
            }


            if (
                typeof hasDiscovered
                !== "function"
            ) {
                return false;
            }


            return hasDiscovered(
                potion.discoveryId
            );

        });

}


// ==========================================
// RANDOM CUSTOMER
// ==========================================

function chooseRandomCustomer() {

    const customers =
        Object.values(CUSTOMER_DATA);


    if (customers.length === 0) {
        return null;
    }


    const totalWeight =
        customers.reduce(
            (total, customer) =>
                total +
                (customer.weight || 1),
            0
        );


    let roll =
        Math.random() * totalWeight;


    for (const customer of customers) {

        roll -= customer.weight || 1;


        if (roll <= 0) {
            return customer;
        }

    }


    return customers[
        customers.length - 1
    ];

}


// ==========================================
// RANDOM POTION
// ==========================================

function chooseRandomCustomerPotion() {

    const availablePotions =
        getCustomerRequestPotions();


    if (availablePotions.length === 0) {
        return null;
    }


    const index =
        Math.floor(
            Math.random() *
            availablePotions.length
        );


    return availablePotions[index];

}


// ==========================================
// REQUEST QUANTITY
// ==========================================

function chooseCustomerQuantity() {

    // Most requests will only ask for one.
    // Larger orders are less common.

    const roll = Math.random();


    if (
        CUSTOMER_REQUEST_SETTINGS.maxQuantity >= 3 &&
        roll >= 0.90
    ) {
        return 3;
    }


    if (
        CUSTOMER_REQUEST_SETTINGS.maxQuantity >= 2 &&
        roll >= 0.65
    ) {
        return 2;
    }


    return 1;

}


// ==========================================
// CALCULATE REWARD
// ==========================================

function calculateCustomerReward(
    potion,
    quantity
) {

    const normalValue =
        (potion.sellValue || 1) *
        quantity;


    const minimum =
        CUSTOMER_REQUEST_SETTINGS
            .minRewardMultiplier;


    const maximum =
        CUSTOMER_REQUEST_SETTINGS
            .maxRewardMultiplier;


    const multiplier =
        minimum +
        Math.random() *
        (maximum - minimum);


    return Math.max(
        normalValue + 1,
        Math.round(
            normalValue * multiplier
        )
    );

}


// ==========================================
// CREATE CUSTOMER REQUEST
// ==========================================

function generateCustomerRequest() {

    const customer =
        chooseRandomCustomer();

    const potion =
        chooseRandomCustomerPotion();


    if (!customer || !potion) {
        return null;
    }


    const quantity =
        chooseCustomerQuantity();


    const reward =
        calculateCustomerReward(
            potion,
            quantity
        );


    const now = Date.now();


    return {

        customerId:
            customer.id,

        potionId:
            potion.id,

        quantity:
            quantity,

        reward:
            reward,

        createdAt:
            now,

        expiresAt:
            now +
            CUSTOMER_REQUEST_SETTINGS
                .requestDuration

    };

}


// ==========================================
// ENSURE CUSTOMER SAVE DATA
// ==========================================

function ensureCustomerState() {

    if (
        typeof game === "undefined"
    ) {
        return;
    }


    if (
        !Object.prototype.hasOwnProperty.call(
            game,
            "activeCustomer"
        )
    ) {
        game.activeCustomer = null;
    }


    if (
        !Object.prototype.hasOwnProperty.call(
            game,
            "nextCustomerAt"
        )
    ) {
        game.nextCustomerAt = 0;
    }

}


// ==========================================
// SAVE CUSTOMER STATE
// ==========================================

function saveCustomerState() {

    if (
        typeof saveGame === "function"
    ) {
        saveGame();
    }

}


// ==========================================
// SCHEDULE NEXT CUSTOMER
// ==========================================

function scheduleNextCustomer() {

    const minimum =
        CUSTOMER_REQUEST_SETTINGS
            .minArrivalDelay;

    const maximum =
        CUSTOMER_REQUEST_SETTINGS
            .maxArrivalDelay;


    const delay =
        Math.floor(
            minimum +
            Math.random() *
            (maximum - minimum)
        );


    game.nextCustomerAt =
        Date.now() + delay;


    saveCustomerState();

}


// ==========================================
// CHECK FOR CUSTOMER
// ==========================================

function updateCustomerSystem() {

    ensureCustomerState();


    if (
        typeof game === "undefined"
    ) {
        return;
    }


    const now = Date.now();


    // ------------------------------
    // EXPIRED CUSTOMER
    // ------------------------------

    if (
        game.activeCustomer &&
        now >=
        game.activeCustomer.expiresAt
    ) {

        game.activeCustomer = null;

        scheduleNextCustomer();

    }


    // ------------------------------
    // WAITING FOR NEXT CUSTOMER
    // ------------------------------

    if (!game.activeCustomer) {

        if (!game.nextCustomerAt) {

            game.nextCustomerAt =
                now;

        }


        if (
            now >=
            game.nextCustomerAt
        ) {

            const request =
                generateCustomerRequest();


            if (request) {

                game.activeCustomer =
                    request;

                game.nextCustomerAt =
                    0;

                saveCustomerState();

            }

        }

    }


    renderCustomerRequest();

}


// ==========================================
// GET POTION AMOUNT
// ==========================================

function getCustomerPotionAmount(
    potionId
) {

    if (
        !game ||
        !game.potions
    ) {
        return 0;
    }


    return Number(
        game.potions[potionId]
    ) || 0;

}


// ==========================================
// FULFILL REQUEST
// ==========================================

function fulfillCustomerRequest() {

    if (!game.activeCustomer) {
        return;
    }


    const request =
        game.activeCustomer;


    const potion =
        typeof getPotionData === "function"
            ? getPotionData(
                request.potionId
            )
            : POTION_DATA[
                request.potionId
            ];


    if (!potion) {
        return;
    }


    const owned =
        getCustomerPotionAmount(
            request.potionId
        );


    if (
        owned <
        request.quantity
    ) {

        setCustomerMessage(
            "You do not have enough of that potion."
        );

        return;
    }


    game.potions[
        request.potionId
    ] -= request.quantity;


    game.coins =
        (Number(game.coins) || 0) +
        request.reward;


    const customer =
        getCustomerData(
            request.customerId
        );


    const customerName =
        customer
            ? customer.name
            : "The customer";


    game.activeCustomer = null;


    scheduleNextCustomer();


    saveCustomerState();


    if (
        typeof updateResourceBar
        === "function"
    ) {
        updateResourceBar();
    }


    setCustomerMessage(
        `${customerName} accepted the order. You earned ${request.reward} coins.`
    );


    renderCustomerRequest();


    // Refresh normal Apothecary potion
    // cards if that function exists.

    if (
        typeof renderApothecary
        === "function"
    ) {
        renderApothecary();
    }

}


// ==========================================
// FORMAT TIMER
// ==========================================

function formatCustomerTime(
    milliseconds
) {

    const totalSeconds =
        Math.max(
            0,
            Math.ceil(
                milliseconds / 1000
            )
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(seconds)
            .padStart(2, "0")
    );

}


// ==========================================
// CUSTOMER MESSAGE
// ==========================================

function setCustomerMessage(message) {

    const element =
        document.getElementById(
            "customerMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message || "";

}


// ==========================================
// RENDER CUSTOMER
// ==========================================

function renderCustomerRequest() {

    const container =
        document.getElementById(
            "customerRequest"
        );


    if (!container) {
        return;
    }


    // ------------------------------
    // ACTIVE CUSTOMER
    // ------------------------------

    if (game.activeCustomer) {

        const request =
            game.activeCustomer;


        const customer =
            getCustomerData(
                request.customerId
            );


        const potion =
            typeof getPotionData
                === "function"
                ? getPotionData(
                    request.potionId
                )
                : POTION_DATA[
                    request.potionId
                ];


        if (!customer || !potion) {

            container.innerHTML = `
                <p>
                    The shop is quiet.
                </p>
            `;

            return;
        }


        const owned =
            getCustomerPotionAmount(
                request.potionId
            );


        const remaining =
            request.expiresAt -
            Date.now();


        const canFulfill =
            owned >=
            request.quantity;


        container.innerHTML = `

            <div class="customer-card">

                <div class="customer-heading">

                    <div>

                        <span class="eyebrow">
                            CUSTOMER REQUEST
                        </span>

                        <h3>
                            ${customer.name}
                        </h3>

                    </div>

                </div>


                <p class="customer-dialogue">
                    “${customer.dialogue}”
                </p>


                <div class="customer-order">

                    <span>
                        ${potion.inventoryIcon || potion.icon || "🧪"}
                    </span>

                    <div>

                        <strong>
                            ${potion.name}
                            ×${request.quantity}
                        </strong>

                        <small>
                            You have ${owned}
                        </small>

                    </div>

                </div>


                <div class="customer-details">

                    <span>
                        Reward:
                        <strong>
                            ${request.reward} coins
                        </strong>
                    </span>

                    <span>
                        Leaves in:
                        <strong id="customerTimer">
                            ${formatCustomerTime(
                                remaining
                            )}
                        </strong>
                    </span>

                </div>


                <button
                    class="primary-button"
                    id="fulfillCustomerButton"
                    ${canFulfill ? "" : "disabled"}
                >
                    Fulfill Request
                </button>

            </div>

        `;


        const button =
            document.getElementById(
                "fulfillCustomerButton"
            );


        if (button) {

            button.addEventListener(
                "click",
                fulfillCustomerRequest
            );

        }


        return;

    }


    // ------------------------------
    // WAITING FOR CUSTOMER
    // ------------------------------

    const remaining =
        Math.max(
            0,
            game.nextCustomerAt -
            Date.now()
        );


    container.innerHTML = `

        <div class="customer-card customer-empty">

            <span class="eyebrow">
                CUSTOMER REQUESTS
            </span>

            <h3>
                The shop is quiet.
            </h3>

            <p>
                Another visitor may arrive soon.
            </p>

            ${
                remaining > 0
                    ? `
                        <small>
                            Next visitor in
                            <strong id="customerArrivalTimer">
                                ${formatCustomerTime(
                                    remaining
                                )}
                            </strong>
                        </small>
                    `
                    : ""
            }

        </div>

    `;

}


// ==========================================
// TIMER DISPLAY
// ==========================================

function updateCustomerTimers() {

    if (
        typeof game === "undefined"
    ) {
        return;
    }


    const now =
        Date.now();


    if (game.activeCustomer) {

        const timer =
            document.getElementById(
                "customerTimer"
            );


        const remaining =
            game.activeCustomer.expiresAt -
            now;


        if (timer) {

            timer.textContent =
                formatCustomerTime(
                    remaining
                );

        }


        if (remaining <= 0) {

            updateCustomerSystem();

        }


        return;

    }


    const arrivalTimer =
        document.getElementById(
            "customerArrivalTimer"
        );


    if (arrivalTimer) {

        arrivalTimer.textContent =
            formatCustomerTime(
                game.nextCustomerAt -
                now
            );

    }


    if (
        game.nextCustomerAt &&
        now >= game.nextCustomerAt
    ) {

        updateCustomerSystem();

    }

}


// ==========================================
// INITIALIZE CUSTOMER SYSTEM
// ==========================================

function initializeCustomerSystem() {

    ensureCustomerState();

    updateCustomerSystem();


    if (customerTimerInterval) {

        clearInterval(
            customerTimerInterval
        );

    }


    customerTimerInterval =
        setInterval(
            updateCustomerTimers,
            1000
        );

}


initializeCustomerSystem();
