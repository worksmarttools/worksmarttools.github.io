// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getCategories`);
        const result = await response.json();
        
        if (result.success && result.categories) {
            const categoryGrid = document.getElementById('categoryGrid');
            if (categoryGrid) {
                categoryGrid.innerHTML = result.categories.map(cat => `
                    <div class="category-card" onclick="filterByCategory('${cat.name}')">
                        <h3>${escapeHtml(cat.name)}</h3>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products
async function loadProducts(category = null) {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getProducts`);
        const result = await response.json();
        
        if (result.success && result.products) {
            let products = result.products;
            if (category) {
                products = products.filter(p => p.category === category);
            }
            
            const productGrid = document.getElementById('productGrid');
            if (productGrid) {
                if (products.length === 0) {
                    productGrid.innerHTML = '<div class="loading">No products found</div>';
                } else {
                    productGrid.innerHTML = products.map(product => `
                        <div class="product-card" onclick="viewProduct('${product.id}')">
                            ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.title}">` : ''}
                            <h3>${escapeHtml(product.title)}</h3>
                            <p>${escapeHtml(product.category || 'Uncategorized')}</p>
                        </div>
                    `).join('');
                }
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Filter by category
function filterByCategory(category) {
    loadProducts(category);
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
}

// View product details
function viewProduct(productId) {
    window.location.href = `/product/index.html?id=${productId}`;
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
if (document.getElementById('categoryGrid')) {
    loadCategories();
    loadProducts();
}