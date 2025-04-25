document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const name = document.querySelector('input[type="text"]').value
    const type = document.querySelector('input[name="db-type"]:checked')?.value;
    const scaling_poss = document.querySelector('input[name="scalable"]:checked')?.value === 'да';
    const big_data_poss = document.querySelector('input[name="big-data"]:checked')?.value === 'да';
    const acid_support = document.querySelector('input[name="acid"]:checked')?.value === 'да';
    const licence_type = document.querySelector('input[name="license"]:checked')?.value;

    const formData = {
        name: name,
        type: type,
        scaling_poss: scaling_poss,
        big_data_poss: big_data_poss,
        acid_support: acid_support,
        licence_type: licence_type
    };

    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch('http://localhost:8000/api/databases', {
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

        alert('СУБД успешно добавлена!');
        window.location.href = 'add_select.html';

    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message);
    }
});