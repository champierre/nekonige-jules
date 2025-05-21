const cat = document.getElementById('cat');
const mouse = document.getElementById('mouse'); // Get mouse element
const gameArea = document.getElementById('game-area');

// Game area dimensions (ensure these match CSS or are dynamically obtained)
const gameAreaWidth = gameArea.clientWidth;
const gameAreaHeight = gameArea.clientHeight;

// Cat dimensions (ensure these match CSS or are dynamically obtained, subtracting border/padding if any)
// For simplicity, using approximate values assuming image is loaded and has dimensions.
// A more robust solution would wait for the image to load to get its actual dimensions.
let catWidth = cat.offsetWidth || 50; // Use offsetWidth or fallback to CSS width
let catHeight = cat.offsetHeight || 50; // Use offsetHeight or fallback to CSS height (assuming square for now)

// Mouse dimensions
let mouseWidth = mouse.offsetWidth || 30;
let mouseHeight = mouse.offsetHeight || 30;

// Cat's initial position (centered)
let catX = (gameAreaWidth - catWidth) / 2;
let catY = (gameAreaHeight - catHeight) / 2;

// Mouse's initial position
let mouseX = gameAreaWidth / 4;
let mouseY = gameAreaHeight / 4;

// Cat's speed (pixels per interval)
const speed = 2; // Adjust for desired speed
const mouseSpeed = 1.5; // Mouse speed

// Cat's initial direction (angle in radians or dx, dy)
// Let's use dx, dy for simpler boundary checks
let dx = speed;
let dy = speed; // cat's initial dy, will be updated by chase logic

// Mouse's initial direction
let mouseDx = (Math.random() * 2 - 1) * mouseSpeed;
let mouseDy = (Math.random() * 2 - 1) * mouseSpeed;

let animationFrameId; // For controlling game loop

function checkCollision() {
    // Check for overlap on X and Y axes
    const overlapX = catX < mouseX + mouseWidth && catX + catWidth > mouseX;
    const overlapY = catY < mouseY + mouseHeight && catY + catHeight > mouseY;
    return overlapX && overlapY;
}

function updateCatPosition() {
    // Calculate vector from cat to mouse
    let vecX = mouseX - catX;
    let vecY = mouseY - catY;

    // Normalize this vector
    const distance = Math.sqrt(vecX * vecX + vecY * vecY);
    let currentDx, currentDy;
    if (distance > 0) { // Avoid division by zero
        currentDx = (vecX / distance) * speed;
        currentDy = (vecY / distance) * speed;
    } else {
        currentDx = 0;
        currentDy = 0;
    }

    // Move the cat
    catX += currentDx;
    catY += currentDy;

    // Boundary clamping
    catX = Math.max(0, Math.min(catX, gameAreaWidth - catWidth));
    catY = Math.max(0, Math.min(catY, gameAreaHeight - catHeight));

    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';
}

function updateMousePosition() {
    // Move the mouse
    mouseX += mouseDx;
    mouseY += mouseDy;

    // Boundary detection and direction change for mouse
    if (mouseX < 0) {
        mouseX = 0;
        mouseDx = Math.abs(mouseDx) * (Math.random() > 0.5 ? 1 : -1);
        mouseDy = (Math.random() * 2 - 1) * mouseSpeed;
    }
    if (mouseX + mouseWidth > gameAreaWidth) {
        mouseX = gameAreaWidth - mouseWidth;
        mouseDx = -Math.abs(mouseDx) * (Math.random() > 0.5 ? 1 : -1);
        mouseDy = (Math.random() * 2 - 1) * mouseSpeed;
    }
    if (mouseY < 0) {
        mouseY = 0;
        mouseDy = Math.abs(mouseDy) * (Math.random() > 0.5 ? 1 : -1);
        mouseDx = (Math.random() * 2 - 1) * mouseSpeed;
    }
    if (mouseY + mouseHeight > gameAreaHeight) {
        mouseY = gameAreaHeight - mouseHeight;
        mouseDy = -Math.abs(mouseDy) * (Math.random() > 0.5 ? 1 : -1);
        mouseDx = (Math.random() * 2 - 1) * mouseSpeed;
    }

    // Normalize speed
    const magnitude = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    if (magnitude > 0) {
        mouseDx = (mouseDx / magnitude) * mouseSpeed;
        mouseDy = (mouseDy / magnitude) * mouseSpeed;
    }

    mouse.style.left = mouseX + 'px';
    mouse.style.top = mouseY + 'px';
}

// Game loop
function gameLoop() {
    updateCatPosition();
    updateMousePosition();

    if (checkCollision()) {
        cancelAnimationFrame(animationFrameId);
        const gameOverMessage = document.createElement('div');
        gameOverMessage.textContent = 'ゲームオーバー！'; // "Game Over!" in Japanese
        gameOverMessage.style.position = 'absolute';
        gameOverMessage.style.top = '50%';
        gameOverMessage.style.left = '50%';
        gameOverMessage.style.transform = 'translate(-50%, -50%)';
        gameOverMessage.style.fontSize = '30px';
        gameOverMessage.style.color = 'red';
        gameOverMessage.style.backgroundColor = 'white';
        gameOverMessage.style.padding = '10px';
        gameOverMessage.style.border = '1px solid black';
        gameArea.appendChild(gameOverMessage);
    } else {
        animationFrameId = requestAnimationFrame(gameLoop); // Continue loop if no collision
    }
}

// Start the game loop when images are loaded to get correct dimensions

function startGame() {
    // Initialize cat dimensions and position
    catWidth = cat.offsetWidth;
    catHeight = cat.offsetHeight;
    catX = (gameAreaWidth - catWidth) / 2;
    catY = (gameAreaHeight - catHeight) / 2;
    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';

    // Initialize mouse dimensions and position
    mouseWidth = mouse.offsetWidth;
    mouseHeight = mouse.offsetHeight;
    mouseX = gameAreaWidth / 4; // Initial mouse position
    mouseY = gameAreaHeight / 4;
    mouse.style.left = mouseX + 'px';
    mouse.style.top = mouseY + 'px';

    animationFrameId = requestAnimationFrame(gameLoop); // Start the game loop
}

let catLoaded = cat.complete;
let mouseLoaded = mouse.complete;

if (catLoaded && mouseLoaded) {
    startGame();
} else {
    if (!catLoaded) {
        cat.onload = () => {
            catLoaded = true;
            if (mouseLoaded) {
                startGame();
            }
        };
    }
    if (!mouseLoaded) {
        mouse.onload = () => {
            mouseLoaded = true;
            if (catLoaded) {
                startGame();
            }
        };
    }
}
