let character = document.getElementById("character");
let game = document.getElementById("game");
let startButton = document.getElementById("startButton");
let instructions = document.getElementById("instructions");
let interval;
let both = 0;
let counter = 0;
let currentBlocks = [];

startButton.addEventListener("click", startCountdown);

function startCountdown() {
    startButton.style.display = "none";

    let countdown = 3; 
    let countdownDisplay = document.createElement("div");
    countdownDisplay.setAttribute("id", "countdown");
    countdownDisplay.textContent = countdown;
    document.body.appendChild(countdownDisplay);

    let countdownInterval = setInterval(() => {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            document.body.removeChild(countdownDisplay);
            startGame(); 
        } else {
            countdown--;
            countdownDisplay.textContent = countdown;
        }
    }, 1000); 
}

function startGame() {
    instructions.style.display = "block"; 

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
            alert("Game over. Score: " + (counter - 9));
            clearInterval(blocks);
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

function moveLeft() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0) {
        character.style.left = left - 2 + "px";
    }
}

function moveRight() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380) {
        character.style.left = left + 2 + "px";
    }
}
