let shoppingCart = document.getElementById("shopping-cart");
let label = document.querySelector(".label");

let basket = JSON.parse(localStorage.getItem("data")) || [];

// Produktdatat finns i variabeln shopData (se data.js)

const generateCartItems = () => {
  // Generera alla produkter med dynamisk HTML och Array.protype.map() samt join()
  if (basket.length !== 0) {
    return (shoppingCart.innerHTML = basket
      .map((product) => {
        let { id, item } = product;
        let search = shopData.find((x) => x.id === id) || [];
        return `
            <div class="cart-item">
                <img width="100" src=${search.image} alt="" />
            <div class="details">
                <div class="title-price-x">
                    <h4 class="title-price">
                        <p>${search.title}</p>
                        <p class="cart-item-price">${search.price}$</p>
                    </h4>
                    <i onclick="removeItem(${
                      search.id
                    })" class="bi bi-x-lg"></i>
                </div>
                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                    <div id=${id} class="quantity">${item}</div>
                    <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>
                <h3> ${item * search.price}$</h3>
            </div>
         </div>
            `;
      })
      .join(""));
  } else {
    shoppingCart.innerHTML = "";
    label.innerHTML = `
        <h2>Cart is empty</h2>
        <a href="index.html">
            <button class="homeBtn">back to homepage</button>
        </a>
        `;
  }
};

const increment = (id) => {
  // Om användaren klickar på + på produkten
  let search = basket.find((x) => x.id === id);
  if (search === undefined) {
    basket.push({
      id: id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  generateCartItems();
  updateCartItem(id);
  localStorage.setItem("data", JSON.stringify(basket));
};
const decrement = (id) => {
  // Om användaren klickar på - på produkten
  let search = basket.find((x) => x.id === id);
  if (search.item === 0) {
    return;
  } else {
    search.item -= 1;
  }
  updateCartItem(id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};
const updateCartItem = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  totalPrice();
  /* let total = 0
    for(let i = 0; i < basket.length; i++){
        const p = basket[i]
        total += p.item;
    }
    return total; */
};
const calculation = () => {
  let cartItem = document.getElementById("cartAmount");
  cartItem.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();

let removeItem = (id) => {
  let basketId = id;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].id === basketId) {
      basket.splice(i, 1);
      localStorage.setItem("data", JSON.stringify(basket));
    }
  }
  totalPrice();
  calculation();
  return generateCartItems();
};
const totalPrice = () => {
  let total = 0;
  basket.forEach((product) => {
    let { id, item } = product;
    let search = shopData.find((x) => x.id === id) || [];
    total = total + search.price * item;
    label.innerHTML = `
            <h3>Total bills :${total} $ </h3>
            <button class ="removeAll" onclick="clearCart()">Clear card</button>
            `;
  });
};
totalPrice();

const clearCart = () => {
  basket = [];
  calculation();
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

generateCartItems();
