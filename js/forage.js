// ==========================================
// MOSSWOOD APOTHECARY
// Foraging V1
// ==========================================


// ==========================================
// FORAGING SETTINGS
// ==========================================

const FOREST_FORAGE_TIME =
    30 * 1000;


// ==========================================
// FORAGE SAVE MIGRATION
// ==========================================

// Older Mosswood saves may not contain
// the forage section yet.
//
// This adds it without resetting any of
// the player's existing progress.

if (!game.forage) {

    game.forage = {
        active: false,
        location: null,
        startedAt: null,
        finishesAt: null,
        lastResult: null
    };

    saveGame();
}


// Add lastResult to older forage saves.

if (
    game.forage.lastResult === undefined
) {

    game.forage.lastResult = null;

    saveGame();
}


// ==========================================
// START FOREST FORAGE
// ==========================================

function startForestForage() {

    // Do not allow another forage while
    // the familiar is already away.

    if (game.forage.active) {
        return;
    }


    const now =
        Date.now();


    game.forage.active =
        true;


    game.forage.location =
        "Mosswood Forest";


    game.forage.startedAt =
        now;


    game.forage.finishesAt =
        now + FOREST_FORAGE_TIME;


    saveGame();

    renderForage();

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


    // ======================================
    // RANDOM LOOT ROLL
    // ======================================

    const roll =
        Math.random();


    let resultTitle =
        "";


    let resultText =
        "";


    let resultIcon =
        "🌿";


    // ======================================
    // 45% - MOONMINT
    // ======================================

    if (roll < 0.45) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 1;


        addIngredient(
            "moonmint",
            amount
        );


        resultTitle =
            `Found ${amount} Moonmint`;


        resultText =
            "Your familiar returned carrying fresh Moonmint gathered beneath the forest canopy.";


        resultIcon =
            "🌿";

    }


    // ======================================
    // 30% - MOONMINT SEEDS
    // ======================================

    else if (roll < 0.75) {

        const amount =
            Math.floor(
                Math.random() * 2
            ) + 1;


        addSeeds(
            "moonmint",
            amount
        );


        resultTitle =
            `Found ${amount} Moonmint Seed${amount === 1 ? "" : "s"}`;


        resultText =
            "A few small seeds were discovered tangled among the moss.";


        resultIcon =
            "🌱";

    }


    // ======================================
    // 17% - STRANGE SEED
    // ======================================

    else if (roll < 0.92) {

        // Make sure the save has somewhere
        // to store unidentified seeds.

        if (
            typeof game.seeds.unknown
            !== "number"
        ) {

            game.seeds.unknown =
                0;

        }


        game.seeds.unknown++;


        resultTitle =
            "Found a Strange Seed";


        resultText =
            "Your familiar returned with a dark, unfamiliar seed. Whatever it grows into remains a mystery.";


        resultIcon =
            "✦";

    }


    // ======================================
    // 8% - NOTHING
    // ======================================

    else {

        resultTitle =
            "Nothing This Time";


        resultText =
            "Your familiar returned empty-pawed, though perhaps the forest will be more generous next time.";


        resultIcon =
            "🐈‍⬛";

    }


    // ======================================
    // SAVE LAST RESULT
    // ======================================

    game.forage.lastResult = {

        title:
            resultTitle,

        text:
            resultText,

        icon:
            resultIcon,

        foundAt:
            Date.now()

    };


    // ======================================
    // CLEAR EXPEDITION
    // ======================================

    game.forage.active =
        false;


    game.forage.location =
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
// FORMAT COUNTDOWN
// ==========================================

function formatForageTime(
    milliseconds
) {

    const totalSeconds =
        Math.max(
            0,
            Math.ceil(
                milliseconds / 1000
            )
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


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
// RENDER FOREST BUTTON
// ==========================================

function renderForageButton() {

    const button =
        document.getElementById(
            "forestForageButton"
        );


    if (!button) {
        return;
    }


    if (game.forage.active) {

        button.disabled =
            true;


        button.textContent =
            "Familiar Away";

    }

    else {

        button.disabled =
            false;


        button.textContent =
            "Send Familiar";

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


    // ======================================
    // NO ACTIVE EXPEDITION
    // ======================================

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


    // ======================================
    // ACTIVE EXPEDITION
    // ======================================

    const now =
        Date.now();


    const totalTime =
        game.forage.finishesAt -
        game.forage.startedAt;


    const elapsed =
        now -
        game.forage.startedAt;


    const remaining =
        game.forage.finishesAt -
        now;


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                (elapsed / totalTime) * 100
            )
        );


    if (title) {

        title.textContent =
            game.forage.location;

    }


    if (text) {

        text.textContent =
            "Your familiar is searching the forest floor, roots, and forgotten paths.";

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


    if (!result) {
        return;
    }


    if (!game.forage.lastResult) {
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

    renderFamiliar();

    renderForageButton();

    renderForageProgress();

    renderForageResult();

}


// ==========================================
// UPDATE FORAGE
// ==========================================

function updateForage() {

    // If the timer has finished,
    // complete the expedition.

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
// BUTTON EVENT
// ==========================================

const forestForageButton =
    document.getElementById(
        "forestForageButton"
    );


if (forestForageButton) {

    forestForageButton.addEventListener(
        "click",
        startForestForage
    );

}


// ==========================================
// START FORAGE PAGE
// ==========================================

updateForage();


// ==========================================
// TIMER
// ==========================================

// Refresh the countdown once every second.

setInterval(
    updateForage,
    1000
);
