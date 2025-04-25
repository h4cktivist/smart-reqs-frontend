document.querySelector('.next-button').addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="tech-option"]:checked');

    if (!selectedOption) {
        alert('Пожалуйста, выберите один из вариантов');
        return;
    }

    switch(selectedOption.id) {
        case 'framework':
            window.location.href = 'framework.html';
            break;
        case 'library':
            window.location.href = 'library.html';
            break;
        case 'database':
            window.location.href = 'database.html';
            break;
        default:
            alert('Неизвестный вариант');
    }
});
