const player = document.getElementById('player');
const world = document.getElementById('world');
const portals = document.querySelectorAll('.portal');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const playerLight = document.getElementById('player-light');

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
window.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
});

// Close Overlay
closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    gameState.isOverlayOpen = false;
    // 오버레이 닫은 후 게임 루프 재개
    requestAnimationFrame(update);
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

    // Apply Styles (Player & Light)
    player.style.left = gameState.posX + 'px';
    player.style.bottom = (100 - gameState.posY) + 'px';
    
    if (playerLight) {
        playerLight.style.left = gameState.posX + 'px';
        playerLight.style.bottom = '100px'; 
    }

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
    if (gameState.isOverlayOpen) return;
    
    gameState.isOverlayOpen = true;
    gameState.velX = 0;
    gameState.keys = {}; // 키 입력 초기화

    const title = portal.getAttribute('data-title');
    const desc = portal.getAttribute('data-desc');
    const imgPath = portal.getAttribute('data-img');

    document.getElementById('project-title').innerText = title;
    document.getElementById('project-desc').innerText = desc;
    
    const mediaBox = document.querySelector('.media-placeholder');
    mediaBox.innerHTML = `<img src="${imgPath}" style="max-width:100%; max-height:100%; border-radius:8px;" onerror="this.alt='이미지를 찾을 수 없습니다'">`;

    overlay.classList.remove('hidden');
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const x = Math.random() * 5000;
        const y = Math.random() * (window.innerHeight - 100);
        const size = Math.random() * 3;
        const duration = 1 + Math.random() * 3;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        starsContainer.appendChild(star);
    }
}

// 실행
createStars();
update();