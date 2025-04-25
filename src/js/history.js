document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('access_token');
    const historyContainer = document.getElementById('historyContainer');

    try {
        const response = await fetch('http://localhost:8000/api/recommender/history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка загрузки истории');
        }

        if (data.length === 0) {
            historyContainer.innerHTML = '<div class="empty-history">История запросов пуста</div>';
            return;
        }

        historyContainer.innerHTML = '';

        data.forEach(item => {
            const historyItem = createHistoryItem(item);
            historyContainer.appendChild(historyItem);
        });

        setupDeleteButtons();

    } catch (error) {
        console.error('Ошибка:', error);
        historyContainer.innerHTML = `<div class="error">Ошибка загрузки истории: ${error.message}</div>`;
    }
});

function createHistoryItem(item) {
    const queryBlock = document.createElement('div');
    queryBlock.className = 'query-block';

    const requestContent = `Название: ${item.request.title || 'Не указано'}\n\n` +
        `Описание идеи: ${item.request.idea_description || 'Не указано'}\n\n` +
        `Функциональные требования: ${item.request.functional_reqs || 'Не указано'}\n\n` +
        `Тип продукта: ${item.request.product_type || 'Не указано'}`;

    let resultContent = '';
    if (item.result) {
        resultContent += `Фреймворки: ${item.result.frameworks?.join(', ') || 'Не предложены'}\n\n` +
            `Библиотеки: ${item.result.libraries?.join(', ') || 'Не предложены'}\n\n` +
            `СУБД: ${item.result.databases?.join(', ') || 'Не предложены'}`;
    } else {
        resultContent = 'Подходящих технологий не нашлось';
    }

    // Создание HTML структуры
    queryBlock.innerHTML = `
        <div class="label">Запрос пользователя</div>
        <div class="answer-box"><textarea readonly>${requestContent}</textarea></div>
        <div class="label">Ответ системы</div>
        <div class="answer-box"><textarea readonly>${resultContent}</textarea></div>
        <div class="query-actions">
            <button class="delete-btn" data-request-id="${item.request._id}">Удалить</button>
        </div>
    `;

    return queryBlock;
}

function setupDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const requestId = this.getAttribute('data-request-id');
            const queryBlock = this.closest('.query-block');

            if (!confirm('Вы уверены, что хотите удалить этот запрос из истории?')) {
                return;
            }

            const deleteBtn = this;
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Удаление...';

            try {
                const token = localStorage.getItem('access_token');

                const response = await fetch(`http://localhost:8000/api/recommender/${requestId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при удалении');
                }

                queryBlock.style.transition = 'opacity 0.3s ease';
                queryBlock.style.opacity = '0';
                setTimeout(() => queryBlock.remove(), 300);

            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert(error.message);
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Удалить';
            }
        });
    });
}