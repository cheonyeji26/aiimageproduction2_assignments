const player = document.getElementById('player');
const world = document.getElementById('world');
const portals = document.querySelectorAll('.portal');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');

// Game State
let gameState = {
    posX: 100,
    posY: 0,
    velX: 0,
    velY: 0,
    isJumping: false,
    speed: 0.8,
    friction: 0.9,
    gravity: 0.5,
    jumpStrength: -12,
    keys: {},
    isOverlayOpen: false
};

// Input Listeners
window.addEventListener('keydown', (e) => gameState.keys[e.code] = true);
window.addEventListener('keyup', (e) => gameState.keys[e.code] = false);

// Close Overlay
closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    gameState.isOverlayOpen = false;
});

function update() {
    if (gameState.isOverlayOpen) return;

    // Horizontal Movement
    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) gameState.velX += gameState.speed;
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) gameState.velX -= gameState.speed;

    // Jump Logic
    if ((gameState.keys['ArrowUp'] || gameState.keys['KeyW'] || gameState.keys['Space']) && !gameState.isJumping) {
        gameState.velY = gameState.jumpStrength;
        gameState.isJumping = true;
    }

    // Apply Physics
    gameState.velX *= gameState.friction;
    gameState.velY += gameState.gravity;
    gameState.posX += gameState.velX;
    gameState.posY += gameState.velY;

    // Ground Collision
    if (gameState.posY > 0) {
        gameState.posY = 0;
        gameState.velY = 0;
        gameState.isJumping = false;
    }

    // Level Bounds
    if (gameState.posX < 0) gameState.posX = 0;

    // Apply Styles
    player.style.left = gameState.posX + 'px';
    player.style.bottom = (100 - gameState.posY) + 'px'; // 100 is ground height

    // Camera Follow (Scroll World)
    const viewportWidth = window.innerWidth;
    const scrollTrigger = viewportWidth / 2;
    if (gameState.posX > scrollTrigger) {
        world.style.transform = `translateX(-${gameState.posX - scrollTrigger}px)`;
    }

    checkCollisions();
    requestAnimationFrame(update);
}

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();

    portals.forEach(portal => {
        const portalRect = portal.getBoundingClientRect();

        // Standard AABB Collision detection
        if (
            playerRect.left < portalRect.right &&
            playerRect.right > portalRect.left &&
            playerRect.top < portalRect.bottom &&
            playerRect.bottom > portalRect.top
        ) {
            openProject(portal);
        }
    });
}

function openProject(portal) {
    gameState.isOverlayOpen = true;
    
    // Stop character movement
    gameState.velX = 0;
    
    // Fill overlay data
    document.getElementById('project-title').innerText = portal.getAttribute('data-title');
    document.getElementById('project-desc').innerText = portal.getAttribute('data-desc');
    
    overlay.classList.remove('hidden');
}

// Start Game Loop
update();