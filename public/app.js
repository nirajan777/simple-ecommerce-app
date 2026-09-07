const API_BASE_URL = '/api';
const USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

let cart = { items: [], total: 0 };
let allProducts = [];
let allOrders = [];

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
});

// ==================== PRODUCTS ====================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        allProducts = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Error loading products');
    }
}

function displayProducts() {
    const productsList = document.getElementById('productsList');
    const adminProductsList = document.getElementById('adminProductsList');
    
    const html = allProducts.map(product => `
        <div class="product-card">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : '<div class="product-image" style="background-color: #e0e0e0; display: flex; align-items: center; justify-content: center;">No Image</div>'}
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-description">${product.description.substring(0, 60)}...</div>
                ${product.features && product.features.length > 0 ? `
                    <div class="product-features">
                        <strong>Features:</strong>
                        <ul>${product.features.map(f => `<li>${f}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                <div class="product-stock ${product.stock < 5 ? 'low' : ''}">
                    Stock: ${product.stock}
                </div>
                <div class="product-actions">
                    <input type="number" id="qty_${product._id}" min="1" max="${product.stock}" value="1">
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})" class="btn btn-primary btn-small">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    productsList.innerHTML = html;
    adminProductsList.innerHTML = html + allProducts.map(product => `
        <div style="position: absolute; top: 10px; right: 10px;">
            <button onclick="editProduct('${product._id}')" class="btn btn-primary btn-small">Edit</button>
            <button onclick="deleteProduct('${product._id}')" class="btn btn-danger btn-small">Delete</button>
        </div>
    `).join('');
}

async function addProduct(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('category', document.getElementById('productCategory').value);
    
    const features = document.getElementById('productFeatures').value
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
    features.forEach(f => formData.append('features', f));
    
    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Product added successfully!');
            document.getElementById('productForm').reset();
            loadProducts();
        } else {
            alert('Error adding product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Product deleted successfully!');
            loadProducts();
        } else {
            alert('Error deleting product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
    }
}

function editProduct(productId) {
    alert('Edit functionality to be implemented');
}

// ==================== CART ====================
async function loadCart() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${USER_ID}`);
        cart = await response.json();
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function addToCart(productId, productName, price) {
    const quantity = parseInt(document.getElementById(`qty_${productId}`).value) || 1;
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${USER_ID}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                productName,
                price,
                quantity
            })
        });
        
        if (response.ok) {
            cart = await response.json();
            updateCartCount();
            alert('Product added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart');
    }
}

function updateCartCount() {
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${USER_ID}/remove/${productId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            cart = await response.json();
            displayCart();
            updateCartCount();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Error removing item');
    }
}

async function updateCartQuantity(productId, quantity) {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${USER_ID}/update/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });
        
        if (response.ok) {
            cart = await response.json();
            displayCart();
            updateCartCount();
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Error updating cart');
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.items.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    const html = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"></div>
            <div class="cart-item-details">
                <h4>${item.productName}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" min="1" value="${item.quantity}" 
                    onchange="updateCartQuantity('${item.productId}', this.value)">
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart('${item.productId}')" class="btn btn-danger btn-small">×</button>
        </div>
    `).join('');
    
    cartItems.innerHTML = html;
    document.getElementById('cartTotal').textContent = cart.total.toFixed(2);
    document.getElementById('checkoutTotal').textContent = cart.total.toFixed(2);
}

// ==================== ORDERS ====================
async function submitOrder(e) {
    e.preventDefault();
    
    if (cart.items.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const formData = new FormData(document.getElementById('checkoutForm'));
    const orderData = {
        items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        })),
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            zipCode: formData.get('zipCode')
        },
        paymentMethod: formData.get('paymentMethod')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
            
            // Clear cart
            await fetch(`${API_BASE_URL}/cart/${USER_ID}/clear`, { method: 'POST' });
            cart = { items: [], total: 0 };
            updateCartCount();
            document.getElementById('checkoutForm').reset();
            
            loadOrders();
            showOrders();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        allOrders = await response.json();
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    const adminOrdersList = document.getElementById('adminOrdersList');
    
    if (allOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-message">No orders yet</div>';
        return;
    }
    
    const html = allOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-number">Order: ${order.orderNumber}</div>
                <div class="order-status status-${order.status}">${order.status.toUpperCase()}</div>
            </div>
            <div class="order-details">
                <div>
                    <strong>Customer:</strong> ${order.customer.name}
                </div>
                <div>
                    <strong>Email:</strong> ${order.customer.email}
                </div>
                <div>
                    <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                    <strong>Total:</strong> $${order.totalAmount.toFixed(2)}
                </div>
            </div>
            <div class="order-items">
                <strong>Items:</strong>
                ${order.items.map(item => `
                    <p>${item.productName} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    ordersList.innerHTML = html;
    adminOrdersList.innerHTML = html;
}

// ==================== NAVIGATION ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showProducts() {
    showPage('productsPage');
    loadProducts();
}

function showCart() {
    showPage('cartPage');
    displayCart();
}

function showCheckout() {
    showPage('checkoutPage');
}

function showOrders() {
    showPage('ordersPage');
    loadOrders();
}

function showAdmin() {
    showPage('adminPage');
    loadProducts();
    loadOrders();
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}