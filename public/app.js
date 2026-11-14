const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const cart = new Map();
let products = [];
let activeCategory = "Semua";

const rupiah = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Gagal memuat produk");
    products = await response.json();
    renderProducts();
  } catch {
    grid.innerHTML = '<p class="loading">Produk belum dapat dimuat. Coba segarkan halaman.</p>';
  }
}

function renderProducts() {
  const shown = activeCategory === "Semua" ? products : products.filter(p => p.category === activeCategory);
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-art">${p.emoji}</div>
      <div class="product-info">
        <small>${p.category.toUpperCase()}</small>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-bottom"><span class="price">${rupiah(p.price)}</span>
          <button class="add-button" data-add="${p.id}" aria-label="Tambah ${p.name}">+</button>
        </div>
      </div>
    </article>`).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addToCart(Number(btn.dataset.add))));
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("Ditambahkan ke keranjang 🐾");
}
function changeQty(id, amount) {
  const next = (cart.get(id) || 0) + amount;
  if (next <= 0) cart.delete(id); else cart.set(id, next);
  renderCart();
}
function renderCart() {
  const count = [...cart.values()].reduce((a,b) => a+b, 0);
  const total = products.filter(p => cart.has(p.id)).reduce((sum,p) => sum + p.price * cart.get(p.id), 0);
  cartCount.textContent = count;
  cartTotal.textContent = rupiah(total);
  if (!count) {
    cartItems.innerHTML = '<p class="empty">Keranjangmu masih kosong. Yuk pilih kebutuhan si manis!</p>';
    return;
  }
  cartItems.innerHTML = products.filter(p => cart.has(p.id)).map(p => `
    <div class="cart-row"><div class="cart-emoji">${p.emoji}</div>
      <div><b>${p.name}</b><small>${rupiah(p.price)} / item</small></div>
      <div class="qty"><button data-minus="${p.id}" aria-label="Kurangi">−</button><b>${cart.get(p.id)}</b><button data-plus="${p.id}" aria-label="Tambah">+</button></div>
    </div>`).join("");
  cartItems.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.minus), -1)));
  cartItems.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.plus), 1)));
}
function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
  renderProducts();
});
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", async () => {
  if (!cart.size) return showToast("Keranjang masih kosong.");
  const items = [...cart.entries()].map(([productId, quantity]) => ({ productId, quantity }));
  try {
    const response = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Pesanan gagal dibuat");
    showToast(`Pesanan demo ${result.orderId} berhasil dibuat!`);
    cart.clear(); renderCart();
    setTimeout(closeCart, 900);
  } catch (error) { showToast(error.message); }
});

loadProducts();
