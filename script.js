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
});
// Ждем полной загрузки страницы
window.onload = function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // Если элементов нет в HTML, выходим, чтобы не было ошибок
    if (!lightbox || !lightboxImg) return;

    // Слушаем клики по всей странице
    document.addEventListener('click', function(e) {
        // Проверяем, нажали ли мы на картинку внутри нужных нам блоков
        // (поляроиды, фото зала, инспирейшн и футер)
        if (e.target.tagName === 'IMG' && 
           (e.target.closest('.polaroid') || 
            e.target.closest('.venue-image-container') || 
            e.target.closest('.inspiration-image') || 
            e.target.closest('.footer-photo'))) {
            
            lightbox.style.display = 'flex';
            lightboxImg.src = e.target.src;
            document.body.style.overflow = 'hidden'; // Запрещаем прокрутку сайта под фото
        }
    });

    // Функция закрытия
    function closeWindow() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Возвращаем прокрутку
    }

    // Закрываем при клике на крестик или на темный фон
    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg) {
            closeWindow();
        }
    });

    // Закрываем при нажатии на клавишу Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            closeWindow();
        }
    });
};
