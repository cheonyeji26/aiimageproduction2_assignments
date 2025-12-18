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

// 수정 및 보완된 핵심 부분

function update() {
    if (gameState.isOverlayOpen) return;

    // 상하좌우 이동 로직
    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) gameState.velX += gameState.speed;
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) gameState.velX -= gameState.speed;
    if (gameState.keys['ArrowUp'] || gameState.keys['KeyW']) gameState.velY -= gameState.speed;
    if (gameState.keys['ArrowDown'] || gameState.keys['KeyS']) gameState.velY += gameState.speed;

    // 마찰력 및 위치 적용
    gameState.velX *= gameState.friction;
    gameState.velY *= gameState.friction;
    gameState.posX += gameState.velX;
    gameState.posY += gameState.velY;

    // 월드 경계 제한 (캐릭터가 우주 밖으로 나가지 않게)
    gameState.posX = Math.max(0, Math.min(5000, gameState.posX));
    gameState.posY = Math.max(0, Math.min(5000, gameState.posY));

    // 캐릭터 위치 업데이트 (top과 left 사용)
    player.style.left = gameState.posX + 'px';
    player.style.top = gameState.posY + 'px';

    // 🎥 카메라 로직: 캐릭터를 화면 중앙에 고정
    const camX = window.innerWidth / 2 - (gameState.posX + 20); // 20은 캐릭터 너비 절반
    const camY = window.innerHeight / 2 - (gameState.posY + 20); // 20은 캐릭터 높이 절반
    world.style.transform = `translate(${camX}px, ${camY}px)`;

    checkCollisions();
    requestAnimationFrame(update);
}

function checkCollisions() {
    // getBoundingClientRect 대신 월드 내 좌표값(gameState)으로 계산하는 것이 안전합니다.
    const pX = gameState.posX;
    const pY = gameState.posY;
    const pSize = 40;

    portals.forEach(portal => {
        // 포털의 좌표 추출 (HTML에 작성한 style의 left, top 값 기준)
        const portalX = parseFloat(portal.style.left);
        const portalY = parseFloat(portal.style.top);
        const portalSize = 120; // .portal의 width/height

        if (
            pX < portalX + portalSize &&
            pX + pSize > portalX &&
            pY < portalY + portalSize &&
            pY + pSize > portalY
        ) {
            if (gameState.keys['KeyE'] || gameState.keys['Enter']) {
                openProject(portal);
            }
        }
    });
}

// game.js의 openProject 함수를 찾아서 이 내용으로 덮어쓰세요.
function openProject(portal) {
    gameState.isOverlayOpen = true;
    gameState.velX = 0;
    gameState.velY = 0;
    gameState.keys = {}; 

    const title = portal.getAttribute('data-title');
    const desc = portal.getAttribute('data-desc');
    const imgPath = portal.getAttribute('data-img'); // 이미지 경로

    document.getElementById('project-title').innerText = title;
    document.getElementById('project-desc').innerText = desc;
    
    const mediaBox = document.querySelector('.media-placeholder');
    
    // 중요: 이미지가 있을 때만 이미지를 보여주고, 없으면 영역을 숨깁니다.
    if (imgPath && imgPath !== "null") {
        mediaBox.style.display = "flex";
        mediaBox.innerHTML = `<img src="${imgPath}" style="max-width:100%; border-radius:8px;" onerror="this.style.display='none'">`;
    } else {
        mediaBox.style.display = "none"; // 이미지 경로가 없으면 숨김
    }

    overlay.classList.remove('hidden');
}

// update 함수 내부 위치 업데이트 코드 아래에 추가
if (Math.abs(gameState.velX) > 1 || Math.abs(gameState.velY) > 1) {
    createParticle(gameState.posX + 30, gameState.posY + 30);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    world.appendChild(particle);
    
    // 1초 뒤 소멸
    setTimeout(() => particle.remove(), 1000);
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