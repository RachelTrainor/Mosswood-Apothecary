// ==========================================
// MOSSWOOD APOTHECARY
// Apothecary Shop V1
// ==========================================


// ==========================================
// SHOP SETTINGS
// ==========================================

const CALM_POTION_PRICE = 15;


// ==========================================
// SELL POTION OF CALM
// ==========================================

function sellCalmPotion() {

    const potionAmount =
        getPotionAmount("calm");


    // Player has no Potion of Calm.

    if (potionAmount <= 0) {

        showSaleResult(
            "Nothing to Sell",
            "You do not have any Potions of Calm in stock.",
            "🧪"
        );

        return;

    }


    // Remove one potion.

    game.potions.calm--;


    // Add coins.

    game.coins +=
        CALM_POTION_PRICE;


    // Save progress.

    saveGame();


    // Update screen.

    updateResourceBar();

    renderApothecary();


    // Show transaction.

    showSaleResult(
        "Potion Sold",
        `A customer purchased a Potion of Calm for ${CALM_POTION_PRICE} coins.`,
        "🪙"
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
// RENDER POTION STOCK
// ==========================================

function renderPotionStock() {

    const stock =
        document.getElementById(
            "calmPotionStock"
        );


    const sellButton =
        document.getElementById(
            "sellCalmPotion"
        );


    const amount =
        getPotionAmount(
            "calm"
        );


    if (stock) {

        stock.textContent =
            amount;

    }


    if (sellButton) {

        // Disable the button when
        // there is nothing to sell.

        sellButton.disabled =
            amount <= 0;


        if (amount <= 0) {

            sellButton.textContent =
                "Out of Stock";

        }

        else {

            sellButton.textContent =
                "Sell Potion";

        }

    }

}


// ==========================================
// RENDER APOTHECARY
// ==========================================

function renderApothecary() {

    updateResourceBar();

    renderPotionStock();

}


// ==========================================
// SELL BUTTON
// ==========================================

const sellCalmPotionButton =
    document.getElementById(
        "sellCalmPotion"
    );


if (sellCalmPotionButton) {

    sellCalmPotionButton.addEventListener(
        "click",
        sellCalmPotion
    );

}


// ==========================================
// START APOTHECARY
// ==========================================

renderApothecary();
