document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('access_token');
    const tokenExpires = localStorage.getItem('token_expires');

    if (!token || Date.now() > tokenExpires) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expires');
        window.location.href = 'login.html';
    }
});
