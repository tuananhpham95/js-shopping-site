const shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];
const categories = document.getElementById("categories");

// Produktdatat finns i variabeln shopData (se data.js)
function generateShopHTML(product) {
  let { id, image, description, title, price } = product;
  let search = basket.find((x) => x.id === id) || {};

  return `
    <div id="product-id-${id}" class="item">
      <img width="220" src="${image}" alt=""> 
      <div class="details">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="price-quantity">
          <h2>${price}</h2>
          <div class="buttons">
            <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
            <div id="${id}" class="quantity">${
    search.item === undefined ? 0 : search.item
  }</div>
            <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          </div>
        </div>
      </div>
    </div>`;
}
const generateShop = () => {
  // Generera alla produkter med dynamisk HTML och Array.protype.map() samt join()
  shop.innerHTML = shopData
    .map((product) => generateShopHTML(product))
    .join("");
};

generateShop();

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
  /* let cartItem = document.getElementById('cartAmount');
    cartItem.innerHTML = updateCartItem(id); */
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
  localStorage.setItem("data", JSON.stringify(basket));
};
const updateCartItem = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
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

let productCategories = [
  ...new Set(shopData.map((product) => product.category)),
];

function generateCategoryButtons() {
  let buttonsContainer = document.getElementById("categories");
  //skapa en knapp för alla categories
  let allCategoriesButton = document.createElement("button");
  allCategoriesButton.innerText = "All categories";
  allCategoriesButton.addEventListener("click", function () {
    filterProducts("All categories");
  });
  buttonsContainer.appendChild(allCategoriesButton);

  // Skapa en knapp för varje kategori
  productCategories.forEach(function (category) {
    let button = document.createElement("button");
    button.innerText = category;
    button.addEventListener("click", function () {
      filterProducts(category);
    });
    buttonsContainer.appendChild(button);
  });
}

function filterProducts(category) {
  let productListContainer = document.getElementById("shop");

  // Rensa befintliga produkter
  productListContainer.innerHTML = "";

  // Filtrera produkter baserat på kategori
  let filteredProducts =
    category === "All categories"
      ? shopData
      : shopData.filter(function (product) {
          return product.category === category;
        });

  // Skapa element för filtrerade produkter
  filteredProducts.forEach(function (product) {
    let productElement = document.createElement("div");

    productElement.innerHTML = generateShopHTML(product);
    productListContainer.appendChild(productElement);
  });
}

generateCategoryButtons();
