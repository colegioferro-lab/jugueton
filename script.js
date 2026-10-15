const products = [
  {id:1,name:"Osito Nube",category:"Peluches",price:54900,tag:"MÁS AMADO",rating:"★ 4.9",color:"#f6d9bd",image:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Carrito Turbo",category:"Carros",price:39900,tag:"VELOCIDAD",rating:"★ 4.8",color:"#c8e9ef",image:"https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"Bloques Creativos",category:"Educativos",price:79900,tag:"APRENDE JUGANDO",rating:"★ 5.0",color:"#f8df76",image:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Unicornio Mágico",category:"Muñecos",price:62900,tag:"NUEVO",rating:"★ 4.9",color:"#e6d9ff",image:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Rompecabezas Color",category:"Juegos",price:45900,tag:"MENTES CURIOSAS",rating:"★ 4.7",color:"#d1eed8",image:"https://images.unsplash.com/photo-1606503153255-59d8b8b821b2?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Cohete Explorador",category:"Educativos",price:89900,tag:"¡AL ESPACIO!",rating:"★ 4.8",color:"#d1e4fb",image:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Perrito Abrazable",category:"Peluches",price:49900,tag:"SUAVE SUAVE",rating:"★ 4.9",color:"#f5d6d2",image:"https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Juego ¡Qué Risa!",category:"Juegos",price:69900,tag:"PARA COMPARTIR",rating:"★ 4.8",color:"#d9e8ad",image:"https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=700&q=85"}
];
const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
let activeCategory = "Todos";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("jugueton-cart") || "{}");
const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultsLabel = document.getElementById("resultsLabel");
const toast = document.getElementById("toast");

function getVisibleProducts(){
  let list = products.filter(p => (activeCategory === "Todos" || p.category === activeCategory) && (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
  const sort = document.getElementById("sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
  return list;
}
function renderProducts(){
  const list = getVisibleProducts();
  grid.innerHTML = list.map((p,i)=>`<article class="product-card" style="animation-delay:${i*45}ms">
    <div class="product-image" style="background:${p.color}">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;display:grid;place-items:center;height:100%;font-size:78px&quot;>🧸</span>')">
      <span class="product-tag">${p.tag}</span>
      <button class="quick-add" data-add="${p.id}" aria-label="Añadir ${p.name} al carrito">+</button>
    </div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><span class="rating">${p.rating}</span></div></div>
  </article>`).join("");
  emptyState.hidden = list.length > 0;
  resultsLabel.textContent = `${list.length} ${list.length===1?"juguete encontrado":"juguetes para descubrir"}`;
}
function saveCart(){localStorage.setItem("jugueton-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();showToast("¡Buena elección! Añadido a tu bolsa 💛")}
function renderCart(){
  const entries=Object.entries(cart).filter(([id,q])=>q>0);
  const count=entries.reduce((sum,[id,q])=>sum+q,0);
  const subtotal=entries.reduce((sum,[id,q])=>sum+products.find(p=>p.id===Number(id)).price*q,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerCount").textContent=`(${count})`;
  document.getElementById("cartSubtotal").textContent=money(subtotal);
  document.getElementById("cartEmpty").style.display=entries.length?"none":"block";
  document.getElementById("cartFooter").style.display=entries.length?"block":"none";
  document.getElementById("cartItems").innerHTML=entries.map(([id,q])=>{const p=products.find(x=>x.id===Number(id));return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><span class="item-price">${money(p.price)}</span><div class="qty-controls"><button data-qty="${id}" data-change="-1" aria-label="Quitar uno">−</button><span>${q}</span><button data-qty="${id}" data-change="1" aria-label="Añadir uno">+</button></div></div><button class="remove-item" data-remove="${id}" aria-label="Eliminar ${p.name}">✕</button></div>`}).join("");
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("drawerBackdrop").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("drawerBackdrop").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
grid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add))});
document.getElementById("cartItems").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty){const id=qty.dataset.qty;cart[id]=(cart[id]||0)+Number(qty.dataset.change);if(cart[id]<=0)delete cart[id];saveCart()}if(remove){delete cart[remove.dataset.remove];saveCart()}});
document.querySelectorAll(".category-pill").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;document.querySelectorAll(".category-pill").forEach(b=>b.classList.toggle("active",b===btn));renderProducts()}));
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts()});
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast("¡Pronto podrás completar tu compra! Esta es una demo 😊"));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
window.addEventListener("scroll",()=>{const photo=document.querySelector(".parallax-photo");if(photo){const rect=photo.parentElement.getBoundingClientRect();const shift=Math.max(-35,Math.min(35,(window.innerHeight/2-rect.top)*.07));photo.style.setProperty("--parallax-y",`${shift}px`)}},{passive:true});
renderProducts();renderCart();
