// ===============================
// GLOBAL VARIABLES
// ===============================

let products = [];
let cart = [];


// ===============================
// LOAD PRODUCTS FROM FLASK API
// ===============================

async function loadProducts() {

    const grid = document.getElementById("products-grid");

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        console.error("Could not load products:", error);

        grid.innerHTML = `
            <div class="loading">
                <i class="fa-solid fa-circle-exclamation"></i>
                Unable to load products.
            </div>
        `;
    }
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(productList) {

    const grid = document.getElementById("products-grid");

    if (!productList || productList.length === 0) {

        grid.innerHTML = `
            <div class="loading">
                No products found.
            </div>
        `;

        return;
    }


    grid.innerHTML = productList.map(product => {

        const icon = getProductIcon(product.name);

        return `
            <div class="product-card">

                <div class="product-image">
                    <i class="${icon}"></i>
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${getProductCategory(product.name)}
                    </span>

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="product-price">
                        ₹${formatPrice(product.price)}
                    </div>

                    <div class="product-stock">
                        <i class="fa-solid fa-box"></i>
                        ${product.stock} available
                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


// ===============================
// PRODUCT ICON
// ===============================

function getProductIcon(name) {

    const productName = name.toLowerCase();

    if (productName.includes("laptop")) {
        return "fa-solid fa-laptop";
    }

    if (
        productName.includes("phone") ||
        productName.includes("mobile")
    ) {
        return "fa-solid fa-mobile-screen-button";
    }

    if (
        productName.includes("headphone") ||
        productName.includes("earphone")
    ) {
        return "fa-solid fa-headphones";
    }

    if (
        productName.includes("keyboard") ||
        productName.includes("mouse")
    ) {
        return "fa-solid fa-keyboard";
    }

    if (productName.includes("camera")) {
        return "fa-solid fa-camera";
    }

    if (productName.includes("watch")) {
        return "fa-solid fa-clock";
    }

    return "fa-solid fa-box";
}


// ===============================
// PRODUCT CATEGORY
// ===============================

function getProductCategory(name) {

    const productName = name.toLowerCase();

    if (productName.includes("laptop")) {
        return "Electronics";
    }

    if (
        productName.includes("phone") ||
        productName.includes("mobile")
    ) {
        return "Mobile";
    }

    if (
        productName.includes("headphone") ||
        productName.includes("earphone")
    ) {
        return "Audio";
    }

    if (
        productName.includes("keyboard") ||
        productName.includes("mouse")
    ) {
        return "Accessories";
    }

    return "Product";
}


// ===============================
// SEARCH PRODUCTS
// ===============================

function searchProducts() {

    const searchInput =
        document.getElementById("search-input");

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    if (searchTerm === "") {

        displayProducts(products);

        return;
    }


    const filteredProducts = products.filter(product =>
        product.name
            .toLowerCase()
            .includes(searchTerm)
    );


    displayProducts(filteredProducts);
}


// ===============================
// CATEGORY FILTER
// ===============================

function filterCategory(category) {

    let filteredProducts = products;


    if (category === "electronics") {

        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes("laptop")
        );

    }

    else if (category === "mobile") {

        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes("phone")
        );

    }

    else if (category === "audio") {

        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes("headphone") ||
            product.name.toLowerCase().includes("earphone")
        );

    }

    else if (category === "accessories") {

        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes("keyboard") ||
            product.name.toLowerCase().includes("mouse")
        );

    }


    displayProducts(filteredProducts);


    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }


    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showToast("Maximum available stock reached");
            return;
        }

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    updateCart();

    showToast(`${product.name} added to cart`);
}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();
}


// ===============================
// CHANGE CART QUANTITY
// ===============================

function changeQuantity(productId, change) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    if (item.quantity > item.stock) {

        item.quantity = item.stock;

        showToast("Maximum stock reached");
    }


    updateCart();
}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");


    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    const totalPrice = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * item.quantity,
        0
    );


    cartCount.textContent = totalItems;

    cartTotal.textContent =
        `₹${formatPrice(totalPrice)}`;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>Add products to get started.</p>

            </div>
        `;

        return;
    }


    cartItems.innerHTML = cart.map(item => {

        const icon = getProductIcon(item.name);

        return `
            <div class="cart-item">

                <div class="cart-item-icon">
                    <i class="${icon}"></i>
                </div>

                <div class="cart-item-info">

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <p>
                        ₹${formatPrice(item.price)}
                    </p>

                    <div class="cart-controls">

                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart(${item.id})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


// ===============================
// OPEN CART
// ===============================

function openCart() {

    document
        .getElementById("cart-sidebar")
        .classList.add("active");

    document
        .getElementById("cart-overlay")
        .classList.add("active");
}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {

    document
        .getElementById("cart-sidebar")
        .classList.remove("active");

    document
        .getElementById("cart-overlay")
        .classList.remove("active");
}


// ===============================
// CHECKOUT
// ===============================

function openCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty");

        return;
    }


    document
        .getElementById("checkout-modal")
        .classList.add("active");
}


function closeCheckout() {

    document
        .getElementById("checkout-modal")
        .classList.remove("active");
}


// ===============================
// COMPLETE CHECKOUT
// ===============================

function completeCheckout(event) {

    event.preventDefault();


    cart = [];

    updateCart();

    closeCheckout();

    closeCart();

    showToast("Order placed successfully!");
}


// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toast-message");


    toastMessage.textContent = message;

    toast.classList.add("active");


    setTimeout(() => {

        toast.classList.remove("active");

    }, 2500);
}


// ===============================
// PRICE FORMAT
// ===============================

function formatPrice(price) {

    return Number(price).toLocaleString("en-IN");
}


// ===============================
// HTML SECURITY
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// START APPLICATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

        updateCart();

    }
);
