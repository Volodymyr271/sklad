class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
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

    saveProduct() {
        const form = document.getElementById('productForm');
        const productId = form.elements.productId.value;
        
        const product = {
            id: productId || Date.now().toString(),
            name: form.elements.name.value,
            category: form.elements.category.value,
            price: parseFloat(form.elements.price.value),
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
    }

    deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveToLocalStorage();
            this.renderProducts();
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

// Инициализация менеджера товаров
const productManager = new ProductManager(); 