// ==========================================
// MOSSWOOD APOTHECARY
// Familiar System
// V1 - Familiar Naming
// ==========================================


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

const familiarMessage =
    document.getElementById(
        "familiarMessage"
    );


// ==========================================
// DISPLAY FAMILIAR NAME
// ==========================================

function renderFamiliarName() {

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

    const name =
        familiarNameInput.value.trim();


    if (!name) {

        familiarMessage.textContent =
            "Your familiar tilts its head, waiting for a name.";

        return;

    }


    game.familiar.name =
        name;


    saveGame();

    renderFamiliarName();


    familiarMessage.textContent =
        `${name} seems pleased with the name.`;

}


// ==========================================
// NAME BUTTON
// ==========================================

saveFamiliarNameButton.addEventListener(
    "click",
    saveFamiliarName
);


// ==========================================
// PRESS ENTER TO SAVE NAME
// ==========================================

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


// ==========================================
// INITIALIZE
// ==========================================

renderFamiliarName();
