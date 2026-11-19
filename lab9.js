const products = [
    { id: 1, name: "Мэргэжлийн Yoyo", price: 180000, image: "img/yoyo1.png" },
    { id: 2, name: "Carbon Yoyo", price: 250000, image: "img/yoyo2.png" },
    { id: 3, name: "Titanium Yoyo", price: 300000, image: "img/yoyo3.png" },
    { id: 4, name: "Aether Pro", price: 350000, image: "img/yoyo4.png" },
    { id: 5, name: "Prism X", price: 300000, image: "img/yoyo5.png" },
    { id: 6, name: "Titan Elite", price: 320000, image: "img/yoyo6.png" },
    { id: 7, name: "Aurora", price: 280000, image: "img/yoyo7.png" },
    { id: 8, name: "Shadow Pro", price: 270000, image: "img/yoyo8.png" },
    { id: 9, name: "Nova X", price: 290000, image: "img/yoyo9.png" }
];

const grid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const priceFilter = document.querySelector("#priceFilter");
const sortSelect = document.querySelector("#sortSelect");
const productCount = document.querySelector("#productCount");
const cartList = document.querySelector("#cartList");
const cartTotal = document.querySelector("#cartTotal");
const themeToggle = document.querySelector("#themeToggle");

let cart = JSON.parse(localStorage.getItem("yoyoCart")) || [];

function formatPrice(price) {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
}

function getFilteredProducts() {
    let result = [...products];
    const query = searchInput.value.trim().toLowerCase();
    const price = priceFilter.value;

    if (query) {
        result = result.filter(product =>
            product.name.toLowerCase().includes(query)
        );
    }

    if (price !== "all") {
        const limit = Number(price);

        if (limit === 351) {
            result = result.filter(product => product.price > 300000);
        } else {
            result = result.filter(product => product.price <= limit * 1000);
        }
    }

    if (sortSelect.value === "low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sortSelect.value === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    return result;
}

function renderProducts() {
    const visibleProducts = getFilteredProducts();

    productCount.textContent = `${visibleProducts.length} бүтээгдэхүүн олдлоо`;

    grid.innerHTML = visibleProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <button type="button" data-add="${product.id}">
                Сагсанд нэмэх
            </button>
        </article>
    `).join("");
}

function saveCart() {
    localStorage.setItem("yoyoCart", JSON.stringify(cart));
}

function renderCart() {
    cartList.innerHTML = cart.map(item => `
        <li>
            <span>${item.name} × ${item.quantity}</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </li>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = formatPrice(total);
}

grid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const id = Number(button.dataset.add);
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
});

searchInput.addEventListener("input", renderProducts);
priceFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelector("#clearCart").addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
});

themeToggle.addEventListener("click", () => {
    const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("lab9Theme", nextTheme);
});

document.querySelector("#orderForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const error = document.querySelector("#formError");

    if (!cart.length) {
        error.textContent = "Эхлээд захиалгын сагсанд бараа нэмнэ үү.";
        return;
    }

    if (!form.checkValidity()) {
        error.textContent = "Нэр, утас, хаягийн мэдээллийг зөв бөглөнө үү.";
        form.reportValidity();
        return;
    }

    error.textContent = "";

    alert(
        `${document.querySelector("#customerName").value}-ийн захиалга амжилттай илгээгдлээ!`
    );

    form.reset();
    cart = [];
    saveCart();
    renderCart();
});

document.documentElement.dataset.theme =
    localStorage.getItem("lab9Theme") || "dark";

renderProducts();
renderCart();