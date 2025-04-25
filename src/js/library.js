document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const name = document.querySelector('input[type="text"]').value;
    const language = document.querySelectorAll('input[type="text"]')[1].value;
    const purpose = document.querySelector('input[name="library-type"]:checked')?.value;
    const licence_type = document.querySelector('input[name="license"]:checked')?.value;

    const formData = {
        name: name,
        language: language,
        purpose: purpose,
        licence_type: licence_type
    };

    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch('http://localhost:8000/api/libraries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Ошибка при добавлении');
        }

        alert('Библиотека успешно добавлена!');
        window.location.href = 'add_select.html';

    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message);
    }
});
