// ==========================================
// MOSSWOOD APOTHECARY
// Foraging V9
// Familiar Energy + Live Energy Display
// ==========================================

const FORAGE_ACTIVE_CLICK_BOOST = 1000;


// ==========================================
// ENERGY SETTINGS
// ==========================================

const FORAGE_ENERGY_COSTS = {
    forest: 10,
    marsh: 20,
    ruins: 30
};

const EXHAUSTED_FOREST_MULTIPLIER = 1.75;


// ==========================================
// FORAGE SAVE SETUP / MIGRATION
// ==========================================

if (!game.forage) {

    game.forage = {
        active: false,
        location: null,
        locationId: null,
        startedAt: null,
        finishesAt: null,
        lastResult: null,
        exhausted: false,
        unlockedLocations: [
            "forest"
        ]
    };

    saveGame();
}


// ==========================================
// OLDER SAVE SUPPORT
// ==========================================

if (
    game.forage.lastResult === undefined
) {
    game.forage.lastResult = null;
}


if (
    game.forage.locationId === undefined
) {
    game.forage.locationId = null;
}


if (
    game.forage.exhausted === undefined
) {
    game.forage.exhausted = false;
}


if (
    !Array.isArray(
        game.forage.unlockedLocations
    )
) {
    game.forage.unlockedLocations = [];
}


// ==========================================
// ADD DEFAULT LOCATIONS
// ==========================================

Object.values(
    FORAGE_LOCATION_DATA
).forEach(location => {

    if (
        location.unlockedByDefault &&
        !game.forage.unlockedLocations.includes(
            location.id
        )
    ) {

        game.forage.unlockedLocations.push(
            location.id
        );
    }
});


saveGame();


// ==========================================
// FAMILIAR ENERGY HELPERS
// ==========================================

function getForageEnergyCost(
    locationId
) {

    return (
        FORAGE_ENERGY_COSTS[
            locationId
        ] || 10
    );
}


function getFamiliarEnergy() {

    if (
        !game.familiar ||
        typeof game.familiar.energy !== "number"
    ) {

        return 100;
    }


    return Math.max(
        0,
        Math.min(
            100,
            game.familiar.energy
        )
    );
}


function canFamiliarForage(
    locationId
) {

    if (
        locationId === "forest"
    ) {
        return true;
    }


    const energy =
        getFamiliarEnergy();


    const cost =
        getForageEnergyCost(
            locationId
        );


    return energy >= cost;
}


// ==========================================
// UPDATE FORAGE ENERGY DISPLAY
// ==========================================

function updateForageEnergyDisplay() {

    const energyValue =
        document.getElementById(
            "forageEnergyValue"
        );


    const energyBar =
        document.getElementById(
            "forageEnergyBar"
        );


    const currentEnergy =
        (
            game.familiar &&
            typeof game.familiar.energy === "number"
        )
            ? Math.max(
                0,
                Math.min(
                    100,
                    game.familiar.energy
                )
            )
            : 100;


    if (energyValue) {

        energyValue.textContent =
            `${Math.round(currentEnergy)} / 100`;
    }


    if (energyBar) {

        energyBar.style.width =
            `${currentEnergy}%`;
    }
}


// ==========================================
// LOCATION UNLOCK CHECK
// ==========================================

function isLocationUnlocked(
    locationId
) {

    return game.forage
        .unlockedLocations
        .includes(locationId);
}


// ==========================================
// LOCATION REQUIREMENT CHECK
// ==========================================

function meetsLocationRequirement(
    location
) {

    if (
        !location.discoveryRequirement
    ) {
        return true;
    }


    return hasDiscovered(
        location.discoveryRequirement
    );
}


// ==========================================
// UNLOCK LOCATION
// ==========================================

function unlockForageLocation(
    locationId
) {

    const location =
        getForageLocationData(
            locationId
        );


    if (
        !location ||
        isLocationUnlocked(
            locationId
        )
    ) {
        return;
    }


    if (
        location.requirementHidden
    ) {
        return;
    }


    if (
        !meetsLocationRequirement(
            location
        )
    ) {

        const requirementName =
            location.discoveryRequirementName ||
            "the required botanical";


        showForageMessage(
            "Path Still Hidden",
            `Discover ${requirementName} before attempting to travel deeper into Mosswood.`,
            location.icon
        );

        return;
    }


    const cost =
        location.unlockCost || 0;


    if (
        game.coins < cost
    ) {

        showForageMessage(
            "Not Enough Coins",
            `Opening the route to ${location.name} requires ${cost} coins.`,
            "🪙"
        );

        return;
    }


    game.coins -= cost;


    game.forage.unlockedLocations.push(
        locationId
    );


    saveGame();

    updateResourceBar();

    renderForage();


    showForageMessage(
        `${location.name} Unlocked`,
        `A new route has opened. Your familiar can now explore ${location.name}.`,
        location.icon
    );
}


// ==========================================
// START FORAGE
// ==========================================

function startForage(
    locationId
) {

    if (
        game.forage.active
    ) {
        return;
    }


    if (
        !isLocationUnlocked(
            locationId
        )
    ) {
        return;
    }


    const location =
        getForageLocationData(
            locationId
        );


    if (!location) {
        return;
    }


    const currentEnergy =
        getFamiliarEnergy();


    const energyCost =
        getForageEnergyCost(
            locationId
        );


    let exhausted =
        false;


    let duration =
        location.duration;


    // ======================================
    // MOSSWOOD FOREST
    // ======================================

    if (
        locationId === "forest"
    ) {

        if (
            currentEnergy >=
            energyCost
        ) {

            game.familiar.energy =
                Math.max(
                    0,
                    currentEnergy -
                    energyCost
                );
        }

        else {

            game.familiar.energy = 0;

            exhausted = true;

            duration =
                Math.round(
                    location.duration *
                    EXHAUSTED_FOREST_MULTIPLIER
                );
        }
    }


    // ======================================
    // OTHER LOCATIONS
    // ======================================

    else {

        if (
            currentEnergy <
            energyCost
        ) {

            showForageMessage(
                "Familiar Too Tired",
                `Your familiar needs ${energyCost} Energy to explore ${location.name}. Rest or feed them before sending them out again.`,
                "💤"
            );

            return;
        }


        game.familiar.energy =
            Math.max(
                0,
                currentEnergy -
                energyCost
            );
    }


    const now =
        Date.now();


    game.forage.active = true;

    game.forage.locationId =
        locationId;

    game.forage.location =
        location.name;

    game.forage.startedAt =
        now;

    game.forage.finishesAt =
        now + duration;

    game.forage.exhausted =
        exhausted;


    // Save the new Energy immediately.
    saveGame();


    // Update the Energy number immediately.
    updateForageEnergyDisplay();


    updateResourceBar();

    renderForage();
}


// ==========================================
// ACTIVE FORAGING CLICK
// ==========================================

function activeForageClick() {

    if (
        !game.forage.active
    ) {
        return;
    }


    game.forage.finishesAt -=
        FORAGE_ACTIVE_CLICK_BOOST;


    if (
        Date.now() >=
        game.forage.finishesAt
    ) {

        completeForage();

        return;
    }


    saveGame();

    renderForageProgress();
}


// ==========================================
// COMPLETE FORAGE
// ==========================================

function completeForage() {

    if (
        !game.forage.active
    ) {
        return;
    }


    if (
        Date.now() <
        game.forage.finishesAt
    ) {
        return;
    }


    const locationId =
        game.forage.locationId ||
        "forest";


    rollForageReward(
        locationId
    );


    game.forage.active = false;

    game.forage.location = null;

    game.forage.locationId = null;

    game.forage.startedAt = null;

    game.forage.finishesAt = null;

    game.forage.exhausted = false;


    saveGame();

    updateResourceBar();

    renderForage();
}


// ==========================================
// RANDOM INTEGER
// ==========================================

function getRandomAmount(
    minimum,
    maximum
) {

    return (
        Math.floor(
            Math.random() *
            (
                maximum -
                minimum +
                1
            )
        ) +
        minimum
    );
}


// ==========================================
// ROLL FORAGE REWARD
// ==========================================

function rollForageReward(
    locationId
) {

    const rewards =
        getForageRewardTable(
            locationId
        );


    if (
        !rewards ||
        rewards.length === 0
    ) {

        saveForageResult(
            "Nothing This Time",
            "Your familiar returned without finding anything useful.",
            "🐈‍⬛"
        );

        return;
    }


    const roll =
        Math.random();


    let cumulativeChance = 0;


    let selectedReward =
        rewards[
            rewards.length - 1
        ];


    for (
        const reward of rewards
    ) {

        cumulativeChance +=
            reward.chance;


        if (
            roll <
            cumulativeChance
        ) {

            selectedReward =
                reward;

            break;
        }
    }


    giveForageReward(
        selectedReward
    );
}


// ==========================================
// GIVE FORAGE REWARD
// ==========================================

function giveForageReward(
    reward
) {

    const minimum =
        reward.minAmount || 1;


    const maximum =
        reward.maxAmount ||
        minimum;


    const amount =
        getRandomAmount(
            minimum,
            maximum
        );


    let title =
        reward.title || "";


    let text =
        reward.text || "";


    let icon =
        reward.icon || "✦";


    // ======================================
    // INGREDIENT
    // ======================================

    if (
        reward.type ===
        "ingredient"
    ) {

        addIngredient(
            reward.itemId,
            amount
        );


        const plant =
            getPlantData(
                reward.itemId
            );


        const plantName =
            plant
                ? plant.name
                : "Ingredient";


        title =
            `Found ${amount} ${plantName}`;
    }


    // ======================================
    // NORMAL PLANTING MATERIAL
    // ======================================

    else if (
        reward.type ===
        "seed"
    ) {

        addSeeds(
            reward.itemId,
            amount
        );


        title =
            `Found ${amount} ${getPlantingItemName(
                reward.itemId,
                amount
            )}`;


        icon =
            getPlantingItemIcon(
                reward.itemId
            );
    }


    // ======================================
    // DISCOVERY PLANTING MATERIAL
    // ======================================

    else if (
        reward.type ===
        "discoverySeed"
    ) {

        const plant =
            getPlantData(
                reward.plantId
            );


        const discovered =
            hasDiscovered(
                reward.plantId
            );


        if (discovered) {

            addSeeds(
                reward.plantId,
                amount
            );


            const plantName =
                plant
                    ? plant.name
                    : "Plant";


            const plantingItemName =
                getPlantingItemName(
                    reward.plantId,
                    amount
                );


            const genericPlantingItemName =
                getPlantingItemGenericName(
                    reward.plantId,
                    amount
                );


            title =
                `Found ${amount} ${plantingItemName}`;


            text =
                reward.discoveredText ||
                `Your familiar returned with ${plantName} ${genericPlantingItemName}.`;


            icon =
                getPlantingItemIcon(
                    reward.plantId
                );
        }

        else {

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                addMysterySeed(
                    reward.plantId
                );
            }


            title =
                reward.mysteryTitle ||
                (
                    amount === 1
                        ? "Found a Strange Seed"
                        : `Found ${amount} Strange Seeds`
                );


            text =
                reward.mysteryText ||
                "Your familiar returned with an unfamiliar seed.";


            icon =
                reward.mysteryIcon ||
                "✦";
        }
    }


    // ======================================
    // LEGACY MYSTERY SEED SUPPORT
    // ======================================

    else if (
        reward.type ===
        "mysterySeed"
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            addMysterySeed(
                reward.revealsPlant
            );
        }


        title =
            reward.title ||
            (
                amount === 1
                    ? "Found a Strange Seed"
                    : `Found ${amount} Strange Seeds`
            );
    }


    // ======================================
    // NOTHING
    // ======================================

    else if (
        reward.type ===
        "nothing"
    ) {

        title =
            reward.title ||
            "Nothing This Time";
    }


    saveForageResult(
        title,
        text,
        icon
    );
}


// ==========================================
// SAVE FORAGE RESULT
// ==========================================

function saveForageResult(
    title,
    text,
    icon
) {

    game.forage.lastResult = {

        title:
            title,

        text:
            text,

        icon:
            icon,

        foundAt:
            Date.now()

    };
}


// ==========================================
// SHOW FORAGE MESSAGE
// ==========================================

function showForageMessage(
    title,
    text,
    icon
) {

    game.forage.lastResult = {

        title:
            title,

        text:
            text,

        icon:
            icon,

        foundAt:
            Date.now()

    };


    saveGame();

    renderForageResult();
}


// ==========================================
// FORMAT COUNTDOWN
// ==========================================

function formatForageTime(
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
            .padStart(
                2,
                "0"
            ) +
        ":" +
        String(seconds)
            .padStart(
                2,
                "0"
            )
    );
}


// ==========================================
// LOCATION REQUIREMENT TEXT
// ==========================================

function getLocationRequirementText(
    location
) {

    if (
        location.requirementHidden
    ) {

        return (
            "🔒 Requirement Unknown"
        );
    }


    const requirements = [];


    if (
        location.discoveryRequirement
    ) {

        requirements.push(
            `Discover ${
                location.discoveryRequirementName ||
                location.discoveryRequirement
            }`
        );
    }


    if (
        location.unlockCost
    ) {

        requirements.push(
            `${location.unlockCost} coins`
        );
    }


    if (
        requirements.length === 0
    ) {

        return "🔒 Locked";
    }


    return (
        "🔒 " +
        requirements.join(" + ")
    );
}


// ==========================================
// CREATE LOCATION CARD
// ==========================================

function createLocationCard(
    location
) {

    const unlocked =
        isLocationUnlocked(
            location.id
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        `forage-location ${
            unlocked
                ? "available"
                : "locked"
        }`;


    const statusText =
        unlocked
            ? "AVAILABLE"
            : "LOCKED";


    const typeText =
        unlocked
            ? location.type
            : (
                location.unlockedByDefault
                    ? location.type
                    : "UNKNOWN REGION"
            );


    const detailText =
        unlocked
            ? `✦ ${location.findLabel}`
            : getLocationRequirementText(
                location
            );


    const seconds =
        Math.round(
            location.duration /
            1000
        );


    const energyCost =
        getForageEnergyCost(
            location.id
        );


    card.innerHTML = `

        <div class="location-art">

            <span class="location-symbol">
                ${location.icon}
            </span>

            <span class="location-status">
                ${statusText}
            </span>

        </div>


        <div class="location-content">

            <span class="card-label">
                ${typeText}
            </span>

            <h4>
                ${location.name}
            </h4>

            <p>
                ${location.description}
            </p>


            <div class="location-details">

                ${
                    unlocked
                        ? `
                            <span>
                                ⏱ ${seconds} seconds
                            </span>

                            <span>
                                ⚡ ${energyCost} Energy
                            </span>
                        `
                        : ""
                }

                <span>
                    ${detailText}
                </span>

            </div>

        </div>

    `;


    const content =
        card.querySelector(
            ".location-content"
        );


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "forage-button";


    // ======================================
    // UNLOCKED LOCATION
    // ======================================

    if (unlocked) {

        const enoughEnergy =
            canFamiliarForage(
                location.id
            );


        button.disabled =
            game.forage.active ||
            !enoughEnergy;


        if (
            game.forage.active
        ) {

            button.textContent =
                "Familiar Away";
        }

        else if (
            !enoughEnergy
        ) {

            button.textContent =
                "Needs More Energy";
        }

        else if (
            location.id === "forest" &&
            getFamiliarEnergy() <
            energyCost
        ) {

            button.textContent =
                "Send Familiar — Tired";
        }

        else {

            button.textContent =
                "Send Familiar";
        }


        button.addEventListener(
            "click",
            () => {

                startForage(
                    location.id
                );
            }
        );
    }


    // ======================================
    // SECRET LOCATION
    // ======================================

    else if (
        location.requirementHidden
    ) {

        button.disabled = true;

        button.textContent =
            "Locked";
    }


    // ======================================
    // DISCOVERY REQUIREMENT NOT MET
    // ======================================

    else if (
        !meetsLocationRequirement(
            location
        )
    ) {

        button.disabled = true;

        button.textContent =
            "Locked";
    }


    // ======================================
    // CAN PURCHASE LOCATION
    // ======================================

    else {

        button.disabled =
            game.forage.active;


        button.textContent =
            `Unlock — 🪙 ${location.unlockCost}`;


        button.addEventListener(
            "click",
            () => {

                unlockForageLocation(
                    location.id
                );
            }
        );
    }


    content.appendChild(
        button
    );


    return card;
}


// ==========================================
// RENDER LOCATIONS
// ==========================================

function renderLocations() {

    const grid =
        document.getElementById(
            "forageLocationGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    Object.values(
        FORAGE_LOCATION_DATA
    ).forEach(location => {

        grid.appendChild(
            createLocationCard(
                location
            )
        );
    });
}


// ==========================================
// RENDER FAMILIAR
// ==========================================

function renderFamiliar() {

    const status =
        document.getElementById(
            "familiarStatus"
        );


    const state =
        document.getElementById(
            "familiarState"
        );


    const nameElement =
        document.getElementById(
            "forageFamiliarName"
        );


    const name =
        (
            game.familiar &&
            game.familiar.name &&
            game.familiar.name.trim()
        )
            ? game.familiar.name.trim()
            : "Your Familiar";


    // Always update directly from game.familiar.
    updateForageEnergyDisplay();


    const energy =
        getFamiliarEnergy();


    // ======================================
    // NAME
    // ======================================

    if (nameElement) {

        nameElement.textContent =
            name;
    }


    // ======================================
    // ACTIVE FORAGING
    // ======================================

    if (
        game.forage.active
    ) {

        if (status) {

            if (
                game.forage.exhausted
            ) {

                status.textContent =
                    `${name} is tired, but is slowly exploring ${game.forage.location}.`;
            }

            else {

                status.textContent =
                    `${name} is exploring ${game.forage.location}.`;
            }
        }


        if (state) {

            state.textContent =
                game.forage.exhausted
                    ? "TIRED"
                    : "FORAGING";
        }
    }


    // ======================================
    // READY
    // ======================================

    else {

        if (status) {

            if (
                energy < 10
            ) {

                status.textContent =
                    `${name} looks tired, but can still search the Mosswood Forest.`;
            }

            else {

                status.textContent =
                    `${name} waits patiently for somewhere to explore.`;
            }
        }


        if (state) {

            state.textContent =
                "READY";
        }
    }
}


// ==========================================
// RENDER ACTIVE SEARCH
// ==========================================

function renderActiveForaging() {

    const button =
        document.getElementById(
            "activeForageButton"
        );


    const help =
        document.getElementById(
            "activeForageHelp"
        );


    if (!button) {
        return;
    }


    if (
        !game.forage.active
    ) {

        button.disabled = true;

        button.textContent =
            "Search the Path";


        if (help) {

            help.textContent =
                "Begin an expedition to actively help your familiar search.";
        }

        return;
    }


    button.disabled = false;

    button.textContent =
        "Search the Path";


    if (help) {

        help.textContent =
            "Click to help your familiar search faster. Each search advances the expedition by 1 second.";
    }
}


// ==========================================
// RENDER EXPEDITION PROGRESS
// ==========================================

function renderForageProgress() {

    const title =
        document.getElementById(
            "forageProgressTitle"
        );


    const text =
        document.getElementById(
            "forageProgressText"
        );


    const timer =
        document.getElementById(
            "forageTimer"
        );


    const progressBar =
        document.getElementById(
            "forageProgressBar"
        );


    if (
        !game.forage.active
    ) {

        if (title) {

            title.textContent =
                "No Active Forage";
        }


        if (text) {

            text.textContent =
                "Send your familiar somewhere to begin searching.";
        }


        if (timer) {

            timer.textContent =
                "--:--";
        }


        if (progressBar) {

            progressBar.style.width =
                "0%";
        }


        return;
    }


    const location =
        getForageLocationData(
            game.forage.locationId
        );


    const now =
        Date.now();


    const remaining =
        Math.max(
            0,
            game.forage.finishesAt -
            now
        );


    const totalTime =
        Math.max(
            1,
            game.forage.finishesAt -
            game.forage.startedAt
        );


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                (
                    1 -
                    (
                        remaining /
                        totalTime
                    )
                ) * 100
            )
        );


    if (title) {

        title.textContent =
            game.forage.location;
    }


    if (text) {

        if (
            game.forage.exhausted
        ) {

            text.textContent =
                "Your familiar is tired and moving more slowly, but continues searching the forest.";
        }

        else {

            text.textContent =
                location
                    ? location.activeText
                    : "Your familiar is searching the wilds.";
        }
    }


    if (timer) {

        timer.textContent =
            formatForageTime(
                remaining
            );
    }


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;
    }
}


// ==========================================
// RENDER FORAGING JOURNAL
// ==========================================

function renderForageResult() {

    const result =
        document.getElementById(
            "forageResult"
        );


    if (
        !result ||
        !game.forage.lastResult
    ) {
        return;
    }


    const lastResult =
        game.forage.lastResult;


    result.innerHTML = `

        <span class="forage-result-icon">
            ${lastResult.icon}
        </span>

        <div>

            <span class="card-label">
                FORAGING JOURNAL
            </span>

            <h3>
                ${lastResult.title}
            </h3>

            <p>
                ${lastResult.text}
            </p>

        </div>

    `;
}


// ==========================================
// RENDER FORAGE PAGE
// ==========================================

function renderForage() {

    updateResourceBar();

    updateForageEnergyDisplay();

    renderLocations();

    renderFamiliar();

    renderForageProgress();

    renderActiveForaging();

    renderForageResult();
}


// ==========================================
// ACTIVE SEARCH BUTTON
// ==========================================

const activeForageButton =
    document.getElementById(
        "activeForageButton"
    );


if (activeForageButton) {

    activeForageButton.addEventListener(
        "click",
        activeForageClick
    );
}


// ==========================================
// UPDATE FORAGE
// ==========================================

function updateForage() {

    // Always refresh Energy first.
    updateForageEnergyDisplay();


    if (
        game.forage.active &&
        Date.now() >=
        game.forage.finishesAt
    ) {

        completeForage();

        return;
    }


    renderForage();
}


// ==========================================
// UPDATE WHEN RETURNING TO THIS TAB
// ==========================================

window.addEventListener(
    "focus",
    () => {

        updateForageEnergyDisplay();

        renderForage();
    }
);


// ==========================================
// UPDATE WHEN PAGE BECOMES VISIBLE
// ==========================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !document.hidden
        ) {

            updateForageEnergyDisplay();

            renderForage();
        }
    }
);


// ==========================================
// START PAGE
// ==========================================

updateForage();


// ==========================================
// TIMER
// ==========================================

setInterval(
    updateForage,
    1000
);
