// Get references to the character, game container, start button, instructions, and other necessary variables
let character = document.getElementById("character");
let game = document.getElementById("game");
let startButton = document.getElementById("startButton");
let instructions = document.getElementById("instructions");
let interval;
let both = 0;
let counter = 0;
let currentBlocks = [];

// Add event listener to start button
startButton.addEventListener("click", startCountdown);

// Function to handle countdown before starting the game
function startCountdown() {
    startButton.style.display = "none"; // Hide the start button

    let countdown = 3; // Set initial countdown value
    let countdownDisplay = document.createElement("div"); // Create a countdown display element
    countdownDisplay.setAttribute("id", "countdown"); // Set its ID
    countdownDisplay.textContent = countdown; // Set initial countdown text
    document.body.appendChild(countdownDisplay); // Append countdown display to the document body

    // Countdown interval to update countdown display
    let countdownInterval = setInterval(() => {
        if (countdown === 0) { // If countdown reaches zero
            clearInterval(countdownInterval); // Clear the countdown interval
            document.body.removeChild(countdownDisplay); // Remove the countdown display
            startGame(); // Start the game
        } else {
            countdown--; // Decrease countdown value
            countdownDisplay.textContent = countdown; // Update countdown display
        }
    }, 1000); // Run every second
}

// Function to start the game
function startGame() {
    instructions.style.display = "block"; // Display game instructions
    let backgroundMusic = document.getElementById("backgroundMusic"); // Get reference to background music element
    backgroundMusic.play(); // Play background music

    // Event listeners to handle character movement
    document.addEventListener("keydown", event => {
        if (both == 0) {
            both++;
            if (event.key === "ArrowLeft") {
                interval = setInterval(moveLeft, 1);
            }
            if (event.key === "ArrowRight") {
                interval = setInterval(moveRight, 1);
            }
        }
    });
    document.addEventListener("keyup", event => {
        clearInterval(interval);
        both = 0;
    });

    // Function to create and move blocks in the game
    let blocks = setInterval(function () {
        let blockLast = document.getElementById("block" + (counter - 1));
        let holeLast = document.getElementById("hole" + (counter - 1));
        let blockLastTop = 0;
        let holeLastTop = 0;
        if (counter > 0) {
            blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
            holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
        }
        if (blockLastTop < 400 || counter === 0) {
            let block = document.createElement("div");
            let hole = document.createElement("div");
            block.setAttribute("class", "block");
            hole.setAttribute("class", "hole");
            block.setAttribute("id", "block" + counter);
            hole.setAttribute("id", "hole" + counter);
            block.style.top = blockLastTop + 100 + "px";
            hole.style.top = holeLastTop + 100 + "px";
            let random = Math.floor(Math.random() * 360);
            hole.style.left = random + "px";
            game.appendChild(block);
            game.appendChild(hole);
            currentBlocks.push(counter);
            counter++;
        }
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        let drop = 0;
        if (characterTop <= 0) {
            clearInterval(blocks);
            backgroundMusic.pause();
            alert("Game over. Score: " + (counter - 9));
            location.reload();
        }
        for (let i = 0; i < currentBlocks.length; i++) {
            let current = currentBlocks[i];
            let iblock = document.getElementById("block" + current);
            let ihole = document.getElementById("hole" + current);
            let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
            let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));
            iblock.style.top = iblockTop - 1 + "px";
            ihole.style.top = iblockTop - 1 + "px";
            if (iblockTop < -20) {
                currentBlocks.shift();
                iblock.remove();
                ihole.remove();
            }
            if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
                drop++;
                if (iholeLeft <= characterLeft && iholeLeft + 20 >= characterLeft) {
                    drop = 0;
                }
            }
        }
        if (drop == 0) {
            if (characterTop < 480) {
                character.style.top = characterTop + 2 + "px";
            }
        } else {
            character.style.top = characterTop - 0.5 + "px";
        }
    }, 1);
}

// Function to move character left
function moveLeft() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0) {
        character.style.left = left - 2 + "px";
    }
}

// Function to move character right
function moveRight() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380) {
        character.style.left = left + 2 + "px";
    }
}
