const cat = document.getElementById('cat');
const gameArea = document.getElementById('game-area');

// Game area dimensions (ensure these match CSS or are dynamically obtained)
const gameAreaWidth = gameArea.clientWidth;
const gameAreaHeight = gameArea.clientHeight;

// Cat dimensions (ensure these match CSS or are dynamically obtained, subtracting border/padding if any)
// For simplicity, using approximate values assuming image is loaded and has dimensions.
// A more robust solution would wait for the image to load to get its actual dimensions.
let catWidth = cat.offsetWidth || 50; // Use offsetWidth or fallback to CSS width
let catHeight = cat.offsetHeight || 50; // Use offsetHeight or fallback to CSS height (assuming square for now)

// Cat's initial position (centered)
let catX = (gameAreaWidth - catWidth) / 2;
let catY = (gameAreaHeight - catHeight) / 2;

// Cat's speed (pixels per interval)
const speed = 2; // Adjust for desired speed

// Cat's initial direction (angle in radians or dx, dy)
// Let's use dx, dy for simpler boundary checks
let dx = speed;
let dy = speed;

function updateCatPosition() {
    // Move the cat
    catX += dx;
    catY += dy;

    // Boundary detection and direction change
    // Left boundary
    if (catX < 0) {
        catX = 0;
        dx = Math.abs(dx) * (Math.random() > 0.5 ? 1 : -1); // Randomize new horizontal direction
        dy = (Math.random() * 2 - 1) * speed; // Randomize new vertical direction
    }
    // Right boundary
    if (catX + catWidth > gameAreaWidth) {
        catX = gameAreaWidth - catWidth;
        dx = -Math.abs(dx) * (Math.random() > 0.5 ? 1 : -1); // Randomize new horizontal direction
        dy = (Math.random() * 2 - 1) * speed; // Randomize new vertical direction
    }
    // Top boundary
    if (catY < 0) {
        catY = 0;
        dy = Math.abs(dy) * (Math.random() > 0.5 ? 1 : -1); // Randomize new vertical direction
        dx = (Math.random() * 2 - 1) * speed; // Randomize new horizontal direction
    }
    // Bottom boundary
    if (catY + catHeight > gameAreaHeight) {
        catY = gameAreaHeight - catHeight;
        dy = -Math.abs(dy) * (Math.random() > 0.5 ? 1 : -1); // Randomize new vertical direction
        dx = (Math.random() * 2 - 1) * speed; // Randomize new horizontal direction
    }
    
    // Normalize speed after direction change to maintain constant speed (optional, but good for smoother movement)
    const magnitude = Math.sqrt(dx*dx + dy*dy);
    if (magnitude > 0) {
        dx = (dx / magnitude) * speed;
        dy = (dy / magnitude) * speed;
    }


    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';
}

// Game loop
function gameLoop() {
    updateCatPosition();
    requestAnimationFrame(gameLoop); // For smooth animation
}

// Start the game loop when the image is loaded to get correct dimensions
// A more robust way for cat dimensions:
if (cat.complete) { // If image is already cached/loaded
    catWidth = cat.offsetWidth; // Update catWidth with actual dimension
    catHeight = cat.offsetHeight; // Update catHeight with actual dimension
    // Re-initialize catX, catY if needed, or ensure initial CSS centering is fine
    catX = (gameAreaWidth - catWidth) / 2;
    catY = (gameAreaHeight - catHeight) / 2;
    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';
    gameLoop();
} else {
    cat.onload = () => {
        catWidth = cat.offsetWidth; // Update catWidth with actual dimension
        catHeight = cat.offsetHeight; // Update catHeight with actual dimension
        catX = (gameAreaWidth - catWidth) / 2;
        catY = (gameAreaHeight - catHeight) / 2;
        cat.style.left = catX + 'px';
        cat.style.top = catY + 'px';
        gameLoop();
    };
}
