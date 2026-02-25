// Galerie
function switchImg(el) {
    const mainImg = document.getElementById('main-img');
    mainImg.style.opacity = '0';

    setTimeout(() => {
        mainImg.src = el.src;
        mainImg.style.opacity = '1';

        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
    }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const addToCartBtn = document.getElementById('add-to-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const openCart = document.getElementById('open-cart');
    const overlay = document.getElementById('overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-msg');
    const cartFooter = document.getElementById('cart-footer');

    const checkoutModal = document.getElementById('checkout-modal');
    const startCheckout = document.getElementById('start-checkout');
    const confirmPayment = document.getElementById('confirm-payment');
    const cancelPayment = document.getElementById('cancel-payment');
    const paymentStep = document.getElementById('payment-step');
    const successMessage = document.getElementById('success-message');

    let isProductInCart = false;

    function updateCartUI() {
        if (isProductInCart) {
            cartCount.innerText = "1";
            cartCount.classList.add('visible');
            emptyMsg.style.display = "none";
            cartFooter.style.display = "block";
            cartItemsContainer.innerHTML = `
                <div class="cart-item">
                    <img src="https://i.imgur.com/rpzwJlf.jpeg" alt="SHIFT AR">
                    <div>
                        <p style="font-weight:700; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">SHIFT AR</p>
                        <p style="color: var(--text-secondary); font-size: 0.75rem;">999.00€</p>
                    </div>
                </div>
            `;
        }
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            isProductInCart = true;
            updateCartUI();
            cartSidebar.classList.add('open');
            overlay.style.display = "block";
        });
    }

    if (openCart) {
        openCart.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            overlay.style.display = "block";
        });
    }

    const closeAll = () => {
        cartSidebar.classList.remove('open');
        overlay.style.display = "none";
        checkoutModal.style.display = "none";
    };

    if (closeCart) closeCart.addEventListener('click', closeAll);
    if (overlay) overlay.addEventListener('click', closeAll);
    if (cancelPayment) cancelPayment.addEventListener('click', closeAll);

    if (startCheckout) {
        startCheckout.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            checkoutModal.style.display = "flex";
        });
    }

    if (confirmPayment) {
        confirmPayment.addEventListener('click', () => {
            confirmPayment.innerText = "Validation...";
            setTimeout(() => {
                paymentStep.style.display = "none";
                successMessage.style.display = "block";
            }, 1800);
        });
    }

    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
});
