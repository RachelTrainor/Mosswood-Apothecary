// ==========================================
// MOSSWOOD APOTHECARY
// Inventory V1
// ==========================================


// ==========================================
// INVENTORY VALUES
// ==========================================

function getInventoryValues() {

    return {

        moonmint:
            getIngredientAmount(
                "moonmint"
            ),

        moonmintSeeds:
            getSeedAmount(
                "moonmint"
            ),

        strangeSeeds:
            getSeedAmount(
                "unknown"
            ),

        calmPotions:
            getPotionAmount(
                "calm"
            )

    };

}


// ==========================================
// TOTAL ITEMS
// ==========================================

function getInventoryTotal() {

    const items =
        getInventoryValues();


    return (
        items.moonmint
        +
        items.moonmintSeeds
        +
        items.strangeSeeds
        +
        items.calmPotions
    );

}


// ==========================================
// UPDATE DISPLAY
// ==========================================

function renderInventory() {

    updateResourceBar();


    const items =
        getInventoryValues();


    // --------------------------------------
    // TOTAL
    // --------------------------------------

    const totalElement =
        document.getElementById(
            "inventoryTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            getInventoryTotal();

    }


    // --------------------------------------
    // MOONMINT
    // --------------------------------------

    const moonmintElement =
        document.getElementById(
            "inventoryMoonmint"
        );


    if (moonmintElement) {

        moonmintElement.textContent =
            items.moonmint;

    }


    // --------------------------------------
    // MOONMINT SEEDS
    // --------------------------------------

    const seedElement =
        document.getElementById(
            "inventoryMoonmintSeeds"
        );


    if (seedElement) {

        seedElement.textContent =
            items.moonmintSeeds;

    }


    // --------------------------------------
    // STRANGE SEEDS
    // --------------------------------------

    const strangeSeedElement =
        document.getElementById(
            "inventoryStrangeSeeds"
        );


    if (strangeSeedElement) {

        strangeSeedElement.textContent =
            items.strangeSeeds;

    }


    // --------------------------------------
    // POTION OF CALM
    // --------------------------------------

    const calmElement =
        document.getElementById(
            "inventoryCalmPotions"
        );


    if (calmElement) {

        calmElement.textContent =
            items.calmPotions;

    }


    // --------------------------------------
    // STRANGE SEED APPEARANCE
    // --------------------------------------

    const strangeSeedCard =
        document.getElementById(
            "strangeSeedCard"
        );


    if (strangeSeedCard) {

        if (
            items.strangeSeeds > 0
        ) {

            strangeSeedCard.classList.add(
                "discovered-item"
            );

        }

        else {

            strangeSeedCard.classList.remove(
                "discovered-item"
            );

        }

    }

}


// ==========================================
// START INVENTORY
// ==========================================

renderInventory();
