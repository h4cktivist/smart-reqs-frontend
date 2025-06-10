document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('access_token');
    const historyContainer = document.getElementById('historyContainer');

    try {
        const response = await fetch('https://smart-reqs-backend-latest.onrender.com/api/expert/unanswered', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка загрузки запросов');
        }

        if (data.length === 0) {
            historyContainer.innerHTML = '<div class="empty-history">Нет запросов без ответа!</div>';
            return;
        }

        historyContainer.innerHTML = '';

        data.forEach(item => {
            const historyItem = createHistoryItem(item);
            historyContainer.appendChild(historyItem);
        });

        setupUpdateButtons();

    } catch (error) {
        console.error('Ошибка:', error);
        historyContainer.innerHTML = `<div class="error">Ошибка загрузки: ${error.message}</div>`;
    }
});

function createHistoryItem(item) {
    const queryBlock = document.createElement('div');
    queryBlock.className = 'query-block';

    const requestContent = `Название: ${item.title || 'Не указано'}\n\n` +
        `Описание идеи: ${item.idea_description || 'Не указано'}\n\n` +
        `Функциональные требования: ${item.functional_reqs || 'Не указано'}\n\n` +
        `Тип продукта: ${item.product_type || 'Не указано'}\n\n` +
        `Необходмость БД: ${item.db_needed ? 'Да' : 'Нет'}\n\n` +
        `Стуктура данных: ${item.data_structure || 'Не указано'}\n\n` +
        `Работа с big data: ${item.big_data_needed ? 'Да' : 'Нет'}\n\n` +
        `Анализ данных: ${item.data_analysis_needed ? 'Да' : 'Нет'}\n\n` +
        `Машинное обучение: ${item.ml_needed ? 'Да' : 'Нет'}\n\n` +
        `Необходимость масштабирования: ${item.scaling_needed ? 'Да' : 'Нет'}\n\n` +
        `Автоматическое тестирование: ${item.autotesting_needed ? 'Да' : 'Нет'}\n\n` +
        `Предпочтения по ЯП: ${item.languages_preferences || 'Не указано'}`;

    queryBlock.innerHTML = `
        <div class="label">Запрос пользователя (${item.datetime.replace('T', ' ').substring(0, 16)})</div>
        <div class="answer-box"><textarea readonly>${requestContent}</textarea></div>
        <div class="label">Предложите свои ответы</div>
        <div class="answer-box">
            <input placeholder="Фреймворки" id="frameworks"><br>
            <input placeholder="Библиотеки" id="libraries"><br>
            <input placeholder="СУБД" id="databases"><br>
            <input placeholder="Мин. число разработчиков" id="min_devs" type="number"><br>
            <input placeholder="Макс. число разработчиков" id="max_devs" type="number"><br>
            <button data-request-id="${item._id}" class="update-btn">Обновить</button>
        </div>
    `;

    return queryBlock;
}

function splitStringToArray(str) {
    if (!str || str.trim() === '') return null;
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
}

function setupUpdateButtons() {
    const historyContainer = document.getElementById('historyContainer');
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const requestId = this.getAttribute('data-request-id');
            const queryBlock = this.closest('.query-block');

            const updateBtn = this;
            updateBtn.disabled = true;
            updateBtn.textContent = 'Обновление...';

            const formData = {
                frameworks: splitStringToArray(document.getElementById('frameworks').value),
                libraries: splitStringToArray(document.getElementById('libraries').value),
                databases: splitStringToArray(document.getElementById('databases').value),
                min_devs: document.getElementById('min_devs').value || null,
                max_devs: document.getElementById('max_devs').value || null
            };

            try {
                const token = localStorage.getItem('access_token');

                const response = await fetch(`https://smart-reqs-backend-latest.onrender.com/api/expert/answer/${requestId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при обновлении');
                }

                alert('Успешно!');

                queryBlock.style.transition = 'opacity 0.3s ease';
                queryBlock.style.opacity = '0';
                setTimeout(() => queryBlock.remove(), 300);

                historyContainer.innerHTML = '<div class="empty-history">Нет запросов без ответа!</div>';

            } catch (error) {
                console.error('Ошибка обновления:', error);
                alert(error.message);
                updateBtn.disabled = false;
                updateBtn.textContent = 'Обновить';
            }
        });
    });
}
