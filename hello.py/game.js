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

// game.js의 openProject 함수를 아래 내용으로 교체하세요
function openProject(portal) {
    gameState.isOverlayOpen = true;
    gameState.velX = 0;

    const title = portal.getAttribute('data-title');
    const desc = portal.getAttribute('data-desc');
    const imgPath = portal.getAttribute('data-img'); // 이미지 경로 가져오기

    document.getElementById('project-title').innerText = title;
    document.getElementById('project-desc').innerText = desc;
    
    // 미디어 플레이스홀더 자리에 이미지 넣기
    const mediaBox = document.querySelector('.media-placeholder');
    mediaBox.innerHTML = `<img src="${imgPath}" style="max-width:100%; max-height:100%; border-radius:8px;">`;

    overlay.classList.remove('hidden');
}

// 별 생성 함수 (game.js 맨 아래 추가)
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150; // 별의 개수

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 랜덤 위치 및 크기
        const x = Math.random() * 5000; // 월드 전체 길이
        const y = Math.random() * (window.innerHeight - 100);
        const size = Math.random() * 3;
        const duration = 1 + Math.random() * 3; // 반짝이는 속도 랜덤

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        
        starsContainer.appendChild(star);
    }
}

// update() 함수 안에서 조명 위치 업데이트 추가
function update() {
    // ... 기존 물리 코드 ...

    // 조명이 캐릭터를 따라다님
    const playerLight = document.getElementById('player-light');
    playerLight.style.left = gameState.posX + 'px';
    playerLight.style.bottom = '100px'; // 지면에 고정

    // ... 기존 카메라/렌더링 코드 ...
}

// 게임 시작 시 별 생성 호출
createStars();
update();