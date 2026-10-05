// ==========================================
// MOSSWOOD APOTHECARY
// Inventory V2
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

        nightbell:
            getIngredientAmount(
                "nightbell"
            ),

        moonmintSeeds:
            getSeedAmount(
                "moonmint"
            ),

        strangeSeeds:
            getSeedAmount(
                "unknown"
            ),

        nightbellSeeds:
            getSeedAmount(
                "nightbell"
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
        items.nightbell
        +
        items.moonmintSeeds
        +
        items.strangeSeeds
        +
        items.nightbellSeeds
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
    // NIGHTBELL
    // --------------------------------------

    const nightbellElement =
        document.getElementById(
            "inventoryNightbell"
        );


    if (nightbellElement) {

        nightbellElement.textContent =
            items.nightbell;

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
    // NIGHTBELL SEEDS
    // --------------------------------------

    const nightbellSeedElement =
        document.getElementById(
            "inventoryNightbellSeeds"
        );


    if (nightbellSeedElement) {

        nightbellSeedElement.textContent =
            items.nightbellSeeds;

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


    // --------------------------------------
    // NIGHTBELL APPEARANCE
    // --------------------------------------

    const nightbellCard =
        document.getElementById(
            "nightbellCard"
        );


    if (nightbellCard) {

        if (
            hasDiscovered("nightbell")
            ||
            items.nightbell > 0
        ) {

            nightbellCard.classList.add(
                "discovered-item"
            );

        }

    }


    const nightbellSeedCard =
        document.getElementById(
            "nightbellSeedCard"
        );


    if (nightbellSeedCard) {

        if (
            hasDiscovered("nightbell")
            ||
            items.nightbellSeeds > 0
        ) {

            nightbellSeedCard.classList.add(
                "discovered-item"
            );

        }

    }

}


// ==========================================
// START INVENTORY
// ==========================================

renderInventory();
