// ==========================================
// MOSSWOOD APOTHECARY
// Apothecary Shop V2
// Dynamic Potion Shop
// ==========================================


// ==========================================
// CHECK POTION DISCOVERY
// ==========================================

function isPotionDiscovered(
    potion
) {

    return hasDiscovered(
        potion.discoveryId
    );

}


// ==========================================
// SALES JOURNAL
// ==========================================

function showSaleResult(
    title,
    message,
    icon
) {

    const result =
        document.getElementById(
            "saleResult"
        );


    if (!result) {

        return;

    }


    result.innerHTML = `

        <span class="sale-result-icon">

            ${icon}

        </span>


        <div>

            <span class="card-label">
                SALES JOURNAL
            </span>

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


// ==========================================
// SELL POTION
// ==========================================

function sellPotion(
    potionId
) {

    const potion =
        getPotionData(
            potionId
        );


    if (!potion) {

        return;

    }


    const amount =
        getPotionAmount(
            potionId
        );


    // --------------------------------------
    // NOTHING TO SELL
    // --------------------------------------

    if (
        amount <= 0
    ) {

        showSaleResult(
            "Nothing to Sell",
            `You do not have any ${potion.name} in stock.`,
            potion.inventoryIcon || "🧪"
        );

        return;

    }


    // --------------------------------------
    // REMOVE POTION
    // --------------------------------------

    game.potions[
        potionId
    ]--;


    // --------------------------------------
    // ADD COINS
    // --------------------------------------

    game.coins +=
        potion.sellPrice;


    // --------------------------------------
    // SAVE
    // --------------------------------------

    saveGame();


    // --------------------------------------
    // UPDATE SCREEN
    // --------------------------------------

    updateResourceBar();

    renderPotionShelf();


    // --------------------------------------
    // SALES JOURNAL
    // --------------------------------------

    showSaleResult(
        "Potion Sold",
        `A customer purchased ${potion.name} for ${potion.sellPrice} coins.`,
        "🪙"
    );

}


// ==========================================
// CREATE DISCOVERED POTION CARD
// ==========================================

function createPotionCard(
    potion
) {

    const amount =
        getPotionAmount(
            potion.id
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "shop-potion-card";


    card.innerHTML = `

        <div class="shop-potion-icon">
            ${
                potion.inventoryIcon ||
                potion.icon ||
                "🧪"
            }
        </div>


        <div class="shop-potion-content">

            <span class="card-label">
                DISCOVERED REMEDY
            </span>

            <h4>
                ${potion.name}
            </h4>

            <p>
                ${potion.description}
            </p>


            <div class="shop-potion-details">

                <div>

                    <span>
                        IN STOCK
                    </span>

                    <strong>
                        ${amount}
                    </strong>

                </div>


                <div>

                    <span>
                        VALUE
                    </span>

                    <strong>
                        🪙 ${potion.sellPrice}
                    </strong>

                </div>

            </div>

        </div>

    `;


    // --------------------------------------
    // SELL BUTTON
    // --------------------------------------

    const button =
        document.createElement(
            "button"
        );


    button.className =
        "sell-potion-button";


    button.disabled =
        amount <= 0;


    if (
        amount <= 0
    ) {

        button.textContent =
            "Out of Stock";

    }

    else {

        button.textContent =
            "Sell Potion";

    }


    button.addEventListener(
        "click",
        () => {

            sellPotion(
                potion.id
            );

        }
    );


    const content =
        card.querySelector(
            ".shop-potion-content"
        );


    if (content) {

        content.appendChild(
            button
        );

    }


    return card;

}


// ==========================================
// CREATE UNKNOWN POTION CARD
// ==========================================

function createUnknownPotionCard() {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "shop-potion-card locked";


    card.innerHTML = `

        <div class="shop-potion-icon">
            ?
        </div>


        <div class="shop-potion-content">

            <span class="card-label">
                EMPTY SHELF
            </span>

            <h4>
                Unknown Remedy
            </h4>

            <p>
                Experiment in the Potion Room
                to discover another remedy for sale.
            </p>


            <button
                class="sell-potion-button"
                disabled>

                Undiscovered

            </button>

        </div>

    `;


    return card;

}


// ==========================================
// RENDER POTION SHELF
// ==========================================

function renderPotionShelf() {

    const grid =
        document.getElementById(
            "shopPotionGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    Object.values(
        POTION_DATA
    ).forEach(
        potion => {

            if (
                isPotionDiscovered(
                    potion
                )
            ) {

                grid.appendChild(
                    createPotionCard(
                        potion
                    )
                );

            }

            else {

                grid.appendChild(
                    createUnknownPotionCard()
                );

            }

        }
    );

}


// ==========================================
// RENDER APOTHECARY
// ==========================================

function renderApothecary() {

    updateResourceBar();

    renderPotionShelf();

}


// ==========================================
// START APOTHECARY
// ==========================================

renderApothecary();
