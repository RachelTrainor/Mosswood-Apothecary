// ==========================================
// MOSSWOOD APOTHECARY
// Customer Request System
// V3
// ==========================================


let customerTimerInterval = null;


// ==========================================
// GET DISCOVERED POTIONS
// ==========================================

function getCustomerRequestPotions() {

    return Object.values(
        POTION_DATA
    ).filter(
        potion => {

            return hasDiscovered(
                potion.discoveryId
            );

        }
    );

}


// ==========================================
// CHOOSE RANDOM CUSTOMER
// ==========================================

function chooseRandomCustomer() {

    const customers =
        getAllCustomers();


    if (
        customers.length === 0
    ) {

        return null;

    }


    const totalWeight =
        customers.reduce(
            (total, customer) => {

                return (
                    total +
                    (customer.weight || 1)
                );

            },
            0
        );


    let roll =
        Math.random() *
        totalWeight;


    for (
        const customer
        of customers
    ) {

        roll -=
            customer.weight || 1;


        if (
            roll <= 0
        ) {

            return customer;

        }

    }


    return customers[
        customers.length - 1
    ];

}


// ==========================================
// CHOOSE RANDOM POTION
// ==========================================

function chooseRandomCustomerPotion() {

    const potions =
        getCustomerRequestPotions();


    if (
        potions.length === 0
    ) {

        return null;

    }


    const index =
        Math.floor(
            Math.random() *
            potions.length
        );


    return potions[
        index
    ];

}


// ==========================================
// CHOOSE QUANTITY
// ==========================================

function chooseCustomerQuantity() {

    const roll =
        Math.random();


    // 10% chance of requesting 3.

    if (
        CUSTOMER_REQUEST_SETTINGS
            .maxQuantity >= 3
        &&
        roll >= 0.90
    ) {

        return 3;

    }


    // 25% chance of requesting 2.

    if (
        CUSTOMER_REQUEST_SETTINGS
            .maxQuantity >= 2
        &&
        roll >= 0.65
    ) {

        return 2;

    }


    // 65% chance of requesting 1.

    return 1;

}


// ==========================================
// CALCULATE CUSTOMER REWARD
// ==========================================

function calculateCustomerReward(
    potion,
    quantity
) {

    const normalValue =
        potion.sellPrice *
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
            normalValue *
            multiplier
        )
    );

}


// ==========================================
// GENERATE REQUEST
// ==========================================

function generateCustomerRequest() {

    // Clear the previous customer's message
    // when a new visitor arrives.

    setCustomerMessage("");


    const customer =
        chooseRandomCustomer();


    const potion =
        chooseRandomCustomerPotion();


    if (
        !customer ||
        !potion
    ) {

        return null;

    }


    const quantity =
        chooseCustomerQuantity();


    const reward =
        calculateCustomerReward(
            potion,
            quantity
        );


    const now =
        Date.now();


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
// NEXT CUSTOMER DELAY
// ==========================================

function getRandomCustomerDelay() {

    const minimum =
        CUSTOMER_REQUEST_SETTINGS
            .minArrivalDelay;


    const maximum =
        CUSTOMER_REQUEST_SETTINGS
            .maxArrivalDelay;


    return Math.floor(
        minimum +
        Math.random() *
        (maximum - minimum)
    );

}


// ==========================================
// SCHEDULE NEXT CUSTOMER
// ==========================================

function scheduleNextCustomer() {

    game.customers.active =
        null;


    game.customers.nextCustomerAt =
        Date.now() +
        getRandomCustomerDelay();


    saveGame();

}


// ==========================================
// CUSTOMER MESSAGE
// ==========================================

function setCustomerMessage(
    message
) {

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
// FORMAT TIME
// ==========================================

function formatCustomerTime(
    milliseconds
) {

    const totalSeconds =
        Math.max(
            0,
            Math.ceil(
                milliseconds /
                1000
            )
        );


    const minutes =
        Math.floor(
            totalSeconds /
            60
        );


    const seconds =
        totalSeconds %
        60;


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
// FULFILL REQUEST
// ==========================================

function fulfillCustomerRequest() {

    const request =
        game.customers.active;


    if (!request) {

        return;

    }


    const potion =
        getPotionData(
            request.potionId
        );


    const customer =
        getCustomerData(
            request.customerId
        );


    if (
        !potion ||
        !customer
    ) {

        return;

    }


    const amount =
        getPotionAmount(
            potion.id
        );


    if (
        amount <
        request.quantity
    ) {

        setCustomerMessage(
            `You need ${request.quantity} ${potion.name}, but only have ${amount}.`
        );

        return;

    }


    // --------------------------------------
    // REMOVE POTIONS
    // --------------------------------------

    game.potions[
        potion.id
    ] -= request.quantity;


    // --------------------------------------
    // ADD REWARD
    // --------------------------------------

    game.coins +=
        request.reward;


    // --------------------------------------
    // CLEAR REQUEST + SCHEDULE NEXT
    // --------------------------------------

    game.customers.active =
        null;


    game.customers.nextCustomerAt =
        Date.now() +
        getRandomCustomerDelay();


    // --------------------------------------
    // SAVE
    // --------------------------------------

    saveGame();


    // --------------------------------------
    // UPDATE UI
    // --------------------------------------

    updateResourceBar();

    renderPotionShelf();


    setCustomerMessage(
        `${customer.name} accepted the order. You earned ${request.reward} coins.`
    );


    renderCustomerRequest();

}


// ==========================================
// CHECK CUSTOMER STATE
// ==========================================

function updateCustomerSystem() {

    const now =
        Date.now();


    // --------------------------------------
    // ACTIVE CUSTOMER EXPIRED
    // --------------------------------------

    if (
        game.customers.active &&
        now >=
        game.customers.active.expiresAt
    ) {

        game.customers.active =
            null;


        game.customers.nextCustomerAt =
            now +
            getRandomCustomerDelay();


        saveGame();

    }


    // --------------------------------------
    // NO ACTIVE CUSTOMER
    // --------------------------------------

    if (
        !game.customers.active
    ) {

        // First visit to the Apothecary:
        // allow a customer immediately.

        if (
            !game.customers.nextCustomerAt
        ) {

            game.customers.nextCustomerAt =
                now;

        }


        // Time for a new visitor.

        if (
            now >=
            game.customers.nextCustomerAt
        ) {

            const request =
                generateCustomerRequest();


            // Only create a request if the
            // player has discovered a potion.

            if (request) {

                game.customers.active =
                    request;


                game.customers.nextCustomerAt =
                    0;


                saveGame();

            }

        }

    }


    renderCustomerRequest();

}


// ==========================================
// RENDER CUSTOMER REQUEST
// ==========================================

function renderCustomerRequest() {

    const container =
        document.getElementById(
            "customerRequest"
        );


    if (!container) {

        return;

    }


    // ======================================
    // ACTIVE REQUEST
    // ======================================

    if (
        game.customers.active
    ) {

        const request =
            game.customers.active;


        const customer =
            getCustomerData(
                request.customerId
            );


        const potion =
            getPotionData(
                request.potionId
            );


        if (
            !customer ||
            !potion
        ) {

            container.innerHTML = `
                <div class="customer-card customer-empty">

                    <h3>
                        The shop is quiet.
                    </h3>

                </div>
            `;

            return;

        }


        const amount =
            getPotionAmount(
                potion.id
            );


        const remaining =
            request.expiresAt -
            Date.now();


        const canFulfill =
            amount >=
            request.quantity;


        container.innerHTML = `

            <div class="customer-card">

                <span class="card-label">
                    CUSTOMER REQUEST
                </span>


                <h3>
                    ${customer.name}
                </h3>


                <p class="customer-dialogue">
                    “${customer.dialogue}”
                </p>


                <div class="customer-order">

                    <div class="customer-order-icon">

                        ${
                            potion.inventoryIcon ||
                            potion.icon ||
                            "🧪"
                        }

                    </div>


                    <div>

                        <span class="card-label">
                            REQUESTING
                        </span>

                        <h4>
                            ${potion.name}
                            ×${request.quantity}
                        </h4>

                        <p>
                            You currently have
                            ${amount}.
                        </p>

                    </div>

                </div>


                <div class="customer-details">

                    <div>

                        <span class="card-label">
                            REWARD
                        </span>

                        <strong>
                            🪙 ${request.reward}
                        </strong>

                    </div>


                    <div>

                        <span class="card-label">
                            LEAVES IN
                        </span>

                        <strong
                            id="customerTimer">

                            ${formatCustomerTime(
                                remaining
                            )}

                        </strong>

                    </div>

                </div>


                <button
                    class="sell-potion-button"
                    id="fulfillCustomerButton"
                    ${canFulfill ? "" : "disabled"}>

                    ${
                        canFulfill
                            ? "Fulfill Request"
                            : "Not Enough Potions"
                    }

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


    // ======================================
    // NO ACTIVE CUSTOMER
    // ======================================

    const remaining =
        Math.max(
            0,
            game.customers
                .nextCustomerAt -
            Date.now()
        );


    // No discovered potions yet.

    if (
        getCustomerRequestPotions()
            .length === 0
    ) {

        container.innerHTML = `

            <div class="customer-card customer-empty">

                <span class="card-label">
                    CUSTOMER REQUESTS
                </span>

                <h3>
                    No remedies to request yet.
                </h3>

                <p>
                    Discover a potion in the
                    Potion Room and visitors may
                    begin requesting it.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="customer-card customer-empty">

            <span class="card-label">
                CUSTOMER REQUESTS
            </span>

            <h3>
                The shop is quiet.
            </h3>

            <p>
                Another visitor may arrive soon.
            </p>


            <span class="card-label">
                NEXT VISITOR
            </span>

            <strong
                id="customerArrivalTimer">

                ${formatCustomerTime(
                    remaining
                )}

            </strong>

        </div>

    `;

}


// ==========================================
// UPDATE TIMERS
// ==========================================

function updateCustomerTimers() {

    const now =
        Date.now();


    // --------------------------------------
    // ACTIVE CUSTOMER TIMER
    // --------------------------------------

    if (
        game.customers.active
    ) {

        const remaining =
            game.customers.active
                .expiresAt -
            now;


        const timer =
            document.getElementById(
                "customerTimer"
            );


        if (timer) {

            timer.textContent =
                formatCustomerTime(
                    remaining
                );

        }


        if (
            remaining <= 0
        ) {

            updateCustomerSystem();

        }


        return;

    }


    // --------------------------------------
    // ARRIVAL TIMER
    // --------------------------------------

    const remaining =
        game.customers
            .nextCustomerAt -
        now;


    const timer =
        document.getElementById(
            "customerArrivalTimer"
        );


    if (timer) {

        timer.textContent =
            formatCustomerTime(
                remaining
            );

    }


    if (
        game.customers
            .nextCustomerAt &&
        remaining <= 0
    ) {

        updateCustomerSystem();

    }

}


// ==========================================
// INITIALIZE
// ==========================================

function initializeCustomerSystem() {

    updateCustomerSystem();


    if (
        customerTimerInterval
    ) {

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
