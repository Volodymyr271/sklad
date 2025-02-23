document.querySelector('.contact-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Здесь можно добавить реальную отправку формы
    showNotification('Сообщение отправлено');
    this.reset();
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 