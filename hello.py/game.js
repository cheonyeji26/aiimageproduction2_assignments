// game.js 전체를 이 로직으로 교체하세요
const player = document.getElementById('player');
const world = document.getElementById('world');
const portals = document.querySelectorAll('.portal');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');

let gameState = {
    posX: 2500, // 월드 중앙에서 시작 (전체 5000px)
    posY: 2500, // 월드 중앙에서 시작 (전체 5000px)
    velX: 0,
    velY: 0,
    speed: 0.8,
    friction: 0.9,
    keys: {},
    isOverlayOpen: false
};

window.addEventListener('keydown', (e) => gameState.keys[e.code] = true);
window.addEventListener('keyup', (e) => gameState.keys[e.code] = false);

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    gameState.isOverlayOpen = false;
    requestAnimationFrame(update);
});

function update() {
    if (gameState.isOverlayOpen) return;

    // 상하좌우 이동 로직
    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) gameState.velX += gameState.speed;
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) gameState.velX -= gameState.speed;
    if (gameState.keys['ArrowUp'] || gameState.keys['KeyW']) gameState.velY -= gameState.speed;
    if (gameState.keys['ArrowDown'] || gameState.keys['KeyS']) gameState.velY += gameState.speed;

    // 마찰력 적용 (부드럽게 멈춤)
    gameState.velX *= gameState.friction;
    gameState.velY *= gameState.friction;

    gameState.posX += gameState.velX;
    gameState.posY += gameState.velY;

    // 캐릭터 위치 업데이트
    player.style.left = gameState.posX + 'px';
    player.style.top = gameState.posY + 'px';

    // 🎥 카메라 로직: 캐릭터가 항상 화면 중앙에 오도록 배경을 움직임
    const camX = window.innerWidth / 2 - gameState.posX;
    const camY = window.innerHeight / 2 - gameState.posY;
    world.style.transform = `translate(${camX}px, ${camY}px)`;

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
            // E 키를 누르면 열리도록 설정
            if (gameState.keys['KeyE'] || gameState.keys['Enter']) {
                openProject(portal);
            }
        }
    });
}

function openProject(portal) {
    gameState.isOverlayOpen = true;
    document.getElementById('project-title').innerText = portal.getAttribute('data-title');
    document.getElementById('project-desc').innerText = portal.getAttribute('data-desc');
    overlay.classList.remove('hidden');
}

// 별들을 월드 전체(5000x5000)에 뿌리기
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 400; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 5000}px`;
        star.style.top = `${Math.random() * 5000}px`;
        const size = Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        starsContainer.appendChild(star);
    }
}

createStars();
update();