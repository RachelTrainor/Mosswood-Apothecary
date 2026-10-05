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

            <a
                class="nav-button nav-link
                ${currentPage === "greenhouse.html" ? "active" : ""}"
                href="greenhouse.html">

                🌿 Greenhouse

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "potion-room.html" ? "active" : ""}"
                href="potion-room.html">

                ⚗ Potion Room

            </a>


            <span
                class="nav-button nav-disabled">

                🏚 Apothecary

            </span>


            <span
                class="nav-button nav-disabled">

                🌲 Forage

            </span>


            <a
    class="nav-button nav-link
    ${currentPage === "grimoire.html" ? "active" : ""}"
    href="grimoire.html">

    📖 Grimoire

</a>


            <span
                class="nav-button nav-disabled">

                ⚒ Upgrades

            </span>


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


// game.js may have already loaded before
// navigation.js created the resource elements.
//
// Refresh them now if the shared function
// exists.

if (
    typeof updateResourceBar
    === "function"
) {

    updateResourceBar();

}
