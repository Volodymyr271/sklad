document.addEventListener('DOMContentLoaded', function() {
    const ordersList = document.getElementById('ordersList');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    if (orders.length === 0) {
        ordersList.innerHTML = '<p>История заказов пуста</p>';
        return;
    }

    ordersList.innerHTML = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-number">Заказ #${order.id}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Получатель:</strong> ${order.customer.name}</p>
                    <p><strong>Адрес:</strong> ${order.customer.address}</p>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-row">
                                <span>${item.name}</span>
                                <span>${item.quantity} шт.</span>
                                <span>${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        Итого: ${order.total}
                    </div>
                </div>
            </div>
        `).join('');
}); 