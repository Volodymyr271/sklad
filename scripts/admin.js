class ProductManager {
    async init() {
        this.products = await DataStore.getProducts();
        this.initEventListeners();
        this.renderProducts();
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

    async saveProduct() {
        const form = document.getElementById('productForm');
        const productId = form.elements.productId.value;
        
        const product = {
            id: productId || Date.now().toString(),
            name: form.elements.name.value,
            category: form.elements.category.value,
            price: form.elements.price.value,
            quantity: parseInt(form.elements.quantity.value),
            description: form.elements.description.value,
            image: this.currentImage || 'images/placeholder.jpg'
        };

        if (productId) {
            const index = this.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...product };
            }
        } else {
            this.products.push(product);
        }

        await DataStore.saveProducts(this.products);
        this.renderProducts();
        this.hideModal();
        this.currentImage = null;
        showNotification('Товар успешно сохранен');
    }

    deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            this.products = this.products.filter(p => p.id !== productId);
            DataStore.saveProducts(this.products);
            this.renderProducts();
            showNotification('Товар успешно удален');
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

// Инициализация менеджера товаров
const productManager = new ProductManager(); 