document.addEventListener('DOMContentLoaded', function() {
    const is_expert = localStorage.getItem('is_expert');

    if (is_expert === 'false') {
        showAccessDenied();
    }

    function showAccessDenied() {
        if (document.referrer && document.referrer.includes(window.location.origin)) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }
});
