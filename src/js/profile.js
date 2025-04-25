document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();

    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            enableEditing(field);
        });
    });

    document.getElementById('profileForm').addEventListener('submit', saveProfile);
});

function loadProfileData() {
    const token = localStorage.getItem('access_token');

    fetch('http://localhost:8000/api/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
        })
        .catch(error => {
            console.error('Ошибка загрузки профиля:', error);
        });

    const is_expert = localStorage.getItem('is_expert');
    const icons = document.getElementById('top-icons');
    if (is_expert === 'true') {
        const link = document.createElement('a');
        link.href = 'add_select.html';
        const img = document.createElement('img');
        img.src = 'assets/icons/icons8-expert-100.png';
        link.appendChild(img);
        icons.appendChild(link);
    }
}

function enableEditing(field) {
    const input = document.getElementById(field);
    const saveBtn = document.getElementById('saveBtn');

    if (field === 'password') {
        document.getElementById('newPasswordField').classList.remove('hidden');
        document.getElementById('password').value = '';
        document.getElementById('password').placeholder = 'Текущий пароль';
    }

    input.disabled = false;
    saveBtn.classList.remove('hidden');

    input.focus();
}

function saveProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    const formData = {};
    const saveBtn = document.getElementById('saveBtn');

    if (!document.getElementById('username').disabled) {
        formData.username = document.getElementById('username').value;
    }

    if (!document.getElementById('email').disabled) {
        formData.email = document.getElementById('email').value;
    }

    if (!document.getElementById('password').disabled) {
        formData.current_password = document.getElementById('password').value;
        formData.new_password = document.getElementById('newPassword').value;
    }

    console.log(formData);

    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранение...';

    fetch('http://localhost:8000/api/auth/me', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сохранения');
            }
            return response.json();
        })
        .then(() => {
            if (formData.email) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expires');
                window.location.href = 'login.html';
            }
            window.location.reload();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении: ' + error.message);
        })
        .finally(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Сохранить';
        });
}

document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('is_expert');
    window.location.href = 'login.html';
});
