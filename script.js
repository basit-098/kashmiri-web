/**
 * ============================================
 * KASHMIR CRAVINGS - MAIN JAVASCRIPT
 * Traditional Kashmiri Bread Delivery App
 * ============================================
 */

// ============================================
// DATA & CONFIGURATION
// ============================================

const breads = [
    {
        id: 1,
        name: "Lavasa",
        description: "Soft, fluffy leavened bread with a golden crust. Perfect with morning chai.",
        price: 25,
        category: "tandoor",
        image: "images/lavasa.jpg",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Girda",
        description: "Round, thick bread with sesame seeds. The heart of Kashmiri breakfast.",
        price: 20,
        category: "tandoor",
        image: "images/girda.jpg",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Kulcha",
        description: "Flaky, layered bread with a crispy exterior. Ideal with Wazwan dishes.",
        price: 30,
        category: "tandoor",
        image: "images/kulcha.jpg",
        badge: null
    },
    {
        id: 4,
        name: "Sheermal",
        description: "Saffron-infused sweet bread with a rich, milky flavor. A royal treat.",
        price: 45,
        category: "sweet",
        image: "images/sheermaal.jpg",
        badge: "Premium"
    },
    {
        id: 5,
        name: "Bakarkhani",
        description: "Thin, crispy layered bread with poppy seeds. Sweet and savory delight.",
        price: 35,
        category: "sweet",
        image: "images/bakirkhani.jpg",
        badge: null
    },
    {
        id: 6,
        name: "Telvoru",
        description: "Crispy fried bread, perfect for special occasions and celebrations.",
        price: 40,
        category: "crispy",
        image: "images/telvoru.jpg",
        badge: "Festive"
    }
];

// ============================================
// STATE MANAGEMENT
// ============================================

let cart = [];
let currentFilter = 'all';

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    // Navigation
    navbar: document.getElementById('navbar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    themeToggle: document.getElementById('themeToggle'),
    mobileThemeToggle: document.getElementById('mobileThemeToggle'),
    
    // Cart
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTotal: document.getElementById('cartTotal'),
    deliveryFee: document.getElementById('deliveryFee'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Menu
    breadGrid: document.getElementById('breadGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Form
    orderForm: document.getElementById('orderForm'),
    formCartItems: document.getElementById('formCartItems'),
    formCartTotal: document.getElementById('formCartTotal'),
    placeOrderBtn: document.getElementById('placeOrderBtn'),
    progressBar: document.getElementById('progressBar'),
    
    // Toast & Modals
    toast: document.getElementById('toast'),
    toastTitle: document.getElementById('toastTitle'),
    toastMessage: document.getElementById('toastMessage'),
    loadingModal: document.getElementById('loadingModal'),
    successModal: document.getElementById('successModal'),
    successContent: document.getElementById('successContent'),
    orderNumber: document.getElementById('orderNumber')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderBreadMenu();
    setupEventListeners();
    loadTheme();
    updateCartUI();
    
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// ============================================
// BREAD MENU RENDERING
// ============================================

function renderBreadMenu() {
    const filteredBreads = currentFilter === 'all' 
        ? breads 
        : breads.filter(b => b.category === currentFilter);
    
    elements.breadGrid.innerHTML = filteredBreads.map(bread => `
        <article class="bread-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl group">
            <!-- Image Container -->
            <div class="relative h-48 overflow-hidden">
                <img src="${bread.image}" alt="${bread.name}" 
                    class="card-image w-full h-full object-cover">
                ${bread.badge ? `
                    <span class="absolute top-4 left-4 px-3 py-1 bg-kashmir-red text-white text-xs font-bold rounded-full">
                        ${bread.badge}
                    </span>
                ` : ''}
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-serif text-xl font-bold text-kashmir-brown dark:text-kashmir-cream">${bread.name}</h3>
                    <span class="text-lg font-bold text-saffron-600 dark:text-saffron-400">₹${bread.price}</span>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${bread.description}</p>
                
                <!-- Add to Cart -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button onclick="updateQuantity(${bread.id}, -1)" class="quantity-btn w-8 h-8 rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 flex items-center justify-center">
                            <i data-feather="minus" class="w-4 h-4"></i>
                        </button>
                        <span id="qty-${bread.id}" class="w-8 text-center font-semibold">1</span>
                        <button onclick="updateQuantity(${bread.id}, 1)" class="quantity-btn w-8 h-8 rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 flex items-center justify-center">
                            <i data-feather="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <button onclick="addToCart(${bread.id})" class="btn-ripple bg-kashmir-red hover:bg-kashmir-red/90 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2">
                        <i data-feather="shopping-bag" class="w-4 h-4"></i>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
    
    // Re-initialize Feather icons after rendering
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Temporary quantity storage for menu items
const tempQuantities = {};

function updateQuantity(breadId, change) {
    const qtyEl = document.getElementById(`qty-${breadId}`);
    let current = tempQuantities[breadId] || 1;
    current = Math.max(1, Math.min(10, current + change));
    tempQuantities[breadId] = current;
    qtyEl.textContent = current;
}

// ============================================
// CART FUNCTIONALITY
// ============================================

function addToCart(breadId) {
    const bread = breads.find(b => b.id === breadId);
    const quantity = tempQuantities[breadId] || 1;
    
    const existingItem = cart.find(item => item.id === breadId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...bread,
            quantity: quantity
        });
    }
    
    // Reset temp quantity
    tempQuantities[breadId] = 1;
    const qtyEl = document.getElementById(`qty-${breadId}`);
    if (qtyEl) qtyEl.textContent = '1';
    
    updateCartUI();
    showToast('Added to Cart!', `${bread.name} (${quantity}x) added successfully`);
    
    // Animate cart icon
    elements.cartBtn.classList.add('animate-bounce');
    setTimeout(() => elements.cartBtn.classList.remove('animate-bounce'), 500);
}

function removeFromCart(breadId) {
    const itemEl = document.querySelector(`[data-cart-id="${breadId}"]`);
    if (itemEl) {
        itemEl.classList.add('removing');
        setTimeout(() => {
            cart = cart.filter(item => item.id !== breadId);
            updateCartUI();
        }, 300);
    }
}

function updateCartItemQuantity(breadId, change) {
    const item = cart.find(item => item.id === breadId);
    if (!item) return;
    
    item.quantity = Math.max(1, item.quantity + change);
    updateCartUI();
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    elements.cartCount.style.opacity = totalItems > 0 ? '1' : '0';
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;
    
    // Update sidebar cart
    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="text-center py-12">
                <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-feather="shopping-bag" class="w-12 h-12 text-gray-400"></i>
                </div>
                <p class="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Add some fresh bread to get started!</p>
            </div>
        `;
        elements.checkoutBtn.classList.add('opacity-50', 'pointer-events-none');
    } else {
        elements.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl" data-cart-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-1">
                    <h4 class="font-semibold text-kashmir-brown dark:text-kashmir-cream">${item.name}</h4>
                    <p class="text-saffron-600 dark:text-saffron-400 font-medium">₹${item.price}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateCartItemQuantity(${item.id}, -1)" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                        <i data-feather="minus" class="w-4 h-4"></i>
                    </button>
                    <span class="w-8 text-center font-semibold">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 1)" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                        <i data-feather="plus" class="w-4 h-4"></i>
                    </button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <i data-feather="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        `).join('');
        elements.checkoutBtn.classList.remove('opacity-50', 'pointer-events-none');
    }
    
    elements.cartSubtotal.textContent = `₹${subtotal}`;
    elements.deliveryFee.textContent = `₹${deliveryFee}`;
    elements.cartTotal.textContent = `₹${total}`;
    
    // Update form cart summary
    updateFormCartSummary(subtotal, total);
    
    feather.replace();
}

function updateFormCartSummary(subtotal, total) {
    if (cart.length === 0) {
        elements.formCartItems.innerHTML = `
            <p class="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty. Add some delicious bread first!</p>
        `;
        elements.placeOrderBtn.disabled = true;
        elements.progressBar.style.width = '0%';
    } else {
        elements.formCartItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center py-2">
                <div class="flex items-center space-x-3">
                    <span class="w-6 h-6 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400 rounded-full flex items-center justify-center text-sm font-bold">${item.quantity}</span>
                    <span class="text-gray-700 dark:text-gray-300">${item.name}</span>
                </div>
                <span class="font-medium text-kashmir-brown dark:text-kashmir-cream">₹${item.price * item.quantity}</span>
            </div>
        `).join('');
        elements.placeOrderBtn.disabled = false;
        elements.progressBar.style.width = '50%';
    }
    elements.formCartTotal.textContent = `₹${total}`;
}

// ============================================
// UI INTERACTIONS
// ============================================

function openCart() {
    elements.cartSidebar.classList.remove('translate-x-full');
    elements.cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    elements.cartSidebar.classList.add('translate-x-full');
    elements.cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

function showToast(title, message) {
    elements.toastTitle.textContent = title;
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('toast-show');
    
    setTimeout(() => {
        elements.toast.classList.remove('toast-show');
    }, 3000);
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
}

// ============================================
// FORM HANDLING
// ============================================

function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('customerName');
    const nameError = name.nextElementSibling;
    if (name.value.trim().length < 2) {
        nameError.classList.remove('hidden');
        isValid = false;
    } else {
        nameError.classList.add('hidden');
    }
    
    // Phone validation
    const phone = document.getElementById('customerPhone');
    const phoneError = phone.nextElementSibling;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.value)) {
        phoneError.classList.remove('hidden');
        isValid = false;
    } else {
        phoneError.classList.add('hidden');
    }
    
    // Address validation
    const address = document.getElementById('customerAddress');
    const addressError = address.nextElementSibling;
    if (address.value.trim().length < 10) {
        addressError.classList.remove('hidden');
        isValid = false;
    } else {
        addressError.classList.add('hidden');
    }
    
    // Cart validation
    if (cart.length === 0) {
        showToast('Cart Empty!', 'Please add items to your cart first');
        isValid = false;
    }
    
    return isValid;
}

function submitOrder(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Show loading
    elements.loadingModal.classList.remove('hidden');
    
    // Simulate API call
    setTimeout(() => {
        elements.loadingModal.classList.add('hidden');
        
        // Generate order number
        const orderNum = 'KC-' + Math.floor(10000 + Math.random() * 90000);
        elements.orderNumber.textContent = orderNum;
        
        // Show success
        elements.successModal.classList.remove('hidden');
        setTimeout(() => {
            elements.successContent.classList.remove('scale-95', 'opacity-0');
            elements.successContent.classList.add('scale-100', 'opacity-100');
        }, 50);
        
        // Clear cart
        cart = [];
        updateCartUI();
        
        // Reset form
        elements.orderForm.reset();
        elements.progressBar.style.width = '100%';
        
    }, 2500);
}

function closeSuccessModal() {
    elements.successContent.classList.remove('scale-100', 'opacity-100');
    elements.successContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        elements.successModal.classList.add('hidden');
        elements.progressBar.style.width = '0%';
    }, 300);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.toggle('hidden');
    });
    
    // Theme toggles
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.mobileThemeToggle.addEventListener('click', toggleTheme);
    
    // Cart
    elements.cartBtn.addEventListener('click', openCart);
    elements.closeCart.addEventListener('click', closeCart);
    elements.cartOverlay.addEventListener('click', closeCart);
    elements.checkoutBtn.addEventListener('click', () => {
        closeCart();
        document.getElementById('delivery').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderBreadMenu();
        });
    });
    
    // Form submission
    elements.orderForm.addEventListener('submit', submitOrder);
    
    // Sticky navbar
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            elements.navbar.classList.add('navbar-scrolled');
        } else {
            elements.navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Close mobile menu on link click
    elements.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.add('hidden');
        });
    });
    
    // Real-time validation
    document.getElementById('customerPhone').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
}

// Make functions globally accessible for HTML onclick handlers
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.closeSuccessModal = closeSuccessModal;