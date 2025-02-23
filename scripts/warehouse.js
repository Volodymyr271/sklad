document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.warehouse-search button');
    const tableBody = document.querySelector('.warehouse-table tbody');
    
    // Загрузка товаров из localStorage
    function loadWarehouseData() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        tableBody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td class="${product.quantity > 0 ? 'status-in-stock' : 'status-out-of-stock'}">
                    ${product.quantity > 0 ? 'В наличии' : 'Нет в наличии'}
                </td>
            </tr>
        `).join('');
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const productCode = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productCode.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });

    // Загружаем данные при загрузке страницы
    loadWarehouseData();
}); 