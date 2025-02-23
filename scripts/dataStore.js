class DataStore {
    static async getProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            // Сохраняем в localStorage для работы корзины
            localStorage.setItem('products', JSON.stringify(data.products));
            return data.products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            // Пробуем взять из localStorage если есть
            const cached = localStorage.getItem('products');
            if (cached) {
                return JSON.parse(cached);
            }
            // Иначе возвращаем демо-данные
            return [
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
        }
    }

    static async saveProducts(products) {
        // Сохраняем в localStorage для мгновенного обновления
        localStorage.setItem('products', JSON.stringify(products));
        
        // Создаем файл для скачивания
        const data = {
            products: products,
            lastUpdated: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Скачиваем файл
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.json';
        a.click();
        
        URL.revokeObjectURL(url);
        
        // Показываем инструкции
        showNotification(`
            1. Файл products.json скачан
            2. Замените им файл в папке data/ вашего репозитория
            3. Сделайте commit и push
            4. Дождитесь обновления GitHub Pages (1-2 минуты)
        `);
        
        // Обновляем UI
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
} 