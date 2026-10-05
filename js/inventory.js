// ==========================================
// MOSSWOOD APOTHECARY
// Inventory V4
// Dynamic Planting Materials
// ==========================================


// ==========================================
// SHOULD SHOW PLANT
// ==========================================

function shouldShowPlant(
    plant
) {

    if (
        plant.alwaysKnown
    ) {

        return true;

    }


    if (
        hasDiscovered(
            plant.id
        )
    ) {

        return true;

    }


    if (
        getIngredientAmount(
            plant.id
        ) > 0
    ) {

        return true;

    }


    if (
        getSeedAmount(
            plant.id
        ) > 0
    ) {

        return true;

    }


    return false;

}


// ==========================================
// TOTAL ITEMS
// ==========================================

function getInventoryTotal() {

    let total = 0;


    // --------------------------------------
    // INGREDIENTS
    // --------------------------------------

    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            total +=
                getIngredientAmount(
                    plant.id
                );

        }
    );


    // --------------------------------------
    // PLANTING MATERIALS
    // --------------------------------------

    Object.values(
        PLANT_DATA
    ).forEach(
        plant => {

            total +=
                getSeedAmount(
                    plant.id
                );

        }
    );


    // --------------------------------------
    // MYSTERY SEEDS
    // --------------------------------------

    total +=
        getSeedAmount(
            "unknown"
        );


    // --------------------------------------
    // POTIONS
    // --------------------------------------

    Object.values(
        POTION_DATA
    ).forEach(
        potion => {

            total +=
                getPotionAmount(
                    potion.id
                );

        }
    );


    return total;

}


// ==========================================
// CREATE INVENTORY CARD
// ==========================================

function createInventoryCard(
    icon,
    label,
    name,
    description,
    amount,
    extraClass = ""
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "inventory-card";


    if (extraClass) {

        card.classList.add(
            extraClass
        );

    }


    card.innerHTML = `

        <div class="inventory-icon">
            ${icon}
        </div>

        <div class="inventory-card-content">

            <span class="card-label">
                ${label}
            </span>

            <h4>
                ${name}
            </h4>

            <p>
                ${description}
            </p>

        </div>

        <div class="inventory-quantity">

            <span>
                OWNED
            </span>

            <strong>
                ${amount}
            </strong>

        </div>

    `;


    return card;

}


// ==========================================
// RENDER INGREDIENTS
// ==========================================

function renderIngredients() {

    const container =
        document.getElementById(
            "ingredientInventory"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const plants =
        Object.values(
            PLANT_DATA
        ).filter(
            plant =>
                shouldShowPlant(
                    plant
                )
        );


    plants.forEach(
        plant => {

            const amount =
                getIngredientAmount(
                    plant.id
                );


            const card =
                createInventoryCard(

                    plant.icon,

                    plant.type
                        ? plant.type.toUpperCase()
                        : "BOTANICAL",

                    plant.name,

                    plant.description,

                    amount,

                    hasDiscovered(
                        plant.id
                    )
                        ? "discovered-item"
                        : ""

                );


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// RENDER PLANTING MATERIALS
// ==========================================

function renderSeeds() {

    const container =
        document.getElementById(
            "seedInventory"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // --------------------------------------
    // KNOWN PLANTING MATERIALS
    // --------------------------------------

    Object.values(
        PLANT_DATA
    )
        .filter(
            plant =>
                shouldShowPlant(
                    plant
                )
        )
        .forEach(
            plant => {

                const amount =
                    getSeedAmount(
                        plant.id
                    );


                const plantingName =
                    getPlantingItemName(
                        plant.id,
                        amount === 1
                            ? 1
                            : 2
                    );


                const plantingType =
                    getPlantingItemGenericName(
                        plant.id,
                        1
                    );


                const plantingIcon =
                    getPlantingItemIcon(
                        plant.id
                    );


                const description =
                    `${plantingName} from ${plant.name}, ready to be planted in the greenhouse.`;


                const card =
                    createInventoryCard(

                        plantingIcon,

                        `KNOWN ${plantingType.toUpperCase()}`,

                        plantingName,

                        description,

                        amount,

                        hasDiscovered(
                            plant.id
                        )
                            ? "discovered-item"
                            : ""

                    );


                container.appendChild(
                    card
                );

            }
        );


    // --------------------------------------
    // STRANGE SEEDS
    // --------------------------------------

    const strangeSeed =
        getSpecialSeedData(
            "unknown"
        );


    const strangeAmount =
        getSeedAmount(
            "unknown"
        );


    if (
        strangeSeed &&
        strangeAmount > 0
    ) {

        const card =
            createInventoryCard(

                strangeSeed.icon,

                "UNIDENTIFIED",

                strangeSeed.name,

                strangeSeed.description,

                strangeAmount,

                "discovered-item"

            );


        container.appendChild(
            card
        );

    }

}


// ==========================================
// RENDER POTIONS
// ==========================================

function renderPotions() {

    const container =
        document.getElementById(
            "potionInventory"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    Object.values(
        POTION_DATA
    ).forEach(
        potion => {

            const amount =
                getPotionAmount(
                    potion.id
                );


            const discovered =
                hasDiscovered(
                    potion.discoveryId
                );


            // ----------------------------------
            // HIDE UNKNOWN POTIONS
            // ----------------------------------

            if (
                !discovered &&
                amount <= 0
            ) {

                return;

            }


            const card =
                createInventoryCard(

                    potion.inventoryIcon ||
                    potion.icon ||
                    "🧪",

                    "REMEDY",

                    potion.name,

                    potion.description,

                    amount,

                    "discovered-item"

                );


            container.appendChild(
                card
            );

        }
    );


    // --------------------------------------
    // NOTHING DISCOVERED YET
    // --------------------------------------

    if (
        container.children.length === 0
    ) {

        const message =
            document.createElement(
                "p"
            );


        message.className =
            "potion-help";


        message.textContent =
            "No remedies have been discovered yet.";


        container.appendChild(
            message
        );

    }

}


// ==========================================
// RENDER INVENTORY TOTAL
// ==========================================

function renderInventoryTotal() {

    const element =
        document.getElementById(
            "inventoryTotal"
        );


    if (!element) {

        return;

    }


    element.textContent =
        getInventoryTotal();

}


// ==========================================
// RENDER INVENTORY
// ==========================================

function renderInventory() {

    updateResourceBar();

    renderInventoryTotal();

    renderIngredients();

    renderSeeds();

    renderPotions();

}


// ==========================================
// START INVENTORY
// ==========================================

renderInventory();
