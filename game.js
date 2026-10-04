// Mosswood Apothecary
// Main game script

const game = {
    coins: 100,
    plants: 0,
    potions: 0
};

function updateResources() {
    document.getElementById("coins").textContent = game.coins;
    document.getElementById("plants").textContent = game.plants;
    document.getElementById("potions").textContent = game.potions;
}

updateResources();

document
    .getElementById("enterGreenhouse")
    .addEventListener("click", function () {

        alert("The greenhouse is coming next 🌿");

    });
