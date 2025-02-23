document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('checkoutModal');
    const checkoutButton = document.getElementById('checkoutButton');
    const closeButton = document.querySelector('.close');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Отображение товаров в корзине
    function renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const items = cart.items;
        
        if (items.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            checkoutButton.style.display = 'none';
            return;
        }
        
        cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
                <button class="remove-item">✕</button>
            </div>
        `).join('');
        
        updateTotal();
    }
    
    // Обновление общей суммы
    function updateTotal() {
        const total = cart.items.reduce((sum, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return sum + (price * item.quantity);
        }, 0);
        
        document.getElementById('cartTotal').textContent = 
            new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' })
                .format(total)
                .replace('UAH', '₴');
    }
    
    // Обработчики событий для кнопок количества
    document.getElementById('cartItems').addEventListener('click', function(e) {
        const item = e.target.closest('.cart-item');
        if (!item) return;
        
        const id = item.dataset.id;
        
        if (e.target.classList.contains('increase')) {
            const cartItem = cart.items.find(i => i.id === id);
            cartItem.quantity++;
            cart.saveCart();
            renderCartItems();
        } else if (e.target.classList.contains('decrease')) {
            const cartItem = cart.items.find(i => i.id === id);
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cart.saveCart();
                renderCartItems();
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.removeItem(id);
            renderCartItems();
        }
    });
    
    // Модальное окно
    checkoutButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Обработка формы заказа
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const orderData = {
            id: Date.now(), // Уникальный ID заказа
            date: new Date().toISOString(),
            customer: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address')
            },
            items: cart.items,
            total: document.getElementById('cartTotal').textContent,
            status: 'Новый'
        };
        
        // Сохраняем заказ в историю
        saveOrder(orderData);
        
        // Очистка корзины
        cart.items = [];
        cart.saveCart();
        
        // Закрытие модального окна и обновление страницы
        modal.style.display = 'none';
        renderCartItems();
        
        showNotification('Заказ успешно оформлен!');
        
        // Перенаправление на страницу с деталями заказа
        setTimeout(() => {
            window.location.href = `order.html?id=${orderData.id}`;
        }, 2000);
    });
    
    // Инициализация страницы
    renderCartItems();
});

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
} 