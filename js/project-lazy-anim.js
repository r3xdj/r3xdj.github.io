document.addEventListener('DOMContentLoaded', () => {
    // 抓取頁面上所有的進度條元件
    const progressFills = document.querySelectorAll('.project-progress-fill');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,      // 以瀏覽器視窗作為基礎
            rootMargin: '0px',
            threshold: 0.1   // 只要進度條露出 10% 就觸發
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 當目標進入可視範圍
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    // 加上 animate 類別啟動 CSS 動畫
                    fill.classList.add('animate');
                    // 觸發後就解除監聽，避免重複跑動畫
                    observer.unobserve(fill);
                }
            });
        }, observerOptions);

        // 綁定每一個進度條
        progressFills.forEach(fill => animationObserver.observe(fill));
    } else {
        // 備份方案：如果瀏覽器太舊不支援 Observer，直接全部載入動畫
        progressFills.forEach(fill => fill.classList.add('animate'));
    }
});