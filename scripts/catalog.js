document.addEventListener('DOMContentLoaded', async function() {
    const productsGrid = document.querySelector('.products-grid');
    const apiUrl = 'http://localhost:3000/api';
    let products = []; // Добавим глобальную переменную products

    // Загрузка товаров с сервера
    async function loadProducts() {
        try {
            const response = await fetch(`${apiUrl}/products`);
            if (!response.ok) throw new Error('Ошибка сервера');
            products = await response.json(); // Сохраняем товары в переменную
            renderProducts(products);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            productsGrid.innerHTML = `
                <div class="error-message">
                    <p>Ошибка при загрузке товаров. Пожалуйста, проверьте:</p>
                    <ul>
                        <li>Запущен ли сервер (npm start в папке server)</li>
                        <li>Доступен ли адрес ${apiUrl}</li>
                    </ul>
                    <button onclick="window.location.reload()">Попробовать снова</button>
                </div>
            `;
        }
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
    await loadProducts();
}); 