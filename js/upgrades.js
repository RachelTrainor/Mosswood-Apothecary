// ==========================================
// MOSSWOOD APOTHECARY
// Upgrades V1
// ==========================================


// ==========================================
// UPGRADE SAVE MIGRATION
// ==========================================

// Older saves do not have upgrade data yet.
// Add it without resetting existing progress.

if (!game.upgrades) {

    game.upgrades = {
        expansion: 0,
        irrigation: 0,
        growth: 0
    };

    saveGame();
}


// Make sure each upgrade exists individually.

if (
    typeof game.upgrades.expansion
    !== "number"
) {

    game.upgrades.expansion = 0;

}

if (
    typeof game.upgrades.irrigation
    !== "number"
) {

    game.upgrades.irrigation = 0;

}

if (
    typeof game.upgrades.growth
    !== "number"
) {

    game.upgrades.growth = 0;

}

saveGame();


// ==========================================
// UPGRADE SETTINGS
// ==========================================

const upgradeData = {

    expansion: {

        baseCost: 50,

        costIncrease: 50,

        maxLevel: 4

    },


    irrigation: {

        baseCost: 40,

        costIncrease: 35,

        maxLevel: 5

    },


    growth: {

        baseCost: 35,

        costIncrease: 30,

        maxLevel: 5

    }

};


// ==========================================
// GET UPGRADE COST
// ==========================================

function getUpgradeCost(
    upgrade
) {

    const data =
        upgradeData[upgrade];


    const level =
        game.upgrades[upgrade];


    return (
        data.baseCost
        +
        (
            level *
            data.costIncrease
        )
    );

}


// ==========================================
// PURCHASE UPGRADE
// ==========================================

function purchaseUpgrade(
    upgrade
) {

    const data =
        upgradeData[upgrade];


    const currentLevel =
        game.upgrades[upgrade];


    // Maximum level reached.

    if (
        currentLevel >=
        data.maxLevel
    ) {

        showUpgradeResult(
            "Maximum Level Reached",
            "This improvement has already been fully restored.",
            "✦"
        );

        return;

    }


    const cost =
        getUpgradeCost(
            upgrade
        );


    // Not enough coins.

    if (
        game.coins <
        cost
    ) {

        showUpgradeResult(
            "Not Enough Coins",
            `You need ${cost} coins to purchase this improvement.`,
            "🪙"
        );

        return;

    }


    // Deduct coins.

    game.coins -=
        cost;


    // Increase level.

    game.upgrades[upgrade]++;


    saveGame();


    // Show appropriate result.

    if (
        upgrade ===
        "expansion"
    ) {

        showUpgradeResult(
            "Greenhouse Expanded",
            "More of the old greenhouse has been restored, creating additional room for plants.",
            "🌿"
        );

    }


    if (
        upgrade ===
        "irrigation"
    ) {

        showUpgradeResult(
            "Irrigation Improved",
            "The greenhouse watering system has been restored and plants will remain hydrated longer.",
            "💧"
        );

    }


    if (
        upgrade ===
        "growth"
    ) {

        showUpgradeResult(
            "Growing Conditions Improved",
            "Better soil and greenhouse conditions will help your plants mature more quickly.",
            "⏳"
        );

    }


    renderUpgrades();

}


// ==========================================
// UPGRADE BENEFIT TEXT
// ==========================================

function getExpansionBenefit(
    level
) {

    if (level >= 4) {

        return "Maximum greenhouse space restored.";

    }


    return (
        "Restore additional growing space."
    );

}


function getIrrigationBenefit(
    level
) {

    if (level >= 5) {

        return "Maximum irrigation efficiency reached.";

    }


    const nextBonus =
        (level + 1) * 10;


    return (
        `Plants stay watered ${nextBonus}% longer.`
    );

}


function getGrowthBenefit(
    level
) {

    if (level >= 5) {

        return "Maximum growing efficiency reached.";

    }


    const nextReduction =
        (level + 1) * 5;


    return (
        `Reduce plant growth time by ${nextReduction}%.`
    );

}


// ==========================================
// RENDER ONE UPGRADE
// ==========================================

function renderUpgrade(
    upgrade,
    levelElementId,
    costElementId,
    benefitElementId,
    buttonElementId
) {

    const level =
        game.upgrades[upgrade];


    const data =
        upgradeData[upgrade];


    const levelElement =
        document.getElementById(
            levelElementId
        );


    const costElement =
        document.getElementById(
            costElementId
        );


    const benefitElement =
        document.getElementById(
            benefitElementId
        );


    const button =
        document.getElementById(
            buttonElementId
        );


    if (levelElement) {

        levelElement.textContent =
            `${level} / ${data.maxLevel}`;

    }


    // ======================================
    // MAX LEVEL
    // ======================================

    if (
        level >=
        data.maxLevel
    ) {

        if (costElement) {

            costElement.textContent =
                "MAX";

        }


        if (button) {

            button.disabled =
                true;


            button.innerHTML =
                "Maximum Level";

        }

    }


    // ======================================
    // AVAILABLE LEVEL
    // ======================================

    else {

        const cost =
            getUpgradeCost(
                upgrade
            );


        if (costElement) {

            costElement.textContent =
                cost;

        }


        if (button) {

            button.disabled =
                game.coins < cost;


            button.innerHTML =
                `Upgrade · 🪙 ${cost}`;

        }

    }


    // ======================================
    // BENEFIT TEXT
    // ======================================

    if (benefitElement) {

        if (
            upgrade ===
            "expansion"
        ) {

            benefitElement.textContent =
                getExpansionBenefit(
                    level
                );

        }


        if (
            upgrade ===
            "irrigation"
        ) {

            benefitElement.textContent =
                getIrrigationBenefit(
                    level
                );

        }


        if (
            upgrade ===
            "growth"
        ) {

            benefitElement.textContent =
                getGrowthBenefit(
                    level
                );

        }

    }

}


// ==========================================
// UPGRADE JOURNAL
// ==========================================

function showUpgradeResult(
    title,
    message,
    icon
) {

    const result =
        document.getElementById(
            "upgradeResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <span class="upgrade-result-icon">
            ${icon}
        </span>


        <div>

            <span class="card-label">
                RESTORATION JOURNAL
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
// RENDER UPGRADES
// ==========================================

function renderUpgrades() {

    updateResourceBar();


    // Available coins.

    const coinDisplay =
        document.getElementById(
            "upgradeCoins"
        );


    if (coinDisplay) {

        coinDisplay.textContent =
            game.coins;

    }


    // Greenhouse Expansion.

    renderUpgrade(
        "expansion",
        "expansionLevel",
        "expansionCost",
        "expansionBenefit",
        "buyExpansion"
    );


    // Irrigation.

    renderUpgrade(
        "irrigation",
        "irrigationLevel",
        "irrigationCost",
        "irrigationBenefit",
        "buyIrrigation"
    );


    // Growing Conditions.

    renderUpgrade(
        "growth",
        "growthLevel",
        "growthCost",
        "growthBenefit",
        "buyGrowth"
    );

}


// ==========================================
// BUTTON EVENTS
// ==========================================

const expansionButton =
    document.getElementById(
        "buyExpansion"
    );


const irrigationButton =
    document.getElementById(
        "buyIrrigation"
    );


const growthButton =
    document.getElementById(
        "buyGrowth"
    );


if (expansionButton) {

    expansionButton.addEventListener(
        "click",
        function () {

            purchaseUpgrade(
                "expansion"
            );

        }
    );

}


if (irrigationButton) {

    irrigationButton.addEventListener(
        "click",
        function () {

            purchaseUpgrade(
                "irrigation"
            );

        }
    );

}


if (growthButton) {

    growthButton.addEventListener(
        "click",
        function () {

            purchaseUpgrade(
                "growth"
            );

        }
    );

}


// ==========================================
// START UPGRADES PAGE
// ==========================================

renderUpgrades();
