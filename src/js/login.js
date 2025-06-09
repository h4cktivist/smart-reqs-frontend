document.querySelector('.login-btn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.querySelector('.error-message');

    if (!email || !password) {
        errorElement.textContent = 'Пожалуйста, заполните все поля';
        return;
    }

    try {
        const response = await fetch('https://smart-reqs-backend-latest.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.status === 401) {
            throw new Error('Неверный email или пароль');
        }

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_expires', Date.now() + data.expires_in * 60000);
        fetch('https://smart-reqs-backend-latest.onrender.com/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.access_token}`
            }
        })
            .then(res => res.json())
            .then(user_data => {
                localStorage.setItem('is_expert', user_data.is_expert);
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });

    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Login error:', error);
    }
});
