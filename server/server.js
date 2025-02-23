const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Путь к файлу с данными
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Создаем директорию для данных, если её нет
async function ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir);
        await fs.writeFile(PRODUCTS_FILE, '[]');
        await fs.writeFile(ORDERS_FILE, '[]');
    }
}

// API для работы с товарами
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при чтении товаров' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        const newProduct = req.body;
        newProduct.id = Date.now().toString();
        products.push(newProduct);
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении товара' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        const index = products.findIndex(p => p.id === req.params.id);
        if (index !== -1) {
            products[index] = { ...products[index], ...req.body };
            await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
            res.json(products[index]);
        } else {
            res.status(404).json({ error: 'Товар не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении товара' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        const filteredProducts = products.filter(p => p.id !== req.params.id);
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении товара' });
    }
});

// API для работы с заказами
app.get('/api/orders', async (req, res) => {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при чтении заказов' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf8'));
        const newOrder = req.body;
        newOrder.id = Date.now().toString();
        orders.push(newOrder);
        await fs.writeFile(ORDERS_FILE, JSON.stringify(orders));
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании заказа' });
    }
});

// Запуск сервера
ensureDataDir().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
}); 