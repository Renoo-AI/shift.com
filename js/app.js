/**
 * SHIFT — Core Application Logic
 * Handles Theme Persistence, Cart Management, and shared UI interactions.
 */

// --- THEME MANAGEMENT ---
const THEME_KEY = 'shift-theme';
const DEFAULT_THEME = 'dark';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update all theme icons in the document
    const themeSvgs = document.querySelectorAll('#theme-svg');
    const isDark = theme === 'dark';
    const darkIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    const lightIcon = `<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>`;

    themeSvgs.forEach(svg => {
        svg.innerHTML = isDark ? darkIcon : lightIcon;
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    setTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-switch');
    toggleBtns.forEach(btn => {
        btn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        };
    });
}

// --- CART MANAGEMENT ---
const CART_KEY = 'shift-cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

function showNotification(msg) {
    let toast = document.getElementById('notification-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'notification-toast';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateCartUI() {
    // Selectors for both Home and Product page templates
    const badges = document.querySelectorAll('#badge-count, #badge');
    const cartContents = document.querySelectorAll('#cart-content, #cart-items-list');
    const cartFooters = document.querySelectorAll('#cart-actions, #cart-footer-area');
    const totalVals = document.querySelectorAll('#cart-total-val, #cart-total-amount');

    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    badges.forEach(badge => {
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    });

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    totalVals.forEach(v => v.innerText = totalAmount.toLocaleString() + '€');

    if (totalItems === 0) {
        cartContents.forEach(c => {
            c.innerHTML = '<p style="color:var(--text-secondary); font-size:0.85rem; text-align:center; padding:40px 0;">Votre sélection est vide.</p>';
        });
        cartFooters.forEach(f => f.style.display = 'none');
        return;
    }

    cartFooters.forEach(f => f.style.display = 'block');

    let html = '';
    cart.forEach((item, index) => {
        const name = item.edition || item.name;
        html += `
            <div class="cart-item-row" style="display:flex; gap:20px; align-items:center; padding:20px 0; border-bottom:1px solid var(--border-color);">
                <img src="https://i.imgur.com/g3Q4IFm.jpeg" style="width:60px; height:40px; object-fit:cover; border-radius:2px;">
                <div style="flex-grow:1;">
                    <p style="font-weight:700; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; font-family:var(--font-logo);">SHIFT ${name}</p>
                    <p style="color:var(--text-secondary); font-size:0.8rem;">${item.price}€ ${item.qty > 1 ? '× ' + item.qty : ''}</p>
                </div>
                <span style="cursor:pointer; opacity:0.5; font-size:1.2rem;" onclick="removeFromCart(${index})">&times;</span>
            </div>`;
    });

    cartContents.forEach(c => c.innerHTML = html);
}

window.addToCart = function(name, price, qty = 1) {
    const existing = cart.find(i => (i.edition || i.name) === name);
    if (existing) {
        existing.qty = (existing.qty || 1) + qty;
    } else {
        cart.push({ name, price, qty });
    }
    saveCart();
    showNotification(`${name} ajouté`);
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.add('open');
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
};

function initCart() {
    const openTriggers = document.querySelectorAll('#cart-open-trigger, #cart-trigger');
    const closeTriggers = document.querySelectorAll('#cart-close-trigger, #close-cart');
    const panel = document.getElementById('cart-panel');

    openTriggers.forEach(t => t.onclick = () => panel.classList.add('open'));
    closeTriggers.forEach(t => t.onclick = () => panel.classList.remove('open'));

    const checkoutBtns = document.querySelectorAll('#checkout-btn, [onclick="openCheckout()"]');
    checkoutBtns.forEach(btn => {
        btn.onclick = () => {
            if (panel) panel.classList.remove('open');
            const modal = document.getElementById('payment-modal') || document.getElementById('checkout-view');
            if (modal) modal.style.display = 'flex';
        };
    });

    const confirmPay = document.getElementById('confirm-pay') || document.getElementById('confirm-btn');
    if (confirmPay) {
        confirmPay.onclick = function() {
            this.innerText = "VÉRIFICATION...";
            setTimeout(() => {
                const form = document.getElementById('pay-form') || document.getElementById('payment-form');
                const success = document.getElementById('pay-success') || document.getElementById('payment-success');
                if (form) form.style.display = 'none';
                if (success) success.style.display = 'block';
            }, 2000);
        };
    }

    const cancelPay = document.getElementById('cancel-pay') || document.querySelector('[onclick*="checkout-view"]');
    if (cancelPay) {
        cancelPay.onclick = () => {
            const modal = document.getElementById('payment-modal') || document.getElementById('checkout-view');
            if (modal) modal.style.display = 'none';
        };
    }

    updateCartUI();
}

// --- REVEAL ANIMATIONS ---
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.price-card, .brand-story, .hero-header, .choose-label, .product-grid, .hero-branding, .trust-grid').forEach(el => {
        if (!el.style.transition) {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "all 1s cubic-bezier(0.2, 1, 0.2, 1)";
        }
        observer.observe(el);
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCart();
    initReveal();
});
