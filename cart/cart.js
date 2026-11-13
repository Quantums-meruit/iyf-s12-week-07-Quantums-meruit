const STORAGE_KEY = "iyf-week7-shopping-cart";

const products = [
  { id: 1, name: "Notebook", description: "A5 ruled notebook", price: 250, icon: "📓" },
  { id: 2, name: "Pen set", description: "Pack of three blue pens", price: 120, icon: "🖊️" },
  { id: 3, name: "Desk plant", description: "A small plant for your workspace", price: 450, icon: "🪴" },
  { id: 4, name: "Tea leaves", description: "250g packet", price: 180, icon: "🍃" },
];

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!Array.isArray(savedCart)) {
      return [];
    }

    return savedCart.filter(
      (item) =>
        products.some((product) => product.id === item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

let state = { cart: loadCart() };
const listeners = [];

const productList = document.querySelector("#product-list");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const cartMessage = document.querySelector("#cart-message");

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  listeners.forEach((listener) => listener(state));
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    return true;
  } catch {
    return false;
  }
}

function updateCart(nextCart, message = "") {
  state = { ...state, cart: nextCart };
  const saved = saveCart();
  cartMessage.textContent = saved
    ? message
    : `${message} Changes could not be saved in this browser.`;
  notify();
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartCount() {
  return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + product.price * item.quantity;
  }, 0);
}

function renderProducts() {
  productList.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const icon = document.createElement("span");
    icon.className = "product-icon";
    icon.textContent = product.icon;
    icon.setAttribute("aria-hidden", "true");

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = currency.format(product.price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-button";
    addButton.dataset.action = "add";
    addButton.dataset.productId = product.id;
    addButton.textContent = "Add";

    footer.append(price, addButton);
    card.append(icon, name, description, footer);
    productList.appendChild(card);
  });
}

function renderCart() {
  cartItems.replaceChildren();

  if (state.cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty";
    emptyMessage.textContent = "Your cart is empty. Add a product to get started.";
    cartItems.appendChild(emptyMessage);
  }

  state.cart.forEach((item) => {
    const product = getProduct(item.productId);
    const row = document.createElement("article");
    row.className = "cart-row";

    const details = document.createElement("div");
    const name = document.createElement("p");
    name.className = "cart-product-name";
    name.textContent = product.name;

    const linePrice = document.createElement("span");
    linePrice.className = "cart-line-price";
    linePrice.textContent = `${currency.format(product.price)} each · ${currency.format(product.price * item.quantity)}`;

    details.append(name, linePrice);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.className = "quantity-button";
    decreaseButton.dataset.action = "decrease";
    decreaseButton.dataset.productId = item.productId;
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Decrease ${product.name} quantity`);

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.className = "quantity-button";
    increaseButton.dataset.action = "increase";
    increaseButton.dataset.productId = item.productId;
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${product.name} quantity`);

    controls.append(decreaseButton, quantity, increaseButton);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.productId = item.productId;
    removeButton.textContent = "Remove";

    row.append(details, controls, removeButton);
    cartItems.appendChild(row);
  });

  const count = getCartCount();
  cartCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  cartTotal.textContent = currency.format(getCartTotal());
  clearCartButton.disabled = count === 0;
}

function handleCartAction(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;
  const currentCart = state.cart;

  if (action === "add") {
    const existingItem = currentCart.find((item) => item.productId === productId);
    const nextCart = existingItem
      ? currentCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...currentCart, { productId, quantity: 1 }];

    updateCart(nextCart, "Product added to your cart.");
  }

  if (action === "increase" || action === "decrease") {
    const nextCart = currentCart
      .map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const quantity = action === "increase"
          ? item.quantity + 1
          : item.quantity - 1;

        return { ...item, quantity };
      })
      .filter((item) => item.quantity > 0);

    updateCart(nextCart, "Cart quantity updated.");
  }

  if (action === "remove") {
    updateCart(
      currentCart.filter((item) => item.productId !== productId),
      "Product removed from your cart.",
    );
  }
}

productList.addEventListener("click", handleCartAction);
cartItems.addEventListener("click", handleCartAction);

clearCartButton.addEventListener("click", () => {
  updateCart([], "Your cart has been cleared.");
});

subscribe(renderCart);
renderProducts();
renderCart();
