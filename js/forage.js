// ==========================================
// MOSSWOOD APOTHECARY
// Foraging V6
// Dynamic Planting Materials
// Discovery Seeds + Active Foraging
// ==========================================


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
        unlockedLocations: [
            "forest"
        ]
    };

    saveGame();
}


// ------------------------------------------
// OLDER SAVE SUPPORT
// ------------------------------------------

if (game.forage.lastResult === undefined) {
    game.forage.lastResult = null;
}

if (game.forage.locationId === undefined) {
    game.forage.locationId = null;
}

if (!Array.isArray(game.forage.unlockedLocations)) {
    game.forage.unlockedLocations = [];
}


// ------------------------------------------
// ADD DEFAULT LOCATIONS
// ------------------------------------------

Object.values(FORAGE_LOCATION_DATA).forEach(location => {

    if (
        location.unlockedByDefault &&
        !game.forage.unlockedLocations.includes(location.id)
    ) {

        game.forage.unlockedLocations.push(location.id);
    }

});

saveGame();


// ==========================================
// LOCATION UNLOCK CHECK
// ==========================================

function isLocationUnlocked(locationId) {

    return game.forage.unlockedLocations.includes(locationId);
}


// ==========================================
// LOCATION REQUIREMENT CHECK
// ==========================================

function meetsLocationRequirement(location) {

    if (!location.discoveryRequirement) {
        return true;
    }

    return hasDiscovered(location.discoveryRequirement);
}


// ==========================================
// UNLOCK LOCATION
// ==========================================

function unlockForageLocation(locationId) {

    const location =
        getForageLocationData(locationId);


    if (
        !location ||
        isLocationUnlocked(locationId)
    ) {
        return;
    }


    if (location.requirementHidden) {
        return;
    }


    if (!meetsLocationRequirement(location)) {

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


    if (game.coins < cost) {

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

function startForage(locationId) {

    if (game.forage.active) {
        return;
    }


    if (!isLocationUnlocked(locationId)) {
        return;
    }


    const location =
        getForageLocationData(locationId);


    if (!location) {
        return;
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
        now + location.duration;


    saveGame();

    renderForage();
}


// ==========================================
// ACTIVE FORAGING CLICK
// ==========================================

function activeForageClick() {

    if (!game.forage.active) {
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

    if (!game.forage.active) {
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


    rollForageReward(locationId);


    game.forage.active =
        false;

    game.forage.location =
        null;

    game.forage.locationId =
        null;

    game.forage.startedAt =
        null;

    game.forage.finishesAt =
        null;


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
            (maximum - minimum + 1)
        ) +
        minimum
    );
}


// ==========================================
// ROLL FORAGE REWARD
// ==========================================

function rollForageReward(locationId) {

    const rewards =
        getForageRewardTable(locationId);


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


    let cumulativeChance =
        0;


    let selectedReward =
        rewards[
            rewards.length - 1
        ];


    for (const reward of rewards) {

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

function giveForageReward(reward) {

    const minimum =
        reward.minAmount || 1;


    const maximum =
        reward.maxAmount || minimum;


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


        // ----------------------------------
        // BOTANICAL ALREADY DISCOVERED
        // ----------------------------------

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


        // ----------------------------------
        // BOTANICAL NOT DISCOVERED
        // ----------------------------------

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

function formatForageTime(milliseconds) {

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
// LOCATION REQUIREMENT TEXT
// ==========================================

function getLocationRequirementText(
    location
) {

    if (
        location.requirementHidden
    ) {

        return "🔒 Requirement Unknown";
    }


    const requirements =
        [];


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

function createLocationCard(location) {

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

        button.disabled =
            game.forage.active;


        button.textContent =
            game.forage.active
                ? "Familiar Away"
                : "Send Familiar";


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

        button.disabled =
            true;

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

        button.disabled =
            true;

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


    grid.innerHTML =
        "";


    Object.values(
        FORAGE_LOCATION_DATA
    ).forEach(
        location => {

            grid.appendChild(
                createLocationCard(
                    location
                )
            );
        }
    );
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


    if (game.forage.active) {

        if (status) {

            status.textContent =
                `Your familiar is exploring ${game.forage.location}.`;
        }


        if (state) {

            state.textContent =
                "FORAGING";
        }
    }

    else {

        if (status) {

            status.textContent =
                "Your familiar waits patiently for somewhere to explore.";
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


    if (!game.forage.active) {

        button.disabled =
            true;

        button.textContent =
            "Search the Path";


        if (help) {

            help.textContent =
                "Begin an expedition to actively help your familiar search.";
        }

        return;
    }


    button.disabled =
        false;

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


    if (!game.forage.active) {

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
        location
            ? location.duration
            : (
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

        text.textContent =
            location
                ? location.activeText
                : "Your familiar is searching the wilds.";
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
