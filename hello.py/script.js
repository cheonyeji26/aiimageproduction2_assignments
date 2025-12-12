document.addEventListener('DOMContentLoaded', () => {

    // 1. 프롬프트 클릭 시 이미지 공개 (Reveal)
    const promptCards = document.querySelectorAll('.prompt-card');

    promptCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetFrame = document.getElementById(targetId);
            
            if (targetFrame && !targetFrame.classList.contains('revealed')) {
                // 이미지 프레임 보이게 설정
                targetFrame.classList.add('revealed');
                
                // 프롬프트 카드 스타일 변경 및 클릭 방지
                card.style.cursor = 'default';
                card.style.borderColor = '#00ffcc';
                card.querySelector('.reveal-indicator').textContent = "이미지 해금 완료";
            }
        });
    });

    // 2. 스크롤 기반 페이드인 애니메이션 (Intersection Observer)
    const sections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const delay = section.getAttribute('data-delay');
                
                // CSS에 설정된 딜레이를 적용하여 순차적으로 나타나게 함
                section.style.transitionDelay = `${delay}s`;
                section.classList.add('is-visible');
                
                // 한 번 나타난 후에는 관찰 중지
                observer.unobserve(section);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2 // 요소가 20% 보일 때 작동
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});