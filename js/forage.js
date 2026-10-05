// ==========================================
// MOSSWOOD APOTHECARY
// Foraging V4
// Location Progression + Active Foraging
// ==========================================


// ==========================================
// FORAGING SETTINGS
// ==========================================

const FORAGE_SETTINGS = {

    forest: {
        time: 30 * 1000
    },

    marsh: {
        time: 45 * 1000
    },

    ruins: {
        time: 60 * 1000
    }

};


// ==========================================
// LOCATION UNLOCK COSTS
// ==========================================

const MARSH_UNLOCK_COST =
    500;


// ==========================================
// ACTIVE FORAGING
// ==========================================

// Each click removes one second
// from the remaining expedition time.

const ACTIVE_FORAGE_BOOST =
    1000;


// ==========================================
// FORAGE SAVE MIGRATION
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


// ==========================================
// UPDATE OLDER FORAGE SAVES
// ==========================================

if (
    game.forage.lastResult ===
    undefined
) {

    game.forage.lastResult =
        null;

}


if (
    game.forage.locationId ===
    undefined
) {

    game.forage.locationId =
        null;

}


if (
    !Array.isArray(
        game.forage.unlockedLocations
    )
) {

    game.forage.unlockedLocations = [
        "forest"
    ];

}


if (
    !game.forage.unlockedLocations.includes(
        "forest"
    )
) {

    game.forage.unlockedLocations.push(
        "forest"
    );

}


saveGame();


// ==========================================
// LOCATION HELPERS
// ==========================================

function isLocationUnlocked(
    locationId
) {

    return game.forage
        .unlockedLocations
        .includes(
            locationId
        );

}


// ==========================================
// UNLOCK MARSH
// ==========================================

function unlockMarsh() {

    if (
        isLocationUnlocked(
            "marsh"
        )
    ) {

        return;

    }


    // --------------------------------------
    // NIGHTBELL REQUIREMENT
    // --------------------------------------

    if (
        !hasDiscovered(
            "nightbell"
        )
    ) {

        showForageMessage(
            "Path Still Hidden",
            "Discover Nightbell before attempting to travel deeper into Mosswood.",
            "🌫️"
        );

        return;

    }


    // --------------------------------------
    // COIN REQUIREMENT
    // --------------------------------------

    if (
        game.coins <
        MARSH_UNLOCK_COST
    ) {

        showForageMessage(
            "Not Enough Coins",
            `Opening the route to Mistfen Marsh requires ${MARSH_UNLOCK_COST} coins.`,
            "🪙"
        );

        return;

    }


    // --------------------------------------
    // PAY COST
    // --------------------------------------

    game.coins -=
        MARSH_UNLOCK_COST;


    // --------------------------------------
    // UNLOCK
    // --------------------------------------

    game.forage
        .unlockedLocations
        .push(
            "marsh"
        );


    saveGame();

    updateResourceBar();

    renderForage();


    showForageMessage(
        "Mistfen Marsh Unlocked",
        "A narrow path through the fog has been cleared. Your familiar can now explore Mistfen Marsh.",
        "🌫️"
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


    const settings =
        FORAGE_SETTINGS[
            locationId
        ];


    if (
        !location ||
        !settings
    ) {

        return;

    }


    const now =
        Date.now();


    game.forage.active =
        true;


    game.forage.locationId =
        locationId;


    game.forage.location =
        location.name;


    game.forage.startedAt =
        now;


    game.forage.finishesAt =
        now +
        settings.time;


    saveGame();

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


    // --------------------------------------
    // REDUCE REMAINING TIME
    // --------------------------------------

    game.forage.finishesAt -=
        ACTIVE_FORAGE_BOOST;


    // --------------------------------------
    // CHECK FOR COMPLETION
    // --------------------------------------

    if (
        Date.now() >=
        game.forage.finishesAt
    ) {

        completeForage();

        return;

    }


    // --------------------------------------
    // SAVE NEW FINISH TIME
    // --------------------------------------

    saveGame();


    // --------------------------------------
    // UPDATE PROGRESS IMMEDIATELY
    // --------------------------------------

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


    // --------------------------------------
    // CHOOSE REWARD TABLE
    // --------------------------------------

    if (
        locationId ===
        "marsh"
    ) {

        completeMarshForage();

    }

    else {

        completeForestForage();

    }


    // --------------------------------------
    // CLEAR EXPEDITION
    // --------------------------------------

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
// FOREST REWARDS
// ==========================================

function completeForestForage() {

    const roll =
        Math.random();


    let title =
        "";


    let text =
        "";


    let icon =
        "🌿";


    // ======================================
    // 45% - MOONMINT
    // ======================================

    if (
        roll < 0.45
    ) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 1;


        addIngredient(
            "moonmint",
            amount
        );


        title =
            `Found ${amount} Moonmint`;


        text =
            "Your familiar returned carrying fresh Moonmint gathered beneath the forest canopy.";


        icon =
            "🌿";

    }


    // ======================================
    // 30% - MOONMINT SEEDS
    // ======================================

    else if (
        roll < 0.75
    ) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 1;


        addSeeds(
            "moonmint",
            amount
        );


        title =
            `Found ${amount} Moonmint Seed${amount === 1 ? "" : "s"}`;


        text =
            "A few small seeds were discovered tangled among the moss.";


        icon =
            "🌱";

    }


    // ======================================
    // 17% - STRANGE SEED
    // ======================================

    else if (
        roll < 0.92
    ) {

        addMysterySeed(
            "nightbell"
        );


        title =
            "Found a Strange Seed";


        text =
            "Your familiar returned with a dark, unfamiliar seed. Whatever it grows into remains a mystery.";


        icon =
            "✦";

    }


    // ======================================
    // 8% - NOTHING
    // ======================================

    else {

        title =
            "Nothing This Time";


        text =
            "Your familiar returned empty-pawed, though perhaps the forest will be more generous next time.";


        icon =
            "🐈‍⬛";

    }


    saveForageResult(
        title,
        text,
        icon
    );

}


// ==========================================
// MARSH REWARDS
// ==========================================

function completeMarshForage() {

    const roll =
        Math.random();


    let title =
        "";


    let text =
        "";


    let icon =
        "🌫️";


    // ======================================
    // TEMPORARY MARSH LOOT TABLE
    // ======================================
    //
    // No new botanical yet.
    // This can later award a new
    // mystery seed species.
    // ======================================


    // ======================================
    // 40% - MOONMINT
    // ======================================

    if (
        roll < 0.40
    ) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 2;


        addIngredient(
            "moonmint",
            amount
        );


        title =
            `Found ${amount} Moonmint`;


        text =
            "Your familiar found Moonmint growing thickly along the damp edges of the marsh.";


        icon =
            "🌿";

    }


    // ======================================
    // 30% - NIGHTBELL
    // ======================================

    else if (
        roll < 0.70
    ) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 1;


        addIngredient(
            "nightbell",
            amount
        );


        title =
            `Found ${amount} Nightbell`;


        text =
            "A cluster of Nightbell was discovered among the mist-covered reeds.";


        icon =
            "🪻";

    }


    // ======================================
    // 20% - NIGHTBELL SEED
    // ======================================

    else if (
        roll < 0.90
    ) {

        addSeeds(
            "nightbell",
            1
        );


        title =
            "Found a Nightbell Seed";


        text =
            "Your familiar returned with a Nightbell seed caught carefully between its paws.";


        icon =
            "🪻";

    }


    // ======================================
    // 10% - NOTHING
    // ======================================

    else {

        title =
            "Lost in the Mist";


        text =
            "The marsh gave up no treasures this time. Your familiar returned damp, annoyed, and empty-pawed.";


        icon =
            "🐈‍⬛";

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
        String(
            minutes
        )
            .padStart(
                2,
                "0"
            )
        +
        ":"
        +
        String(
            seconds
        )
            .padStart(
                2,
                "0"
            )
    );

}


// ==========================================
// CREATE LOCATION CARD
// ==========================================

function createLocationCard(
    locationId
) {

    const location =
        getForageLocationData(
            locationId
        );


    if (!location) {

        return null;

    }


    const unlocked =
        isLocationUnlocked(
            locationId
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


    // --------------------------------------
    // FOREST
    // --------------------------------------

    let symbol =
        "🌲";


    let type =
        "FOREST";


    let description =
        "A shadowed woodland filled with moss, old trees, and plants that thrive far from the greenhouse.";


    let detail =
        "✦ Common Finds";


    // --------------------------------------
    // MARSH
    // --------------------------------------

    if (
        locationId ===
        "marsh"
    ) {

        symbol =
            "🌫️";


        type =
            unlocked
                ? "MARSH"
                : "UNKNOWN REGION";


        description =
            "Pale lights drift through the reeds. Something unusual grows beneath the mist.";


        detail =
            unlocked
                ? "✦ Uncommon Finds"
                : `🔒 Discover Nightbell + ${MARSH_UNLOCK_COST} coins`;

    }


    // --------------------------------------
    // RUINS
    // --------------------------------------

    if (
        locationId ===
        "ruins"
    ) {

        symbol =
            "🕯️";


        type =
            "UNKNOWN REGION";


        description =
            "Crumbling stone lies hidden beneath vines and roots. Few paths still lead there.";


        detail =
            "🔒 Requirement Unknown";

    }


    const settings =
        FORAGE_SETTINGS[
            locationId
        ];


    const seconds =
        settings
            ? settings.time / 1000
            : 0;


    card.innerHTML = `

        <div class="location-art">

            <span class="location-symbol">
                ${symbol}
            </span>

            <span class="location-status">
                ${
                    unlocked
                        ? "AVAILABLE"
                        : "LOCKED"
                }
            </span>

        </div>


        <div class="location-content">

            <span class="card-label">
                ${type}
            </span>

            <h4>
                ${location.name}
            </h4>

            <p>
                ${description}
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
                    ${detail}
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


    // --------------------------------------
    // AVAILABLE
    // --------------------------------------

    if (
        unlocked
    ) {

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
                    locationId
                );

            }
        );

    }


    // --------------------------------------
    // MARSH UNLOCK
    // --------------------------------------

    else if (
        locationId ===
        "marsh" &&
        hasDiscovered(
            "nightbell"
        )
    ) {

        button.disabled =
            game.forage.active;


        button.textContent =
            `Unlock — 🪙 ${MARSH_UNLOCK_COST}`;


        button.addEventListener(
            "click",
            unlockMarsh
        );

    }


    // --------------------------------------
    // LOCKED
    // --------------------------------------

    else {

        button.disabled =
            true;


        button.textContent =
            "Locked";

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


    [
        "forest",
        "marsh",
        "ruins"
    ].forEach(
        locationId => {

            const card =
                createLocationCard(
                    locationId
                );


            if (card) {

                grid.appendChild(
                    card
                );

            }

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


    if (
        game.forage.active
    ) {

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
// RENDER ACTIVE FORAGING
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


    // --------------------------------------
    // NO EXPEDITION
    // --------------------------------------

    if (
        !game.forage.active
    ) {

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


    // --------------------------------------
    // ACTIVE EXPEDITION
    // --------------------------------------

    button.disabled =
        false;


    button.textContent =
        "Search the Path";


    if (help) {

        help.textContent =
            "Click to help your familiar search faster. Each search advances the expedition.";

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


    // --------------------------------------
    // NO ACTIVE EXPEDITION
    // --------------------------------------

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


    // --------------------------------------
    // ACTIVE EXPEDITION
    // --------------------------------------

    const now =
        Date.now();


    const settings =
        FORAGE_SETTINGS[
            game.forage.locationId
        ];


    const totalTime =
        settings
            ? settings.time
            : (
                game.forage.finishesAt -
                game.forage.startedAt
            );


    const remaining =
        Math.max(
            0,
            game.forage.finishesAt -
            now
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
            game.forage.locationId ===
            "marsh"
        ) {

            text.textContent =
                "Your familiar disappears into the reeds and pale marsh mist.";

        }

        else {

            text.textContent =
                "Your familiar is searching the forest floor, roots, and forgotten paths.";

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
// RENDER LAST DISCOVERY
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
// ACTIVE FORAGE BUTTON
// ==========================================

const activeForageButton =
    document.getElementById(
        "activeForageButton"
    );


if (
    activeForageButton
) {

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
// START FORAGE PAGE
// ==========================================

updateForage();


// ==========================================
// TIMER
// ==========================================

setInterval(
    updateForage,
    1000
);
