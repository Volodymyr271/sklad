class ProductManager {
    constructor() {
        this.loadProducts();
        this.initEventListeners();
    }

    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.renderProducts();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            this.products = [];
        }
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

    saveProduct() {
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
            // Обновление существующего товара
            const index = this.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...product };
            }
        } else {
            // Добавление нового товара
            this.products.push(product);
        }

        this.saveToLocalStorage();
        this.renderProducts();
        this.hideModal();
        this.currentImage = null;

        // Создаем файл для скачивания с обновленными данными
        const dataStr = JSON.stringify({ products: this.products }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.json';
        a.click();
        
        URL.revokeObjectURL(url);
        
        showNotification('Товар сохранен. Скачайте и обновите файл products.json в репозитории');
    }

    deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveToLocalStorage();
            this.renderProducts();
            showNotification('Товар успешно удален');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
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