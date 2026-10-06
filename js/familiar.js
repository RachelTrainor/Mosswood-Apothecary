// ==========================================
// MOSSWOOD APOTHECARY
// Familiar System
// V2 - Care, Stats + Bond
// ==========================================


// ==========================================
// SETTINGS
// ==========================================

const FAMILIAR_MAX_STAT = 100;

const FEED_COST = 5;
const FEED_HUNGER_GAIN = 20;
const FEED_ENERGY_GAIN = 10;

const PET_HAPPINESS_GAIN = 10;
const PET_BOND_GAIN = 2;
const PET_COOLDOWN = 2 * 60 * 1000;

const PLAY_ENERGY_COST = 10;
const PLAY_HAPPINESS_GAIN = 20;
const PLAY_BOND_GAIN = 5;

const REST_ENERGY_GAIN = 20;
const REST_COOLDOWN = 2 * 60 * 1000;

const BOND_XP_PER_LEVEL = 25;


// ==========================================
// ELEMENTS
// ==========================================

const familiarNameElement =
    document.getElementById(
        "familiarName"
    );

const familiarNameInput =
    document.getElementById(
        "familiarNameInput"
    );

const saveFamiliarNameButton =
    document.getElementById(
        "saveFamiliarName"
    );


const familiarStatus =
    document.getElementById(
        "familiarStatus"
    );

const familiarMessage =
    document.getElementById(
        "familiarMessage"
    );


const energyValue =
    document.getElementById(
        "energyValue"
    );

const hungerValue =
    document.getElementById(
        "hungerValue"
    );

const happinessValue =
    document.getElementById(
        "happinessValue"
    );

const bondValue =
    document.getElementById(
        "bondValue"
    );


const energyBar =
    document.getElementById(
        "energyBar"
    );

const hungerBar =
    document.getElementById(
        "hungerBar"
    );

const happinessBar =
    document.getElementById(
        "happinessBar"
    );

const bondBar =
    document.getElementById(
        "bondBar"
    );


const feedButton =
    document.getElementById(
        "feedFamiliar"
    );

const petButton =
    document.getElementById(
        "petFamiliar"
    );

const playButton =
    document.getElementById(
        "playFamiliar"
    );

const restButton =
    document.getElementById(
        "restFamiliar"
    );


// ==========================================
// HELPERS
// ==========================================

function clampFamiliarStat(
    value
) {

    return Math.max(
        0,
        Math.min(
            FAMILIAR_MAX_STAT,
            value
        )
    );

}


// ==========================================
// GET DISPLAY NAME
// ==========================================

function getFamiliarDisplayName() {

    const name =
        game.familiar.name.trim();


    if (name) {

        return name;

    }


    return "Your familiar";

}


// ==========================================
// DISPLAY MESSAGE
// ==========================================

function setFamiliarMessage(
    message
) {

    if (!familiarMessage) {
        return;
    }


    familiarMessage.textContent =
        message;

}


// ==========================================
// FORMAT COOLDOWN
// ==========================================

function formatCooldown(
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


    if (minutes > 0) {

        return (
            minutes
            + ":"
            + String(seconds).padStart(
                2,
                "0"
            )
        );

    }


    return (
        "0:"
        + String(seconds).padStart(
            2,
            "0"
        )
    );

}


// ==========================================
// FAMILIAR NAME
// ==========================================

function renderFamiliarName() {

    if (
        !familiarNameElement ||
        !familiarNameInput ||
        !saveFamiliarNameButton
    ) {

        return;

    }


    const name =
        game.familiar.name.trim();


    if (name) {

        familiarNameElement.textContent =
            name;

        familiarNameInput.value =
            name;

        saveFamiliarNameButton.textContent =
            "Rename";

    }

    else {

        familiarNameElement.textContent =
            "Your Familiar";

        familiarNameInput.value =
            "";

        saveFamiliarNameButton.textContent =
            "Name Familiar";

    }

}


// ==========================================
// SAVE FAMILIAR NAME
// ==========================================

function saveFamiliarName() {

    if (!familiarNameInput) {
        return;
    }


    const name =
        familiarNameInput.value.trim();


    if (!name) {

        setFamiliarMessage(
            "Your familiar tilts its head, waiting for a name."
        );

        return;

    }


    game.familiar.name =
        name;


    saveGame();

    renderFamiliarName();
    renderFamiliarStatus();


    setFamiliarMessage(
        `${name} seems pleased with the name.`
    );

}


// ==========================================
// FAMILIAR STATUS
// ==========================================

function renderFamiliarStatus() {

    if (!familiarStatus) {
        return;
    }


    const name =
        getFamiliarDisplayName();


    if (
        game.familiar.energy <= 20
    ) {

        familiarStatus.textContent =
            `${name} looks tired and could use some rest.`;

        return;

    }


    if (
        game.familiar.hunger <= 20
    ) {

        familiarStatus.textContent =
            `${name} looks hungry and keeps glancing toward the food.`;

        return;

    }


    if (
        game.familiar.happiness <= 20
    ) {

        familiarStatus.textContent =
            `${name} seems unusually quiet and could use some attention.`;

        return;

    }


    if (
        game.familiar.happiness >= 80 &&
        game.familiar.energy >= 60 &&
        game.familiar.hunger >= 60
    ) {

        familiarStatus.textContent =
            `${name} seems content and ready for whatever Mosswood brings.`;

        return;

    }


    familiarStatus.textContent =
        `${name} watches the room quietly from your side.`;

}


// ==========================================
// BOND LEVEL
// ==========================================

function updateBondLevel() {

    const calculatedLevel =
        Math.floor(
            game.familiar.bondXP
            / BOND_XP_PER_LEVEL
        ) + 1;


    if (
        calculatedLevel >
        game.familiar.bondLevel
    ) {

        game.familiar.bondLevel =
            calculatedLevel;

        saveGame();

        setFamiliarMessage(
            `${getFamiliarDisplayName()}'s bond with you has grown stronger.`
        );

    }

    else {

        game.familiar.bondLevel =
            calculatedLevel;

    }

}


// ==========================================
// ADD BOND XP
// ==========================================

function addFamiliarBond(
    amount
) {

    game.familiar.bondXP +=
        amount;


    if (
        game.familiar.bondXP < 0
    ) {

        game.familiar.bondXP = 0;

    }


    updateBondLevel();

}


// ==========================================
// RENDER STATS
// ==========================================

function renderFamiliarStats() {

    game.familiar.energy =
        clampFamiliarStat(
            game.familiar.energy
        );

    game.familiar.hunger =
        clampFamiliarStat(
            game.familiar.hunger
        );

    game.familiar.happiness =
        clampFamiliarStat(
            game.familiar.happiness
        );


    if (energyValue) {

        energyValue.textContent =
            `${Math.round(
                game.familiar.energy
            )} / 100`;

    }


    if (hungerValue) {

        hungerValue.textContent =
            `${Math.round(
                game.familiar.hunger
            )} / 100`;

    }


    if (happinessValue) {

        happinessValue.textContent =
            `${Math.round(
                game.familiar.happiness
            )} / 100`;

    }


    if (energyBar) {

        energyBar.style.width =
            `${game.familiar.energy}%`;

    }


    if (hungerBar) {

        hungerBar.style.width =
            `${game.familiar.hunger}%`;

    }


    if (happinessBar) {

        happinessBar.style.width =
            `${game.familiar.happiness}%`;

    }


    const currentLevel =
        game.familiar.bondLevel;

    const currentLevelStartXP =
        (currentLevel - 1)
        * BOND_XP_PER_LEVEL;

    const xpIntoLevel =
        Math.max(
            0,
            game.familiar.bondXP
            - currentLevelStartXP
        );

    const bondPercent =
        Math.min(
            100,
            (
                xpIntoLevel
                / BOND_XP_PER_LEVEL
            ) * 100
        );


    if (bondValue) {

        bondValue.textContent =
            `Level ${currentLevel}`;

    }


    if (bondBar) {

        bondBar.style.width =
            `${bondPercent}%`;

    }


    renderFamiliarStatus();

}


// ==========================================
// FEED
// ==========================================

function feedFamiliar() {

    const name =
        getFamiliarDisplayName();


    if (
        game.familiar.hunger >= 100 &&
        game.familiar.energy >= 100
    ) {

        setFamiliarMessage(
            `${name} is already full and doesn't seem interested in food.`
        );

        return;

    }


    if (
        game.coins < FEED_COST
    ) {

        setFamiliarMessage(
            `You need ${FEED_COST} coins to buy something for ${name} to eat.`
        );

        return;

    }


    game.coins -=
        FEED_COST;


    game.familiar.hunger =
        clampFamiliarStat(
            game.familiar.hunger
            + FEED_HUNGER_GAIN
        );


    game.familiar.energy =
        clampFamiliarStat(
            game.familiar.energy
            + FEED_ENERGY_GAIN
        );


    saveGame();

    updateResourceBar();

    renderFamiliarStats();


    setFamiliarMessage(
        `${name} happily finishes the small meal.`
    );

}


// ==========================================
// PET
// ==========================================

function petFamiliar() {

    const name =
        getFamiliarDisplayName();

    const now =
        Date.now();

    const timeSinceLastPet =
        now
        - game.familiar.lastPet;


    if (
        timeSinceLastPet <
        PET_COOLDOWN
    ) {

        const remaining =
            PET_COOLDOWN
            - timeSinceLastPet;


        setFamiliarMessage(
            `${name} has had enough attention for the moment. Try again in ${formatCooldown(
                remaining
            )}.`
        );

        return;

    }


    game.familiar.happiness =
        clampFamiliarStat(
            game.familiar.happiness
            + PET_HAPPINESS_GAIN
        );


    game.familiar.lastPet =
        now;


    addFamiliarBond(
        PET_BOND_GAIN
    );


    saveGame();

    renderFamiliarStats();


    setFamiliarMessage(
        `${name} leans into your hand with a quiet purr.`
    );

}


// ==========================================
// PLAY
// ==========================================

function playWithFamiliar() {

    const name =
        getFamiliarDisplayName();


    if (
        game.familiar.energy <
        PLAY_ENERGY_COST
    ) {

        setFamiliarMessage(
            `${name} is too tired to play right now.`
        );

        return;

    }


    if (
        game.familiar.happiness >= 100
    ) {

        setFamiliarMessage(
            `${name} already seems completely content.`
        );

        return;

    }


    game.familiar.energy =
        clampFamiliarStat(
            game.familiar.energy
            - PLAY_ENERGY_COST
        );


    game.familiar.happiness =
        clampFamiliarStat(
            game.familiar.happiness
            + PLAY_HAPPINESS_GAIN
        );


    addFamiliarBond(
        PLAY_BOND_GAIN
    );


    saveGame();

    renderFamiliarStats();


    setFamiliarMessage(
        `${name} darts after the toy with sudden enthusiasm.`
    );

}


// ==========================================
// REST
// ==========================================

function restFamiliar() {

    const name =
        getFamiliarDisplayName();

    const now =
        Date.now();

    const timeSinceLastRest =
        now
        - game.familiar.lastRest;


    if (
        game.familiar.energy >= 100
    ) {

        setFamiliarMessage(
            `${name} is already fully rested.`
        );

        return;

    }


    if (
        timeSinceLastRest <
        REST_COOLDOWN
    ) {

        const remaining =
            REST_COOLDOWN
            - timeSinceLastRest;


        setFamiliarMessage(
            `${name} isn't ready to rest again yet. Try again in ${formatCooldown(
                remaining
            )}.`
        );

        return;

    }


    game.familiar.energy =
        clampFamiliarStat(
            game.familiar.energy
            + REST_ENERGY_GAIN
        );


    game.familiar.lastRest =
        now;


    saveGame();

    renderFamiliarStats();


    setFamiliarMessage(
        `${name} curls up somewhere warm and rests for a while.`
    );

}


// ==========================================
// UPDATE BUTTON STATES
// ==========================================

function updateFamiliarButtons() {

    const now =
        Date.now();


    // --------------------------------------
    // PET
    // --------------------------------------

    if (petButton) {

        const petRemaining =
            PET_COOLDOWN
            - (
                now
                - game.familiar.lastPet
            );


        if (
            petRemaining > 0
        ) {

            petButton.disabled =
                true;

            petButton.textContent =
                `♥ Pet (${formatCooldown(
                    petRemaining
                )})`;

        }

        else {

            petButton.disabled =
                false;

            petButton.textContent =
                "♥ Pet";

        }

    }


    // --------------------------------------
    // REST
    // --------------------------------------

    if (restButton) {

        const restRemaining =
            REST_COOLDOWN
            - (
                now
                - game.familiar.lastRest
            );


        if (
            restRemaining > 0
        ) {

            restButton.disabled =
                true;

            restButton.textContent =
                `💤 Rest (${formatCooldown(
                    restRemaining
                )})`;

        }

        else {

            restButton.disabled =
                false;

            restButton.textContent =
                "💤 Rest";

        }

    }


    // --------------------------------------
    // PLAY
    // --------------------------------------

    if (playButton) {

        if (
            game.familiar.energy <
            PLAY_ENERGY_COST
        ) {

            playButton.disabled =
                true;

        }

        else {

            playButton.disabled =
                false;

        }

    }


    // --------------------------------------
    // FEED
    // --------------------------------------

    if (feedButton) {

        if (
            game.coins < FEED_COST
        ) {

            feedButton.disabled =
                true;

        }

        else {

            feedButton.disabled =
                false;

        }

    }

}


// ==========================================
// NAME EVENTS
// ==========================================

if (saveFamiliarNameButton) {

    saveFamiliarNameButton.addEventListener(
        "click",
        saveFamiliarName
    );

}


if (familiarNameInput) {

    familiarNameInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                saveFamiliarName();

            }

        }
    );

}


// ==========================================
// CARE EVENTS
// ==========================================

if (feedButton) {

    feedButton.addEventListener(
        "click",
        feedFamiliar
    );

}


if (petButton) {

    petButton.addEventListener(
        "click",
        petFamiliar
    );

}


if (playButton) {

    playButton.addEventListener(
        "click",
        playWithFamiliar
    );

}


if (restButton) {

    restButton.addEventListener(
        "click",
        restFamiliar
    );

}


// ==========================================
// INITIALIZE
// ==========================================

updateBondLevel();

renderFamiliarName();

renderFamiliarStats();

updateFamiliarButtons();


// ==========================================
// COOLDOWN TIMER
// ==========================================
//
// Updates the Pet and Rest countdowns while
// the Familiar page is open.
// ==========================================

setInterval(
    updateFamiliarButtons,
    1000
);
