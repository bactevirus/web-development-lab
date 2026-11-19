const items = [
    { id: 1, name: "Гэрийн үндсэн шүүлтүүр", type: "ГЭРИЙН СИСТЕМ", category: "home", price: 289000, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=700&q=82", tag: "ОНЦЛОХ" },
    { id: 2, name: "Ундны усны осмос систем", type: "УНДНЫ УС", category: "drink", price: 425000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=700&q=82", tag: "ШИНЭ" },
    { id: 3, name: "Нүүрсэн блок шүүлтүүр", type: "СОЛИХ ШҮҮЛТҮҮР", category: "replacement", price: 68000, image: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=700&q=82", tag: "" },
    { id: 4, name: "Гал тогооны усны шүүлтүүр", type: "УНДНЫ УС", category: "drink", price: 179000, image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=700&q=82", tag: "ОЛОН СОНГОЛТ" }
];

const productGrid = document.querySelector("#productGrid");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const drawerCount = document.querySelector("#drawerCount");
const cartTotal = document.querySelector("#cartTotal");
const drawer = document.querySelector("#cartDrawer");
const scrim = document.querySelector("#drawerScrim");
const toast = document.querySelector("#toast");
const money = amount => `${new Intl.NumberFormat("mn-MN").format(amount)}₮`;
let cart = [];
let selectedCategory = "all";
let query = "";
let toastTimer;

try {
    const savedCart = JSON.parse(localStorage.getItem("tungalaaCart") || "[]");
    cart = savedCart.map(saved => {
        const item = items.find(product => product.id === saved.id);
        return item && Number.isInteger(saved.quantity) && saved.quantity > 0
            ? { ...item, quantity: saved.quantity }
            : null;
    }).filter(Boolean);
} catch (error) {
    localStorage.removeItem("tungalaaCart");
}

function renderProducts() {
    let visible = items.filter(item => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesQuery = item.name.toLocaleLowerCase("mn").includes(query);
        return matchesCategory && matchesQuery;
    });

    const sort = document.querySelector("#sortSelect").value;
    if (sort === "low") visible.sort((a, b) => a.price - b.price);
    if (sort === "high") visible.sort((a, b) => b.price - a.price);

    productGrid.innerHTML = visible.length ? visible.map((item, index) => `
        <article class="product-card reveal is-visible" style="transition-delay:${index * 70}ms">
            <div class="product-visual">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${item.tag ? `<span class="product-tag">${item.tag}</span>` : ""}
                <button class="quick-add" type="button" data-add="${item.id}">Сагсанд нэмэх <span>＋</span></button>
            </div>
            <div class="product-details">
                <div class="product-meta"><span>${item.type}</span><span>№ 0${item.id}</span></div>
                <h3>${item.name}</h3>
                <p class="product-price">${money(item.price)}</p>
            </div>
        </article>
    `).join("") : `<p class="no-results">Таны хайлтад тохирох бүтээгдэхүүн олдсонгүй.</p>`;
    document.querySelector("#productCount").textContent = `${visible.length} бүтээгдэхүүн`;
}

function saveCart() {
    localStorage.setItem("tungalaaCart", JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))));
}

function renderCart() {
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = quantity;
    drawerCount.textContent = `(${quantity})`;
    cartTotal.textContent = money(total);
    cartItems.innerHTML = cart.length ? cart.map(item => `
        <li class="cart-line">
            <img src="${item.image}" alt="">
            <div>
                <h3>${item.name}</h3>
                <p>${money(item.price)}</p>
                <div class="quantity-control">
                    <button type="button" data-quantity="-1" data-id="${item.id}" aria-label="Тоо ширхэг хасах">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-quantity="1" data-id="${item.id}" aria-label="Тоо ширхэг нэмэх">+</button>
                </div>
            </div>
            <strong>${money(item.price * item.quantity)}</strong>
        </li>
    `).join("") : `<li class="drawer-empty">Таны сагс одоогоор хоосон байна.</li>`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openDrawer() {
    drawer.classList.add("open");
    scrim.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeDrawer() {
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const item = items.find(product => product.id === Number(button.dataset.add));
    const existing = cart.find(product => product.id === item.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    saveCart();
    renderCart();
    showToast(`${item.name} сагсанд нэмэгдлээ`);
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-quantity]");
    if (!button) return;
    const item = cart.find(product => product.id === Number(button.dataset.id));
    item.quantity += Number(button.dataset.quantity);
    cart = cart.filter(product => product.quantity > 0);
    saveCart();
    renderCart();
});

document.querySelector("#cartTrigger").addEventListener("click", openDrawer);
document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);
document.querySelector("#clearCart").addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
});
document.querySelector("#checkoutButton").addEventListener("click", () => {
    if (!cart.length) {
        showToast("Захиалахын өмнө сагсандаа бүтээгдэхүүн нэмнэ үү.");
        return;
    }
    closeDrawer();
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    showToast("Захиалгаа баталгаажуулахын тулд мэдээллээ үлдээнэ үү.");
});

document.querySelector("#searchToggle").addEventListener("click", () => {
    const panel = document.querySelector("#searchPanel");
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) document.querySelector("#searchInput").focus();
});
document.querySelector("#searchPanel").addEventListener("submit", event => {
    event.preventDefault();
    query = document.querySelector("#searchInput").value.trim().toLocaleLowerCase("mn");
    selectedCategory = "all";
    renderProducts();
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
    document.querySelector("#searchPanel").classList.remove("open");
});
document.querySelector("#sortSelect").addEventListener("change", renderProducts);
document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", () => {
        selectedCategory = link.dataset.category;
        query = "";
        document.querySelector("#searchInput").value = "";
        renderProducts();
    });
});
document.querySelector("#menuToggle").addEventListener("click", event => {
    const button = event.currentTarget;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    document.querySelector(".main-nav").classList.toggle("open", !expanded);
});
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("open");
    document.querySelector("#menuToggle").setAttribute("aria-expanded", "false");
}));

document.querySelector("#contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    document.querySelector("#formMessage").textContent = "Баярлалаа! Тун удахгүй тантай холбогдоно.";
    form.reset();
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const start = performance.now();
        const duration = 1400;
        const tick = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.round(target * eased).toLocaleString("mn-MN") + "+";
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(element);
    });
}, { threshold: 0.7 });
document.querySelectorAll("[data-count]").forEach(element => counterObserver.observe(element));

const header = document.querySelector(".header");
const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

renderProducts();
renderCart();
