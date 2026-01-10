const SHOP = {
  name: "همشهری استور",
  tagline: "۷ سال اعتماد سازی",
  currency: "AF",
  whatsappNumber: "93783019744"
};

const PRODUCTS = [
  { id: 1, title: "60 UC",   price: 65,   desc: "UC پابجی موبایل" },
  { id: 2, title: "325 UC",  price: 310,  desc: "UC پابجی موبایل" },
  { id: 3, title: "660 UC",  price: 610,  desc: "UC پابجی موبایل" },
  { id: 4, title: "1800 UC", price: 1520, desc: "UC پابجی موبایل" },
  { id: 5, title: "3850 UC", price: 2950, desc: "UC پابجی موبایل" }
];

const $ = (id) => document.getElementById(id);
const formatMoney = (n) => `${Number(n).toLocaleString("fa-IR")} ${SHOP.currency}`;

const CART_KEY = "hamshahri_store_cart_v2";
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function cartCount(c){ return c.reduce((s,it)=>s+it.qty,0); }

let cart = loadCart();

function waUrl(text){
  return `https://wa.me/${SHOP.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function renderHeader(){
  const link = waUrl("سلام! برای خرید UC پابجی پیام می‌دم.");
  $("waLink").href = link;
  const wa2 = document.getElementById("waLink2");
  if (wa2) wa2.href = link;

  $("cartCount").textContent = cartCount(cart);
}

function renderProducts(list){
  const wrap = $("products");
  wrap.innerHTML = "";
  list.forEach(p=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="title">${p.title}</div>
      <div class="desc">${p.desc || ""}</div>
      <div class="priceRow">
        <b>${formatMoney(p.price)}</b>
        <span class="muted" style="font-size:12px;">آنلاین</span>
      </div>
      <button class="btn btnPrimary">افزودن به سبد</button>
    `;
    div.querySelector("button").addEventListener("click", ()=>addToCart(p.id));
    wrap.appendChild(div);
  });
}

function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }

function addToCart(productId){
  const found = cart.find(x=>x.productId===productId);
  if(found) found.qty += 1;
  else cart.push({ productId, qty: 1 });
  saveCart(cart);
  $("cartCount").textContent = cartCount(cart);
  renderCart();
}

function removeFromCart(productId){
  cart = cart.filter(x=>x.productId!==productId);
  saveCart(cart);
  $("cartCount").textContent = cartCount(cart);
  renderCart();
}

function changeQty(productId, delta){
  const item = cart.find(x=>x.productId===productId);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  $("cartCount").textContent = cartCount(cart);
  renderCart();
}

function renderCart(){
  const wrap = $("cartItems");
  wrap.innerHTML = "";
  let total = 0;

  cart.forEach(it=>{
    const p = getProduct(it.productId);
    if(!p) return;
    const line = p.price * it.qty;
    total += line;

    const row = document.createElement("div");
    row.className = "cartItem";
    row.innerHTML = `
      <div>
        <div><b>${p.title}</b></div>
        <div class="muted small">${formatMoney(p.price)} × ${it.qty} = ${formatMoney(line)}</div>
      </div>
      <div class="qty">
        <button class="btn btnGhost">+</button>
        <button class="btn btnGhost">-</button>
        <button class="btn" style="background:#b00020;color:#fff;">حذف</button>
      </div>
    `;
    const [plus, minus, del] = row.querySelectorAll("button");
    plus.addEventListener("click", ()=>changeQty(it.productId, +1));
    minus.addEventListener("click", ()=>changeQty(it.productId, -1));
    del.addEventListener("click", ()=>removeFromCart(it.productId));
    wrap.appendChild(row);
  });

  $("totalPrice").textContent = formatMoney(total);
}

function openDrawer(){
  $("drawer").classList.remove("hidden");
  $("drawerOverlay").classList.remove("hidden");
  renderCart();
}
function closeDrawer(){
  $("drawer").classList.add("hidden");
  $("drawerOverlay").classList.add("hidden");
}

function checkoutWhatsApp(){
  $("msg").textContent = "";

  const name = $("custName").value.trim();
  const phone = $("custPhone").value.trim();
  const pubgId = $("pubgId").value.trim();
  const note = $("note").value.trim();

  if(!name || !phone || !pubgId){
    $("msg").textContent = "نام، شماره تماس و UID را کامل کن.";
    return;
  }
  if(cart.length === 0){
    $("msg").textContent = "سبد خرید خالی است.";
    return;
  }

  let total = 0;
  const lines = cart.map(it=>{
    const p = getProduct(it.productId);
    const line = p.price * it.qty;
    total += line;
    return `• ${p.title} | تعداد: ${it.qty} | قیمت: ${formatMoney(p.price)}`;
  });

  const text =
`سلام! سفارش جدید UC پابجی:

نام: ${name}
شماره: ${phone}
PUBG UID: ${pubgId}
توضیحات: ${note || "-"}

اقلام:
${lines.join("\n")}

جمع کل: ${formatMoney(total)}`;

  window.open(waUrl(text), "_blank");
}

// Events
$("cartBtn").addEventListener("click", openDrawer);
$("closeDrawer").addEventListener("click", closeDrawer);
$("drawerOverlay").addEventListener("click", closeDrawer);
$("checkoutBtn").addEventListener("click", checkoutWhatsApp);

const scrollBtn = document.getElementById("scrollToProducts");
if (scrollBtn){
  scrollBtn.addEventListener("click", ()=>{
    document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
  });
}

$("search").addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => (p.title + " " + (p.desc||"")).toLowerCase().includes(q));
  renderProducts(filtered);
});

// Init
renderHeader();
renderProducts(PRODUCTS);
renderCart();
