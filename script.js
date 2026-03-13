const backToStartBtn = document.getElementById('backToStart');

function updateBackToTopVisibility() {
    if (!backToStartBtn) return;
    backToStartBtn.classList.toggle('show', window.scrollY > 280);
}

if (backToStartBtn) {
    window.addEventListener('scroll', updateBackToTopVisibility);
    backToStartBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateBackToTopVisibility();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

function updateActiveNavLink() {
    let current = 'home';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }
    });

    document.querySelectorAll('nav a').forEach((link) => {
        const sectionId = (link.getAttribute('href') || '').replace('#', '');
        link.classList.toggle('active', sectionId === current);
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();

document.querySelectorAll('.project-card').forEach((projectCard) => {
    const container = projectCard.querySelector('.video-container');
    const video = container ? container.querySelector('video') : null;
    const watchBtn = projectCard.querySelector('.watch-btn');
    const playIconBtn = container ? container.querySelector('.play-icon-btn') : null;
    const playBtn = container ? container.querySelector('.play-btn') : null;
    const fullscreenBtn = container ? container.querySelector('.fullscreen-btn') : null;

    if (!container || !video) return;

    function togglePlay() {
        if (video.paused) video.play();
        else video.pause();
    }

    function syncUi() {
        const paused = video.paused;
        if (playBtn) {
            playBtn.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
            playBtn.setAttribute('title', paused ? 'Play' : 'Pause');
        }
        if (watchBtn) {
            watchBtn.textContent = paused ? 'Watch Video' : 'Pause Video';
        }
    }

    if (watchBtn) {
        watchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            togglePlay();
        });
    }

    [playIconBtn, playBtn, video].forEach((el) => {
        if (!el) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
        });
    });

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isFs = container.classList.toggle('fs-mode');
            fullscreenBtn.innerHTML = isFs
                ? '<i class="fas fa-compress"></i>'
                : '<i class="fas fa-expand"></i>';
            fullscreenBtn.setAttribute('title', isFs ? 'Exit Fullscreen' : 'Fullscreen');
            document.body.style.overflow = isFs ? 'hidden' : '';
        });
    }

    video.addEventListener('play', syncUi);
    video.addEventListener('pause', syncUi);
    video.addEventListener('ended', syncUi);
    syncUi();
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    document.querySelectorAll('.video-container.fs-mode').forEach((container) => {
        container.classList.remove('fs-mode');
        const fullscreenBtn = container.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.setAttribute('title', 'Fullscreen');
        }
    });
    document.body.style.overflow = '';
});




function initRevealAnimation() {
    const revealTargets = document.querySelectorAll('.hero, .about, .cta-strip, .projects .section-title, .project-card, .contact, .footer-content');

    revealTargets.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
    });

    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach((el) => el.classList.add('show'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach((el) => observer.observe(el));
}

initRevealAnimation();
