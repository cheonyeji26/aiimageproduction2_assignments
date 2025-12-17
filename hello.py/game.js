const player = document.getElementById('player');
const world = document.getElementById('world');
const portals = document.querySelectorAll('.portal');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const playerLight = document.getElementById('player-light');

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

// 1. 입력 리스너 (괄호 확인 완료)
window.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
});

// 2. 오버레이 닫기 버튼
closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    gameState.isOverlayOpen = false;
    requestAnimationFrame(update);
});

// 3. 메인 게임 루프
function update() {
    if (gameState.isOverlayOpen) return;

    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) gameState.velX += gameState.speed;
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) gameState.velX -= gameState.speed;

    if ((gameState.keys['ArrowUp'] || gameState.keys['KeyW'] || gameState.keys['Space']) && !gameState.isJumping) {
        gameState.velY = gameState.jumpStrength;
        gameState.isJumping = true;
    }

    gameState.velX *= gameState.friction;
    gameState.velY += gameState.gravity;
    gameState.posX += gameState.velX;
    gameState.posY += gameState.velY;

    if (gameState.posY > 0) {
        gameState.posY = 0;
        gameState.velY = 0;
        gameState.isJumping = false;
    }

    if (gameState.posX < 0) gameState.posX = 0;

    player.style.left = gameState.posX + 'px';
    player.style.bottom = (100 - gameState.posY) + 'px';
    
    if (playerLight) {
        playerLight.style.left = gameState.posX + 'px';
        playerLight.style.bottom = '100px'; 
    }

    const viewportWidth = window.innerWidth;
    const scrollTrigger = viewportWidth / 2;
    if (gameState.posX > scrollTrigger) {
        world.style.transform = `translateX(-${gameState.posX - scrollTrigger}px)`;
    }

    checkCollisions();
    requestAnimationFrame(update);
}

// 4. 충돌 감지
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

// 5. 프로젝트 창 열기
function openProject(portal) {
    if (gameState.isOverlayOpen) return;
    gameState.isOverlayOpen = true;
    gameState.velX = 0;
    gameState.keys = {}; 

    document.getElementById('project-title').innerText = portal.getAttribute('data-title');
    document.getElementById('project-desc').innerText = portal.getAttribute('data-desc');
    
    const imgPath = portal.getAttribute('data-img');
    const mediaBox = document.querySelector('.media-placeholder');
    mediaBox.innerHTML = `<img src="${imgPath}" style="max-width:100%; max-height:100%; border-radius:8px;" onerror="this.alt='이미지 준비중'">`;

    overlay.classList.remove('hidden');
}

// 6. 별 생성
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 5000}px`;
        star.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${1 + Math.random() * 3}s`);
        starsContainer.appendChild(star);
    }
}

// 초기 실행
createStars();
update();