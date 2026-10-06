// ==========================================
// MOSSWOOD APOTHECARY
// Apothecary Shop V3
// Inventory-Only Potion Shelf
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
// CREATE POTION CARD
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
                REMEDY FOR SALE
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


    button.textContent =
        "Sell Potion";


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
// CREATE EMPTY SHELF MESSAGE
// ==========================================

function createEmptyShelfMessage() {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "shop-potion-card locked";


    card.innerHTML = `

        <div class="shop-potion-icon">
            🧪
        </div>


        <div class="shop-potion-content">

            <span class="card-label">
                EMPTY SHELF
            </span>

            <h4>
                No Potions in Stock
            </h4>

            <p>
                Brew some remedies in the Potion Room
                to stock the Apothecary shelves.
            </p>

        </div>

    `;


    return card;

}


// ==========================================
// GET POTIONS CURRENTLY FOR SALE
// ==========================================

function getPotionsForSale() {

    return Object.values(
        POTION_DATA
    ).filter(
        potion => {

            // Potion must be discovered.

            if (
                !isPotionDiscovered(
                    potion
                )
            ) {

                return false;

            }


            // Potion must actually be in
            // the player's inventory.

            const amount =
                getPotionAmount(
                    potion.id
                );


            return amount > 0;

        }
    );

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


    const potionsForSale =
        getPotionsForSale();


    // --------------------------------------
    // EMPTY SHELF
    // --------------------------------------

    if (
        potionsForSale.length === 0
    ) {

        grid.appendChild(
            createEmptyShelfMessage()
        );

        return;

    }


    // --------------------------------------
    // POTIONS CURRENTLY IN STOCK
    // --------------------------------------

    potionsForSale.forEach(
        potion => {

            grid.appendChild(
                createPotionCard(
                    potion
                )
            );

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
