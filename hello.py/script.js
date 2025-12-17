document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section'); // 모든 섹션

    // 스크롤 시 헤더 그림자 효과
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        // 스크롤 위치에 따라 네비게이션 링크 활성화
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight; // 헤더 높이만큼 조정
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 스무스 스크롤 (선택 사항)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - header.offsetHeight, // 헤더 높이만큼 빼줌
                    behavior: 'smooth'
                });
            }
        });
    });
});