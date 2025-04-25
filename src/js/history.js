document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access_token');
    const historyContainer = document.getElementById('historyContainer');

    fetch('http://localhost:8000/api/recommender/history', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки истории');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                historyContainer.innerHTML = '<div class="empty-history">История запросов пуста</div>';
                return;
            }

            data.forEach(item => {
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

                queryBlock.innerHTML = `
                <div class="label">Запрос пользователя</div>
                <div class="answer-box"><textarea readonly>${requestContent}</textarea></div>
                <div class="label">Ответ системы</div>
                <div class="answer-box"><textarea readonly>${resultContent}</textarea></div>
            `;

                historyContainer.appendChild(queryBlock);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            historyContainer.innerHTML = `<div class="error">Ошибка загрузки истории: ${error.message}</div>`;
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
});
