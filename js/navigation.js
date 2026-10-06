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

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    sidebar.innerHTML = `

        <nav class="mosswood-nav">

            <a
                class="nav-button nav-link
                ${currentPage === "greenhouse.html" ? "active" : ""}"
                href="greenhouse.html">

                <span class="nav-icon">🌿</span>
                <span>Greenhouse</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "potion-room.html" ? "active" : ""}"
                href="potion-room.html">

                <span class="nav-icon">⚗</span>
                <span>Potion Room</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "apothecary.html" ? "active" : ""}"
                href="apothecary.html">

                <span class="nav-icon">🏚</span>
                <span>Apothecary</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "forage.html" ? "active" : ""}"
                href="forage.html">

                <span class="nav-icon">🌲</span>
                <span>Forage</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "grimoire.html" ? "active" : ""}"
                href="grimoire.html">

                <span class="nav-icon">📖</span>
                <span>Grimoire</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "upgrades.html" ? "active" : ""}"
                href="upgrades.html">

                <span class="nav-icon">⚒</span>
                <span>Upgrades</span>

            </a>


            <a
                class="nav-button nav-link
                ${currentPage === "inventory.html" ? "active" : ""}"
                href="inventory.html">

                <span class="nav-icon">🎒</span>
                <span>Inventory</span>

            </a>

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

if (
    typeof updateResourceBar
    === "function"
) {

    updateResourceBar();

}
