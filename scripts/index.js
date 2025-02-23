document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.querySelector('.products-grid');
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Отображаем только 4 товара на главной странице
    const featuredProducts = products.slice(0, 4);

    productsGrid.innerHTML = featuredProducts.map(product => `
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
}); 