// Cloud-based Inventory & Billing System
class InventoryBillingSystem {
    constructor() {
        this.currentUser = null;
        this.data = {
            users: [],
            products: [],
            orders: [],
            invoices: [],
            categories: [],
            settings: {}
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.checkAuth();
    }

    // Data Management
    loadData() {
        // Load from localStorage or initialize with default data
        const stored = localStorage.getItem('inventoryBillingData');
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            // Initialize with provided sample data
            this.data = {
                users: [
                    {id: 1, username: "admin", email: "admin@example.com", password: "password", role: "Admin", created_at: "2025-01-01"},
                    {id: 2, username: "john_user", email: "user@example.com", password: "password", role: "User", created_at: "2025-01-15"}
                ],
                products: [
                    {id: 1, name: "Laptop Pro 15", description: "High-performance laptop for professionals", price: 1299.99, quantity: 25, category: "Electronics", image: "laptop.jpg"},
                    {id: 2, name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99, quantity: 150, category: "Electronics", image: "mouse.jpg"},
                    {id: 3, name: "Office Chair", description: "Comfortable ergonomic office chair", price: 249.99, quantity: 30, category: "Furniture", image: "chair.jpg"},
                    {id: 4, name: "Desk Lamp", description: "LED desk lamp with adjustable brightness", price: 45.99, quantity: 75, category: "Office Supplies", image: "lamp.jpg"},
                    {id: 5, name: "Smartphone X", description: "Latest smartphone with advanced features", price: 899.99, quantity: 12, category: "Electronics", image: "phone.jpg"},
                    {id: 6, name: "Monitor 27\"", description: "4K Ultra HD monitor", price: 349.99, quantity: 45, category: "Electronics", image: "monitor.jpg"},
                    {id: 7, name: "Keyboard Mechanical", description: "RGB mechanical gaming keyboard", price: 89.99, quantity: 60, category: "Electronics", image: "keyboard.jpg"},
                    {id: 8, name: "Standing Desk", description: "Height adjustable standing desk", price: 499.99, quantity: 15, category: "Furniture", image: "desk.jpg"},
                    {id: 9, name: "Headphones Pro", description: "Noise-cancelling wireless headphones", price: 199.99, quantity: 35, category: "Electronics", image: "headphones.jpg"},
                    {id: 10, name: "Webcam HD", description: "1080p HD webcam for video calls", price: 79.99, quantity: 90, category: "Electronics", image: "webcam.jpg"}
                ],
                orders: [
                    {id: 1, user_id: 2, order_date: "2025-09-01", status: "Completed", total_amount: 1329.98, items: [{product_id: 1, quantity: 1, price: 1299.99}, {product_id: 2, quantity: 1, price: 29.99}]},
                    {id: 2, user_id: 2, order_date: "2025-09-05", status: "Processing", total_amount: 249.99, items: [{product_id: 3, quantity: 1, price: 249.99}]},
                    {id: 3, user_id: 1, order_date: "2025-09-10", status: "Pending", total_amount: 899.99, items: [{product_id: 5, quantity: 1, price: 899.99}]}
                ],
                invoices: [
                    {id: 1, order_id: 1, invoice_number: "INV-2025-001", invoice_date: "2025-09-01", status: "Paid", total_amount: 1329.98, tax_amount: 119.70}
                ],
                categories: ["Electronics", "Furniture", "Office Supplies", "Books", "Clothing"],
                settings: {
                    company_name: "CloudBilling Pro",
                    tax_rate: 0.09,
                    currency: "USD"
                }
            };
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('inventoryBillingData', JSON.stringify(this.data));
    }

    // Authentication
    login(email, password) {
        const user = this.data.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showApp();
            this.showToast('Login successful!', 'success');
            return true;
        }
        this.showToast('Invalid credentials', 'error');
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLogin();
        this.showToast('Logged out successfully', 'success');
    }

    checkAuth() {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    // UI Management
    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        // Update user info
        document.getElementById('currentUser').textContent = `Welcome, ${this.currentUser.username}`;
        
        // Show/hide admin features
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            if (this.currentUser.role === 'Admin') {
                el.classList.add('show');
            } else {
                el.classList.remove('show');
            }
        });
        
        this.loadDashboard();
    }

    // Dashboard
    loadDashboard() {
        this.updateMetrics();
        this.renderCharts();
        this.loadRecentOrders();
    }

    updateMetrics() {
        const totalRevenue = this.data.orders
            .filter(o => o.status === 'Completed')
            .reduce((sum, o) => sum + o.total_amount, 0);
        
        const totalOrders = this.data.orders.length;
        const totalProducts = this.data.products.length;
        const lowStockCount = this.data.products.filter(p => p.quantity < 20).length;

        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockCount').textContent = lowStockCount;
    }

    renderCharts() {
        this.renderSalesChart();
        this.renderProductsChart();
        this.renderAnalyticsCharts();
    }

    renderSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        // Generate sample sales data
        const salesData = this.generateSalesData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Daily Sales',
                    data: salesData.values,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    renderProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const productData = this.data.products.slice(0, 5).map(p => ({
            name: p.name.split(' ')[0],
            quantity: p.quantity
        }));

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: productData.map(p => p.name),
                datasets: [{
                    data: productData.map(p => p.quantity),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderAnalyticsCharts() {
        // Revenue Trends
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            const revenueData = this.generateRevenueData();
            new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: revenueData.labels,
                    datasets: [{
                        label: 'Monthly Revenue',
                        data: revenueData.values,
                        backgroundColor: '#1FB8CD',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Order Status Distribution
        const statusCtx = document.getElementById('orderStatusChart');
        if (statusCtx) {
            const statusData = this.getOrderStatusData();
            new Chart(statusCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(statusData),
                    datasets: [{
                        data: Object.values(statusData),
                        backgroundColor: ['#FFC185', '#1FB8CD', '#B4413C', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Category Performance
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            const categoryData = this.getCategoryData();
            new Chart(categoryCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        label: 'Products in Stock',
                        data: Object.values(categoryData),
                        backgroundColor: '#B4413C',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Stock Levels
        const stockCtx = document.getElementById('stockChart');
        if (stockCtx) {
            const stockData = this.data.products.slice(0, 8);
            new Chart(stockCtx, {
                type: 'bar',
                data: {
                    labels: stockData.map(p => p.name.split(' ')[0]),
                    datasets: [{
                        label: 'Stock Level',
                        data: stockData.map(p => p.quantity),
                        backgroundColor: stockData.map(p => p.quantity < 20 ? '#DB4545' : '#1FB8CD'),
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    generateSalesData() {
        const labels = [];
        const values = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            values.push(Math.floor(Math.random() * 2000) + 500);
        }
        
        return { labels, values };
    }

    generateRevenueData() {
        const labels = [];
        const values = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
            values.push(Math.floor(Math.random() * 10000) + 5000);
        }
        
        return { labels, values };
    }

    getOrderStatusData() {
        const statusCount = {};
        this.data.orders.forEach(order => {
            statusCount[order.status] = (statusCount[order.status] || 0) + 1;
        });
        return statusCount;
    }

    getCategoryData() {
        const categoryCount = {};
        this.data.products.forEach(product => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + product.quantity;
        });
        return categoryCount;
    }

    loadRecentOrders() {
        const container = document.getElementById('recentOrdersList');
        if (!container) return;

        const recentOrders = this.data.orders
            .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
            .slice(0, 5);

        if (recentOrders.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>No orders found</p></div>';
            return;
        }

        container.innerHTML = recentOrders.map(order => {
            const user = this.data.users.find(u => u.id === order.user_id);
            return `
                <div class="order-item">
                    <div class="order-info">
                        <h5>Order #${order.id}</h5>
                        <p>${user ? user.username : 'Unknown User'} • ${new Date(order.order_date).toLocaleDateString()}</p>
                    </div>
                    <div class="order-amount">$${order.total_amount.toFixed(2)}</div>
                </div>
            `;
        }).join('');
    }

    // Product Management
    loadProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        // Load categories in filter
        this.loadCategories();

        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';

        let filteredProducts = this.data.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (filteredProducts.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-box"></i><p>No products found</p></div>';
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="product-stock ${product.quantity < 20 ? 'low-stock' : ''}">
                            ${product.quantity} in stock
                        </span>
                    </div>
                    <div class="product-actions">
                        ${this.currentUser.role === 'Admin' ? `
                            <button class="btn btn--secondary btn--sm" onclick="app.editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn--outline btn--sm" onclick="app.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        ` : `
                            <button class="btn btn--primary btn--sm" onclick="app.addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const productCategory = document.getElementById('productCategory');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>' +
                this.data.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }
        
        if (productCategory) {
            productCategory.innerHTML = this.data.categories.map(cat => 
                `<option value="${cat}">${cat}</option>`).join('');
        }
    }

    openProductModal(product = null) {
        // Close any existing modals first
        this.closeAllModals();
        
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('productModalTitle');

        if (product) {
            title.textContent = 'Edit Product';
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productCategory').value = product.category;
            form.dataset.productId = product.id;
        } else {
            title.textContent = 'Add Product';
            form.reset();
            delete form.dataset.productId;
        }

        this.loadCategories();
        modal.classList.remove('hidden');
    }

    editProduct(id) {
        const product = this.data.products.find(p => p.id === id);
        if (product) {
            this.openProductModal(product);
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.data.products = this.data.products.filter(p => p.id !== id);
            this.saveData();
            this.loadProducts();
            this.showToast('Product deleted successfully', 'success');
        }
    }

    saveProduct(formData) {
        const productId = parseInt(document.getElementById('productForm').dataset.productId);
        
        if (productId) {
            // Update existing product
            const productIndex = this.data.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                this.data.products[productIndex] = { ...this.data.products[productIndex], ...formData };
            }
        } else {
            // Add new product
            const newId = Math.max(...this.data.products.map(p => p.id), 0) + 1;
            this.data.products.push({ id: newId, ...formData });
        }

        this.saveData();
        this.closeModal('productModal');
        this.loadProducts();
        this.showToast('Product saved successfully', 'success');
    }

    // Order Management
    loadOrders() {
        const container = document.getElementById('ordersList');
        if (!container) return;

        const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filteredOrders = this.data.orders.filter(order => {
            const user = this.data.users.find(u => u.id === order.user_id);
            const matchesSearch = order.id.toString().includes(searchTerm) ||
                                (user && user.username.toLowerCase().includes(searchTerm));
            const matchesStatus = !statusFilter || order.status === statusFilter;
            
            // For regular users, only show their own orders
            const isOwnOrder = this.currentUser.role === 'Admin' || order.user_id === this.currentUser.id;
            
            return matchesSearch && matchesStatus && isOwnOrder;
        });

        if (filteredOrders.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>No orders found</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        ${this.currentUser.role === 'Admin' ? '<th>Customer</th>' : ''}
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredOrders.map(order => {
                        const user = this.data.users.find(u => u.id === order.user_id);
                        return `
                            <tr>
                                <td>#${order.id}</td>
                                ${this.currentUser.role === 'Admin' ? `<td>${user ? user.username : 'Unknown'}</td>` : ''}
                                <td>${new Date(order.order_date).toLocaleDateString()}</td>
                                <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                                <td>$${order.total_amount.toFixed(2)}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn--secondary btn--sm" onclick="app.viewOrder(${order.id})">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        ${this.currentUser.role === 'Admin' && order.status !== 'Completed' ? `
                                            <button class="btn btn--primary btn--sm" onclick="app.updateOrderStatus(${order.id})">
                                                <i class="fas fa-edit"></i> Update
                                            </button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    openOrderModal() {
        // Close any existing modals first
        this.closeAllModals();
        
        const modal = document.getElementById('orderModal');
        const container = document.getElementById('orderProductsList');
        
        container.innerHTML = this.data.products.map(product => `
            <div class="order-product-item">
                <div class="order-product-info">
                    <h5>${product.name}</h5>
                    <p>$${product.price.toFixed(2)} - ${product.quantity} available</p>
                </div>
                <div class="quantity-control">
                    <button type="button" onclick="app.decreaseQuantity(${product.id})">-</button>
                    <input type="number" id="qty-${product.id}" value="0" min="0" max="${product.quantity}" 
                           onchange="app.updateOrderSummary()">
                    <button type="button" onclick="app.increaseQuantity(${product.id})">+</button>
                </div>
            </div>
        `).join('');

        this.updateOrderSummary();
        modal.classList.remove('hidden');
    }

    increaseQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        const product = this.data.products.find(p => p.id === productId);
        if (parseInt(input.value) < product.quantity) {
            input.value = parseInt(input.value) + 1;
            this.updateOrderSummary();
        }
    }

    decreaseQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (parseInt(input.value) > 0) {
            input.value = parseInt(input.value) - 1;
            this.updateOrderSummary();
        }
    }

    updateOrderSummary() {
        const summaryContainer = document.getElementById('orderSummaryItems');
        const totalContainer = document.getElementById('orderTotal');
        
        let total = 0;
        let items = [];

        this.data.products.forEach(product => {
            const qtyInput = document.getElementById(`qty-${product.id}`);
            const quantity = parseInt(qtyInput?.value || 0);
            
            if (quantity > 0) {
                const itemTotal = quantity * product.price;
                total += itemTotal;
                items.push({
                    product,
                    quantity,
                    itemTotal
                });
            }
        });

        summaryContainer.innerHTML = items.map(item => `
            <div class="order-summary-item">
                <span>${item.product.name} (${item.quantity}x)</span>
                <span>$${item.itemTotal.toFixed(2)}</span>
            </div>
        `).join('');

        totalContainer.textContent = total.toFixed(2);
    }

    placeOrder() {
        const items = [];
        let total = 0;

        this.data.products.forEach(product => {
            const qtyInput = document.getElementById(`qty-${product.id}`);
            const quantity = parseInt(qtyInput?.value || 0);
            
            if (quantity > 0) {
                if (quantity > product.quantity) {
                    this.showToast(`Not enough stock for ${product.name}`, 'error');
                    return false;
                }
                
                items.push({
                    product_id: product.id,
                    quantity,
                    price: product.price
                });
                total += quantity * product.price;
            }
        });

        if (items.length === 0) {
            this.showToast('Please select at least one product', 'error');
            return;
        }

        // Create new order
        const newOrderId = Math.max(...this.data.orders.map(o => o.id), 0) + 1;
        const newOrder = {
            id: newOrderId,
            user_id: this.currentUser.id,
            order_date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            total_amount: total,
            items
        };

        this.data.orders.push(newOrder);

        // Update product quantities
        items.forEach(item => {
            const product = this.data.products.find(p => p.id === item.product_id);
            if (product) {
                product.quantity -= item.quantity;
            }
        });

        // Generate invoice if order is completed
        if (newOrder.status === 'Completed') {
            this.generateInvoice(newOrder);
        }

        this.saveData();
        this.closeModal('orderModal');
        this.loadOrders();
        this.showToast('Order placed successfully!', 'success');
    }

    updateOrderStatus(orderId) {
        const order = this.data.orders.find(o => o.id === orderId);
        if (!order) return;

        const newStatus = prompt('Enter new status (Pending, Processing, Completed, Cancelled):', order.status);
        if (newStatus && ['Pending', 'Processing', 'Completed', 'Cancelled'].includes(newStatus)) {
            order.status = newStatus;
            
            // Generate invoice when order is completed
            if (newStatus === 'Completed' && !this.data.invoices.find(i => i.order_id === orderId)) {
                this.generateInvoice(order);
            }
            
            this.saveData();
            this.loadOrders();
            this.showToast('Order status updated successfully', 'success');
        }
    }

    viewOrder(orderId) {
        const order = this.data.orders.find(o => o.id === orderId);
        if (!order) return;

        const user = this.data.users.find(u => u.id === order.user_id);
        const itemDetails = order.items.map(item => {
            const product = this.data.products.find(p => p.id === item.product_id);
            return `${product ? product.name : 'Unknown Product'} (${item.quantity}x) - $${(item.quantity * item.price).toFixed(2)}`;
        }).join('\n');

        alert(`Order Details:
        
Order ID: #${order.id}
Customer: ${user ? user.username : 'Unknown'}
Date: ${new Date(order.order_date).toLocaleDateString()}
Status: ${order.status}
Total: $${order.total_amount.toFixed(2)}

Items:
${itemDetails}`);
    }

    // Invoice Management
    loadInvoices() {
        const container = document.getElementById('invoicesList');
        if (!container) return;

        const searchTerm = document.getElementById('invoiceSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('invoiceStatusFilter')?.value || '';

        let filteredInvoices = this.data.invoices.filter(invoice => {
            const order = this.data.orders.find(o => o.id === invoice.order_id);
            const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || invoice.status === statusFilter;
            
            // For regular users, only show invoices for their orders
            const isOwnInvoice = this.currentUser.role === 'Admin' || 
                               (order && order.user_id === this.currentUser.id);
            
            return matchesSearch && matchesStatus && isOwnInvoice;
        });

        if (filteredInvoices.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-file-invoice"></i><p>No invoices found</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredInvoices.map(invoice => `
                        <tr>
                            <td>${invoice.invoice_number}</td>
                            <td>#${invoice.order_id}</td>
                            <td>${new Date(invoice.invoice_date).toLocaleDateString()}</td>
                            <td><span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span></td>
                            <td>$${invoice.total_amount.toFixed(2)}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn--secondary btn--sm" onclick="app.viewInvoice(${invoice.id})">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="btn btn--primary btn--sm" onclick="app.downloadInvoice(${invoice.id})">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateInvoice(order) {
        const invoiceNumber = `INV-2025-${String(this.data.invoices.length + 1).padStart(3, '0')}`;
        const taxAmount = order.total_amount * this.data.settings.tax_rate;
        
        const invoice = {
            id: Math.max(...this.data.invoices.map(i => i.id), 0) + 1,
            order_id: order.id,
            invoice_number: invoiceNumber,
            invoice_date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            total_amount: order.total_amount + taxAmount,
            tax_amount: taxAmount
        };

        this.data.invoices.push(invoice);
        this.saveData();
        return invoice;
    }

    viewInvoice(invoiceId) {
        const invoice = this.data.invoices.find(i => i.id === invoiceId);
        if (!invoice) return;

        const order = this.data.orders.find(o => o.id === invoice.order_id);
        const user = order ? this.data.users.find(u => u.id === order.user_id) : null;
        
        const itemDetails = order ? order.items.map(item => {
            const product = this.data.products.find(p => p.id === item.product_id);
            return `${product ? product.name : 'Unknown Product'} (${item.quantity}x) - $${(item.quantity * item.price).toFixed(2)}`;
        }).join('\n') : 'No items found';

        alert(`Invoice Details:
        
Invoice Number: ${invoice.invoice_number}
Order ID: #${invoice.order_id}
Customer: ${user ? user.username : 'Unknown'}
Date: ${new Date(invoice.invoice_date).toLocaleDateString()}
Status: ${invoice.status}

Items:
${itemDetails}

Subtotal: $${(invoice.total_amount - invoice.tax_amount).toFixed(2)}
Tax: $${invoice.tax_amount.toFixed(2)}
Total: $${invoice.total_amount.toFixed(2)}`);
    }

    downloadInvoice(invoiceId) {
        // Simulate PDF download
        this.showToast('Invoice downloaded successfully!', 'success');
    }

    // User Management
    loadUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;

        if (this.data.users.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No users found</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.data.users.map(user => `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td><span class="status-badge status-${user.role.toLowerCase()}">${user.role}</span></td>
                            <td>${new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn--secondary btn--sm" onclick="app.editUser(${user.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    ${user.id !== this.currentUser.id ? `
                                        <button class="btn btn--outline btn--sm" onclick="app.deleteUser(${user.id})">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Event Handlers
    bindEvents() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            this.login(email, password);
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Product form
        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('productName').value,
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                quantity: parseInt(document.getElementById('productQuantity').value),
                category: document.getElementById('productCategory').value
            };
            this.saveProduct(formData);
        });

        // Modal close handlers - Fixed implementation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.getAttribute('data-dismiss') === 'modal') {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            }
            
            // Close modal when clicking backdrop
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Add product button
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.openProductModal();
        });

        // New order button
        document.getElementById('newOrderBtn')?.addEventListener('click', () => {
            this.openOrderModal();
        });

        // Place order button
        document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
            this.placeOrder();
        });

        // Search and filter handlers
        document.getElementById('productSearch')?.addEventListener('input', () => {
            this.loadProducts();
        });

        document.getElementById('categoryFilter')?.addEventListener('change', () => {
            this.loadProducts();
        });

        document.getElementById('orderSearch')?.addEventListener('input', () => {
            this.loadOrders();
        });

        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.loadOrders();
        });

        document.getElementById('invoiceSearch')?.addEventListener('input', () => {
            this.loadInvoices();
        });

        document.getElementById('invoiceStatusFilter')?.addEventListener('change', () => {
            this.loadInvoices();
        });
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName)?.classList.add('active');

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'invoices':
                this.loadInvoices();
                break;
            case 'analytics':
                setTimeout(() => this.renderAnalyticsCharts(), 100);
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the application
const app = new InventoryBillingSystem();