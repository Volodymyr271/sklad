class ProductManager {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.initEventListeners();
        this.loadProducts();
    }

    initEventListeners() {
        // Кнопка добавления товара
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Закрытие модального окна
        document.querySelector('.close').addEventListener('click', () => {
            this.hideModal();
        });

        // Обработка формы
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Обработка загрузки изображения
        document.getElementById('productImage').addEventListener('change', this.handleImageUpload.bind(this));
    }

    showModal(product = null) {
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('productForm');

        modalTitle.textContent = product ? 'Редактировать товар' : 'Добавить товар';

        if (product) {
            form.elements.productId.value = product.id;
            form.elements.name.value = product.name;
            form.elements.category.value = product.category;
            form.elements.price.value = product.price;
            form.elements.quantity.value = product.quantity;
            form.elements.description.value = product.description;
        } else {
            form.reset();
            form.elements.productId.value = '';
        }

        modal.style.display = 'block';
    }

    hideModal() {
        document.getElementById('productModal').style.display = 'none';
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async loadProducts() {
        try {
            const response = await fetch(`${this.apiUrl}/products`);
            this.products = await response.json();
            this.renderProducts();
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            alert('Ошибка при загрузке товаров');
        }
    }

    async saveProduct() {
        const form = document.getElementById('productForm');
        const productId = form.elements.productId.value;
        
        const product = {
            name: form.elements.name.value,
            category: form.elements.category.value,
            price: parseFloat(form.elements.price.value),
            quantity: parseInt(form.elements.quantity.value),
            description: form.elements.description.value,
            image: this.currentImage || 'images/placeholder.jpg'
        };

        try {
            let response;
            if (productId) {
                response = await fetch(`${this.apiUrl}/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                });
            } else {
                response = await fetch(`${this.apiUrl}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                });
            }

            if (!response.ok) throw new Error('Ошибка при сохранении товара');

            await this.loadProducts();
            this.hideModal();
            this.currentImage = null;
        } catch (error) {
            console.error('Ошибка при сохранении товара:', error);
            alert('Ошибка при сохранении товара');
        }
    }

    async deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                const response = await fetch(`${this.apiUrl}/products/${productId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Ошибка при удалении товара');

                await this.loadProducts();
            } catch (error) {
                console.error('Ошибка при удалении товара:', error);
                alert('Ошибка при удалении товара');
            }
        }
    }

    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price} ₴</td>
                <td>${product.quantity}</td>
                <td class="action-buttons">
                    <button class="edit-button" onclick="productManager.showModal(${JSON.stringify(product)})">✎</button>
                    <button class="delete-button" onclick="productManager.deleteProduct('${product.id}')">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

// Инициализация менеджера товаров
const productManager = new ProductManager(); 