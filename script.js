let editIndex = -1;

let products = JSON.parse(localStorage.getItem('products')) || [];

function renderProducts(productList = products) {
    productTable.innerHTML = ''; 
    if (productList.length === 0) {
        productTable.innerHTML = '<tr><td colspan="4">Nenhum produto encontrado.</td></tr>';
    } else {
        productList.forEach((product, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.name}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${new Date(product.expiryDate).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="edit" onclick="editProduct(${index})">Editar</button>
                    <button class="delete" onclick="deleteProduct(${index})">Excluir</button>
                </td>
            `;
            productTable.appendChild(row);
        });
    }
}

productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const expiryDate = document.getElementById('expiryDate').value; 

    if (editIndex === -1) {
        products.push({ name, price, stock, expiryDate }); 
    } else {
        products[editIndex] = { name, price, stock, expiryDate }; 
        editIndex = -1; 
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    productForm.reset();
    renderProducts();
    checkExpiryAlerts(); 
});

function deleteProduct(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products.splice(index, 1); 
        localStorage.setItem('products', JSON.stringify(products)); 
        renderProducts(); 
    }
}

function editProduct(index) {
    const product = products[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('expiryDate').value = product.expiryDate;

    editIndex = index;
}

document.getElementById('searchBar').addEventListener('input', function() {
    const query = this.value.toLowerCase(); 
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    
    renderProducts(filteredProducts);
});

showProductsButton.addEventListener('click', function() {
    console.log("Botão de mostrar produtos clicado."); 
    const productListDiv = document.getElementById('productList');
    if (products.length === 0) {
        productListDiv.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    } else {
        let productHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Validade</th>
                    </tr>
                </thead>
                <tbody>
        `;
        products.forEach(product => {
            productHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${new Date(product.expiryDate).toLocaleDateString('pt-BR')}</td>
                </tr>
            `;
        });
        productHTML += `
                </tbody>
            </table>
        `;
        productListDiv.innerHTML = productHTML;
    }
    console.log("Relação de produtos exibida."); 
});

function checkExpiryAlerts() {
    const today = new Date();
    const alertThreshold = 10; 

    products.forEach(product => {
        const expiryDate = new Date(product.expiryDate);
        const timeDifference = expiryDate - today;
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (daysDifference >= 0 && daysDifference <= alertThreshold) {
            alert(`Atenção: O produto "${product.name}" vencerá em ${daysDifference} dias!`);
        }
    });
}

renderProducts();

document.getElementById('barcodeInput').addEventListener('change', function() {
    const barcode = this.value;
    const product = products.find(p => p.barcode === barcode);

    if (product) {
        alert(`Produto ${product.name} registrado automaticamente.`);
    } else {
        alert("Código de barras não encontrado.");
    }

    this.value = '';
});

