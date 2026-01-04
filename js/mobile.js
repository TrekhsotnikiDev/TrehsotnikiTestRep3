// js/mobile.js - Логика мобильного меню
document.addEventListener("DOMContentLoaded", function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const title = item.querySelector('span');
        if (title) {
            title.addEventListener('click', function(e) {
                // Срабатываем только на ширине мобилки
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    
                    // Если нажали на уже открытое - закрываем
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                    } else {
                        // Иначе закрываем все остальные и открываем текущее
                        navItems.forEach(other => other.classList.remove('active'));
                        item.classList.add('active');
                    }
                }
            });
        }
    });
});