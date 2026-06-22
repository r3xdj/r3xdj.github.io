document.addEventListener('DOMContentLoaded', () => {
    // 判斷元素是否真的可見（viewport 內 + 不在 closed details 裡）
    function isElementVisible(el) {
        // 往上找祖先，只要有任何一個 <details> 是收起的就跳過
        let parent = el.parentElement;
        while (parent) {
            if (parent.tagName === 'DETAILS' && !parent.open) {
                return false;
            }
            parent = parent.parentElement;
        }

        const rect = el.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }

    // 掃描所有進度條，符合條件就加上 animate
    function checkAndAnimateProgressBars() {
        document.querySelectorAll('.project-progress-fill').forEach(fill => {
            if (!fill.classList.contains('animate') && isElementVisible(fill)) {
                fill.classList.add('animate');
            }
        });
    }

    // 初始掃描
    checkAndAnimateProgressBars();

    // scroll：用 requestAnimationFrame，比 debounce 快得多（約 16ms），也不會過度執行
    let rafPending = false;
    window.addEventListener('scroll', () => {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
                checkAndAnimateProgressBars();
                rafPending = false;
            });
        }
    }, { passive: true });

    // resize：用較短的 debounce 即可（不需要 rAF，resize 不用那麼即時）
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkAndAnimateProgressBars, 150);
    });

    // details 展開時：等 layout 完成後才掃描，避免偷跑
    document.querySelectorAll('details').forEach(detailsEl => {
        detailsEl.addEventListener('toggle', () => {
            if (detailsEl.open) {
                setTimeout(checkAndAnimateProgressBars, 50);
            }
        });
    });
});