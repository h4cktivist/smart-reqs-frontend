document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-details');
    const additionalFields = document.getElementById('additional-fields');

    toggleButton.addEventListener('click', function() {
        if (additionalFields.classList.contains('hidden')) {
            additionalFields.classList.remove('hidden');
            toggleButton.textContent = 'Скрыть ▲';
        } else {
            additionalFields.classList.add('hidden');
            toggleButton.textContent = 'Подробнее ▼';
        }
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

document.querySelector('.submit-btn').addEventListener('click', async function() {
    const submitBtn = this;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Загрузка...';

    try {
        const formData = {};

        formData.title = document.getElementById('title').value;
        formData.idea_description = document.getElementById('project-description').value;
        formData.functional_reqs = document.getElementById('requirements').value;

        if (!formData.title || !formData.idea_description || !formData.functional_reqs) {
            throw new Error('Заполните обязательные поля: Название проекта, Описание проекта и Функциональные требования');
        }

        const appType = document.querySelector('input[name="app-type"]:checked')?.value;
        if (appType) formData.product_type = appType;

        const storeData = document.querySelector('input[name="store-data"]:checked')?.value;
        if (storeData !== undefined) formData.db_needed = storeData === 'Да';

        const bigData = document.querySelector('input[name="big-data"]:checked')?.value;
        if (bigData !== undefined) formData.big_data_needed = bigData === 'Да';

        const dataStruct = document.querySelector('input[name="data-struct"]:checked')?.value;
        if (dataStruct) formData.data_structure = dataStruct;

        const dataAnalysis = document.querySelector('input[name="data-analysis"]:checked')?.value;
        if (dataAnalysis !== undefined) formData.data_analysis_needed = dataAnalysis === 'Да';

        const ml = document.querySelector('input[name="ml"]:checked')?.value;
        if (ml !== undefined) formData.ml_needed = ml === 'Да';

        const languages = document.getElementById('languages').value;
        if (languages) {
            formData.languages_preferences = languages.split(',').map(item => item.trim());
        }

        const techType = document.querySelector('input[name="tech-type"]:checked')?.value;
        if (techType) formData.licensing_type = techType;

        const scaling = document.querySelector('input[name="scaling"]:checked')?.value;
        if (scaling !== undefined) formData.scaling_needed = scaling === 'Да';

        const testing = document.querySelector('input[name="testing"]:checked')?.value;
        if (testing !== undefined) formData.autotesting_needed = testing === 'Да';

        const token = localStorage.getItem('access_token');

        const response = await fetch('https://smart-reqs-backend-latest.onrender.com/api/recommender', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.status === 400) {
            throw new Error('Ваш запрос не соответствует ИТ-тематике');
        }
        else if (!response.ok) {
            throw new Error('Произошла ошибка сервера. Проверьте правильность запроса');
        }

        sessionStorage.setItem('recommendation_result', JSON.stringify(result));
        window.location.href = 'results.html';

    } catch (error) {
        alert(error.message);
        console.error('Ошибка:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});
