document.addEventListener('DOMContentLoaded', async function() {
    const productsGrid = document.querySelector('.products-grid');
    let products = JSON.parse(localStorage.getItem('products')) || [
        {
            id: "1",
            name: "Смартфон XYZ",
            category: "electronics",
            price: "29999",
            quantity: 10,
            description: "Современный смартфон с отличной камерой",
            image: "images/product1.jpg"
        },
        {
            id: "2",
            name: "Ноутбук ABC",
            category: "electronics",
            price: "49999",
            quantity: 5,
            description: "Мощный ноутбук для работы и игр",
            image: "images/product2.jpg"
        }
    ];

    // Сохраняем начальные товары, если хранилище пустое
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Отображение товаров
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