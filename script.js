document.addEventListener('DOMContentLoaded', () => {
    // 1. Анимация появления секций при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // 2. Плавный скролл до якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Эльфийское свечение при наведении на разделители
    document.querySelectorAll('.elven-divider').forEach(divider => {
        divider.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.6))';
            this.style.transition = 'filter 0.5s ease';
        });
        divider.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });

    // 4. Пульсация даты (эльфийское свечение)
    const dateContainer = document.querySelector('.date-container');
    if (dateContainer) {
        setInterval(() => {
            dateContainer.style.boxShadow = `
                0 0 20px rgba(197, 160, 89, 0.15),
                inset 0 0 20px rgba(197, 160, 89, 0.05),
                0 0 40px rgba(197, 160, 89, 0.1)
            `;
            setTimeout(() => {
                dateContainer.style.boxShadow = `
                    0 0 20px rgba(197, 160, 89, 0.1),
                    inset 0 0 20px rgba(197, 160, 89, 0.05)
                `;
            }, 1500);
        }, 3000);
    }

    // 5. Парящие частицы (золотая пыль) в hero-секции
    const hero = document.querySelector('.hero');
    if (hero) {
        createGoldDust(hero);
    }
});

// Функция создания золотой пыли
function createGoldDust(container) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-dust';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(197, 160, 89, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(197, 160, 89, 0.5);
        `;
        container.appendChild(particle);
    }

    // Добавляем ключевые кадры анимации
    if (!document.getElementById('gold-dust-style')) {
        const style = document.createElement('style');
        style.id = 'gold-dust-style';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 50 - 25}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Ждем полной загрузки страницы для работы с изображениями и каруселью
window.onload = function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Новые элементы: стрелки в лайтбоксе
    const prevLboxBtn = document.getElementById('prevLightbox');
    const nextLboxBtn = document.getElementById('nextLightbox');
    
    let currentImageSet = [];
    let currentImgIndex = 0;

    if (lightbox && lightboxImg) {
        
        // 6. ЛОГИКА ЛАЙТБОКСА (Увеличение + Листание внутри)
        document.addEventListener('click', function(e) {
            const clickedImg = e.target;
            
            const isClickable = clickedImg.tagName === 'IMG' && 
                (clickedImg.classList.contains('lightbox-enabled') || 
                 clickedImg.closest('.polaroid') || 
                 clickedImg.closest('.venue-image-container') || 
                 clickedImg.closest('.inspiration-image') || 
                 clickedImg.closest('.footer-photo'));

            if (isClickable) {
                const parentTrack = clickedImg.closest('.carousel-track');
                
                if (parentTrack) {
                    currentImageSet = Array.from(parentTrack.querySelectorAll('img'));
                    currentImgIndex = currentImageSet.indexOf(clickedImg);
                } else {
                    currentImageSet = [clickedImg];
                    currentImgIndex = 0;
                }

                openLightbox(clickedImg.src);
            }
        });

        const openLightbox = (src) => {
            lightbox.style.display = 'flex';
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden'; 
            
            // Показываем или скрываем стрелки в зависимости от кол-ва фото
            const showButtons = currentImageSet.length > 1 ? 'flex' : 'none';
            if (prevLboxBtn) prevLboxBtn.style.display = showButtons;
            if (nextLboxBtn) nextLboxBtn.style.display = showButtons;
            
            // Эльфийское появление изображения
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.8)';
            lightboxImg.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }, 50);
        };

        const closeWindow = () => {
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
                currentImageSet = [];
            }, 300);
        };

        const navigateLightbox = (direction) => {
            if (currentImageSet.length <= 1) return;
            
            // Эльфийский переход между фото
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                currentImgIndex = (currentImgIndex + direction + currentImageSet.length) % currentImageSet.length;
                lightboxImg.src = currentImageSet[currentImgIndex].src;
                
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }, 300);
        };

        // Обработка кликов по стрелкам в лайтбоксе
        if (prevLboxBtn) {
            prevLboxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }

        if (nextLboxBtn) {
            nextLboxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }

        lightbox.addEventListener('click', function(e) {
            // Листаем вперед при клике на само фото
            if (e.target === lightboxImg && currentImageSet.length > 1) {
                navigateLightbox(1);
            } 
            // Закрываем, если кликнули мимо фото и кнопок
            else if (e.target !== lightboxImg && e.target !== prevLboxBtn && e.target !== nextLboxBtn) {
                closeWindow();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === "Escape") closeWindow();
                if (e.key === "ArrowRight") navigateLightbox(1);
                if (e.key === "ArrowLeft") navigateLightbox(-1);
            }
        });
    }

    // 7. ЛОГИКА КАРУСЕЛИ (На странице)
    const track = document.querySelector('.carousel-track');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (track && nextBtn && prevBtn) {
        const slides = Array.from(track.children);
        let currentIndex = 0;

        const updateSlide = (index) => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            track.style.transform = `translateX(-${index * slideWidth}px)`;
        };

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlide(currentIndex);
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlide(currentIndex);
        });

        window.addEventListener('resize', () => {
            updateSlide(currentIndex);
        });

        // Автопрокрутка карусели с эльфийской паузой
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlide(currentIndex);
            }, 5000);
        };
        
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        const carouselContainer = document.querySelector('.dress-code-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoScroll);
            carouselContainer.addEventListener('mouseleave', startAutoScroll);
            startAutoScroll();
        }
    }

    // 8. Эльфийский эффект печати текста для цитаты
    const elvenQuote = document.querySelector('.elven-quote');
    if (elvenQuote) {
        const text = elvenQuote.textContent;
        elvenQuote.textContent = '';
        elvenQuote.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                elvenQuote.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        };
        
        // Запускаем печать через 1 секунду после загрузки
        setTimeout(typeWriter, 1000);
    }

    // 9. Параллакс-эффект для поляроидов
    document.addEventListener('mousemove', (e) => {
        const polaroids = document.querySelectorAll('.polaroid');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        polaroids.forEach((polaroid, index) => {
            const speed = (index + 1) * 5;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            polaroid.style.transform = `
                rotate(${index === 0 ? -3 : 5}deg) 
                translateX(${x}px) 
                translateY(${y}px)
            `;
        });
    });

    // 10. Звездное небо в футере (генерация звёзд)
    const footer = document.querySelector('.footer');
    if (footer) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 2 + 1}px;
                height: ${Math.random() * 2 + 1}px;
                background: rgba(197, 160, 89, ${Math.random() * 0.8 + 0.2});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                pointer-events: none;
            `;
            footer.appendChild(star);
        }

        if (!document.getElementById('star-style')) {
            const style = document.createElement('style');
            style.id = 'star-style';
            style.textContent = `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px rgba(197, 160, 89, 0.8); }
                }
            `;
            document.head.appendChild(style);
        }
    }
};
function openEnvCard() {
    const music = document.getElementById('envMusic');
    const card = document.querySelector('.env-card');
    
    // Включаем музыку
    if (music) {
        music.volume = 0.2;
        music.play().catch(e => console.log('Музыка не запустилась'));
    }
    
    // Анимация конверта
    card.style.transform = 'scale(0.95)';
    
    // Скролл к основному контенту
    setTimeout(() => {
        document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    }, 400);
}
