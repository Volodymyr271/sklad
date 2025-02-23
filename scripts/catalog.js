document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.querySelector('.products-grid');
    const products = JSON.parse(localStorage.getItem('products')) || [];

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
    renderProducts();
}); 