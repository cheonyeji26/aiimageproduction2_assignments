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

    // 1. 이동 로직
    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) gameState.velX += gameState.speed;
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) gameState.velX -= gameState.speed;
    if (gameState.keys['ArrowUp'] || gameState.keys['KeyW']) gameState.velY -= gameState.speed;
    if (gameState.keys['ArrowDown'] || gameState.keys['KeyS']) gameState.velY += gameState.speed;

    // 2. 마찰력 및 위치 적용
    gameState.velX *= gameState.friction;
    gameState.velY *= gameState.friction;
    gameState.posX += gameState.velX;
    gameState.posY += gameState.velY;

    // 3. 경계 제한
    gameState.posX = Math.max(0, Math.min(5000, gameState.posX));
    gameState.posY = Math.max(0, Math.min(5000, gameState.posY));

    // 4. ★ 잔상 효과 생성 (이 위치로 옮겨야 합니다!) ★
    // 속도가 어느 정도 있을 때만 잔상을 만듭니다.
    if (Math.abs(gameState.velX) > 0.5 || Math.abs(gameState.velY) > 0.5) {
        createParticle(gameState.posX + 30, gameState.posY + 30);
    }

    // 5. 캐릭터 및 카메라 업데이트
    player.style.left = gameState.posX + 'px';
    player.style.top = gameState.posY + 'px';

    const camX = window.innerWidth / 2 - (gameState.posX + 30);
    const camY = window.innerHeight / 2 - (gameState.posY + 30);
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
    // 별들에 사용할 색상 팔레트 (우주 느낌의 색상들)
    const colors = ['#ffffff', '#fff4f4', '#f0f8ff', '#fffacd', '#e0ffff', '#ffebfb'];

    for (let i = 0; i < 400; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 1. 위치 설정
        star.style.left = `${Math.random() * 5000}px`;
        star.style.top = `${Math.random() * 5000}px`;
        
        // 2. 크기 설정
        const size = Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // 3. ★ 별 색깔 무작위 설정 ★
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.background = randomColor;
        // 별에서 빛이 나는 느낌을 주려면 그림자도 살짝 추가
        star.style.boxShadow = `0 0 ${size * 2}px ${randomColor}`;
        
        // 4. 깜빡이는 속도 랜덤 설정
        star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        
        starsContainer.appendChild(star);
    }
}

createStars();
update();