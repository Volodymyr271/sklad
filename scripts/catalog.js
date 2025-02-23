document.addEventListener('DOMContentLoaded', async function() {
    const productsGrid = document.querySelector('.products-grid');
    let products = await DataStore.getProducts();

    function renderProducts(filteredProducts = products) {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} ₴</p>
                <p class="description">${product.description}</p>
                <button class="add-to-cart" ${product.quantity === 0 ? 'disabled' : ''}>
                    ${product.quantity === 0 ? 'Нет в наличии' : 'В корзину'}
                </button>
            </div>
        `).join('');

        // Добавляем обработчики для кнопок
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.product-card');
                const product = {
                    id: card.dataset.id,
                    name: card.querySelector('h3').textContent,
                    price: card.querySelector('.price').textContent,
                    image: card.querySelector('img').src
                };
                cart.addItem(product);
                showNotification('Товар добавлен в корзину');
            });
        });
    }

    // Слушаем обновления данных
    window.addEventListener('productsUpdated', function() {
        products = DataStore.getProducts();
        renderProducts();
    });

    // Фильтрация товаров
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchProducts');

    function filterProducts() {
        const selectedCategory = categoryFilter.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product => {
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            const matchesSearch = !searchTerm || 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        renderProducts(filteredProducts);
    }

    categoryFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    // Инициализация страницы
    renderProducts();
});

// Функция для отображения уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 