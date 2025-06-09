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

    fetch('https://smart-reqs-backend-latest.onrender.com/api/auth/me', {
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

    input.disabled = false;
    saveBtn.classList.remove('hidden');

    input.focus();

    if (field === 'password') {
        let editIcon = document.getElementById('password-edit');
        editIcon.style.display = 'none';
        let oldPasswordEye = document.getElementById('old-password-eye');
        oldPasswordEye.style.display = 'block';
        document.getElementById('newPasswordField').classList.remove('hidden');
        document.getElementById('newPasswordRepeatField').classList.remove('hidden');
        document.getElementById('password').value = '';
        document.getElementById('password').placeholder = 'Текущий пароль';

        document.getElementById('old-password-eye').addEventListener('click', function() {
            if (document.getElementById('password').type === 'password')
                document.getElementById('password').type = 'text';
            else
                document.getElementById('password').type = 'password';
        });

        document.getElementById('password-eye').addEventListener('click', function() {
            if (document.getElementById('newPassword').type === 'password')
                document.getElementById('newPassword').type = 'text';
            else
                document.getElementById('newPassword').type = 'password';
        });

        document.getElementById('password-repeat-eye').addEventListener('click', function() {
            if (document.getElementById('newPasswordRepeat').type === 'password')
                document.getElementById('newPasswordRepeat').type = 'text';
            else
                document.getElementById('newPasswordRepeat').type = 'password';
        });
    }
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        formData.current_password = document.getElementById('password').value;
        formData.new_password = document.getElementById('newPassword').value;
        let repeatedPassword = document.getElementById('newPasswordRepeat').value;
        if (!passwordRegex.test(formData.new_password)) {
            alert('Пароль должен содержать не менее 8 символов, включая хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.');
            return;
        }
        if (formData.new_password !== repeatedPassword) {
            alert('Новые пароли не совпадают!')
            return;
        }
    }

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            if (!formData[key] || formData[key].trim() === '') {
                alert('Поля не должны быть пустыми!');
                return;
            }
        }
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранение...';

    fetch('https://smart-reqs-backend-latest.onrender.com/api/auth/me', {
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

document.querySelector('.index-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});
