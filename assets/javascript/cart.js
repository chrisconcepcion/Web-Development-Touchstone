document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const itemName = card.querySelector('h5').textContent;
            const priceElement = card.querySelector('.price');
            
            // Get price from element and convert to number
            let itemPrice;
            try {
                itemPrice = parseFloat(priceElement.dataset.price || priceElement.textContent.replace('$', ''));
                if (isNaN(itemPrice)) {
                    throw new Error('Invalid price');
                }
            } catch (error) {
                console.error('Error getting price:', error);
                Swal.fire({
                    title: "Error",
                    text: "Could not add item to cart",
                    icon: "error",
                    timer: 1000
                });
                return;
            }

            const itemId = card.dataset.productId || generateProductId(itemName);
            
            // Get cart from session storage
            let cart = sessionStorage.getItem("cart");
            let cartItems = [];
            
            if (cart !== undefined && cart !== null) {
                cartItems = JSON.parse(cart);
                
                // Check if item already exists in cart
                const existingItem = cartItems.find(item => item.id === itemId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    // Add new item
                    cartItems.push({
                        id: itemId,
                        name: itemName,
                        price: itemPrice,
                        quantity: 1
                    });
                }
            } else {
                // First item in cart
                cartItems.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
            }

            // Save updated cart
            sessionStorage.setItem("cart", JSON.stringify(cartItems));

            // Show success message
            Swal.fire({
                title: "Added to Cart",
                text: `${itemName}`,
                icon: "success",
                timer: 1000
            });
            
            // Visual feedback
            button.textContent = 'Added to Cart';
            button.disabled = true;
            
            // Reset button state
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.disabled = false;
            }, 2000);
        });
    });

    // Helper function to generate unique product IDs
    function generateProductId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    }

    // View cart functionality
    const viewCartButton = document.getElementById('view-cart');
    if (viewCartButton) {
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

        viewCartButton.addEventListener('click', function() {
            displayCart();
            cartModal.show();
        });
    }

    // Get the checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            Swal.fire({
                title: "Checkout Disabled",
                text: "Checkout is disabled for our touchstone project.",
                icon: "info",
                confirmButtonColor: "#790D1D"
            });
        });
    }

    // Clear cart functionality
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            Swal.fire({
                title: "Clear Cart?",
                text: "Are you sure you want to remove all items from your cart?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, clear it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear the cart in session storage
                    sessionStorage.removeItem("cart");
                    
                    // Update the cart display
                    displayCart();
                    
                    Swal.fire({
                        title: "Cart Cleared!",
                        text: "Your cart has been emptied.",
                        icon: "success",
                        timer: 1500
                    });
                }
            });
        });
    }
});

// Cart functions - defined outside DOMContentLoaded to be globally accessible
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let cartContent = '';
    let total = 0;

    // Get cart data
    let cart = sessionStorage.getItem("cart");
    
    if (!cart) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }

    // Parse cart data
    const cartItems = JSON.parse(cart);

    // Generate cart items HTML
    cartContent = `
        <table class="table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    cartItems.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        cartContent += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    });

    cartContent += `
            </tbody>
        </table>
    `;

    cartContainer.innerHTML = cartContent;
    cartTotalElement.textContent = total.toFixed(2);
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    let cart = JSON.parse(sessionStorage.getItem("cart"));
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        sessionStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    cart = cart.filter(item => item.id !== itemId);
    
    if (cart.length === 0) {
        sessionStorage.removeItem("cart");
    } else {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }
    
    displayCart();
}
