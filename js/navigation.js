// ==========================================
// MOSSWOOD APOTHECARY
// Shared Navigation + Resource Bar
// ==========================================


// ==========================================
// SIDEBAR
// ==========================================

function createNavigation() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }


    // Figure out which page we're on.

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    sidebar.innerHTML = `

        <div class="logo">

            <span class="moon">
                ☾
            </span>

            <h1>
                Mosswood<br>
                Apothecary
            </h1>

        </div>


        <nav>

            <!-- GREENHOUSE -->

            <a
                class="nav-button nav-link
                ${currentPage === "greenhouse.html" ? "active" : ""}"
                href="greenhouse.html">

                🌿 Greenhouse

            </a>


            <!-- POTION ROOM -->

            <a
                class="nav-button nav-link
                ${currentPage === "potion-room.html" ? "active" : ""}"
                href="potion-room.html">

                ⚗ Potion Room

            </a>


            <!-- APOTHECARY -->

            <a
    class="nav-button nav-link
    ${currentPage === "apothecary.html" ? "active" : ""}"
    href="apothecary.html">

    🏚 Apothecary

</a>


            <a
    class="nav-button nav-link
    ${currentPage === "forage.html" ? "active" : ""}"
    href="forage.html">

    🌲 Forage

</a>


            <!-- GRIMOIRE -->

            <a
                class="nav-button nav-link
                ${currentPage === "grimoire.html" ? "active" : ""}"
                href="grimoire.html">

                📖 Grimoire

            </a>


            <!-- UPGRADES -->

            <a
    class="nav-button nav-link
    ${currentPage === "upgrades.html" ? "active" : ""}"
    href="upgrades.html">

    ⚒ Upgrades

</a>


            <!-- INVENTORY -->

            <span
                class="nav-button nav-disabled">

                🎒 Inventory

            </span>

        </nav>

    `;

}


// ==========================================
// RESOURCE BAR
// ==========================================

function createResourceBar() {

    const topbar =
        document.getElementById("topbar");

    if (!topbar) {
        return;
    }


    topbar.innerHTML = `

        <div class="resource">

            🪙
            <span id="coins">
                0
            </span>

        </div>


        <div class="resource">

            🌿
            <span id="plants">
                0
            </span>

        </div>


        <div class="resource">

            🧪
            <span id="potions">
                0
            </span>

        </div>

    `;

}


// ==========================================
// INITIALIZE SHARED LAYOUT
// ==========================================

createNavigation();

createResourceBar();


// ==========================================
// UPDATE RESOURCE VALUES
// ==========================================

// game.js loads before navigation.js.
//
// That means the resource elements did not
// exist when game.js first tried to update
// them.
//
// Now that navigation.js has created them,
// update them again.

if (
    typeof updateResourceBar
    === "function"
) {

    updateResourceBar();

}
