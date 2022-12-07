// Les balises à récupérer pour changer la page
const cartList = document.getElementById("cart__items");
const cartQuantity = document.getElementById("totalQuantity");
const cartPrice = document.getElementById("totalPrice");

// Fonction qui se lance au chargement de la page
async function init() {
    const products = await getProducts()
    const cart = getCart();

    showCart(products, cart);
    createEvents();

    updateTotalQuantity(cart);
    updateTotalPrice(cart, products);
}

// Récupère les produits sur l'API
async function getProducts() {
    try {
        const products = await fetch("http://localhost:3000/api/products", { method: 'GET' })
        return products.json();
    }
    catch(e) {
        console.error(e);
    }
}

// Récupère le panier en LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

// Défini le panier dans le LocalStorage
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Affiche le panier sur la page HTML
function showCart(items, cart) {
    for (let i = 0; i < cart.length; i++) { // Affiche chaque produit
        const product = items.filter(product => product._id == cart[i].id);
        const productElement = document.createElement("article");
        productElement.setAttribute("class", "cart__item");
        productElement.setAttribute("data-id", product[0]._id);
        productElement.setAttribute("data-color", cart[i].color);
        productElement.innerHTML = `<div class="cart__item__img">
            <img src="${product[0].imageUrl}" alt="${product[0].altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>${product[0].name}</h2>
            <p>${cart[i].color}</p>
            <p>${product[0].price} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
            </div>
            </div>`
        cartList.appendChild(productElement);
    }
}

// Défini la quantité totale de produits dans le panier
function updateTotalQuantity(cart) {
    const totalQuantity = cart.reduce((accumulator, currentProduct) => accumulator + parseInt(currentProduct.quantity), 0);
    cartQuantity.innerHTML = `${totalQuantity}`;
}

// Défini le prix total du panier
function updateTotalPrice(cart, products) {
    let productPrice = [];
    for (let i = 0; i < cart.length; i++) {
        const product = products.filter(product => product._id == cart[i].id);
        productPrice.push(product[0].price * parseInt(cart[i].quantity));
    }
    const totalPrice = productPrice.reduce((accumulator, currentPrice) => accumulator + currentPrice, 0);
    cartPrice.innerHTML = `${totalPrice}`
}

// Crée les évènements sur les différents boutons
function createEvents() {

    // Balises des boutons/input ajoutés après le chargement de la page
    const quantityInputs = document.getElementsByClassName("itemQuantity");
    const deleteButtons = document.getElementsByClassName("deleteItem");

    // Changement quantité d'un produit
    for (i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', async function(event) {
            const element = event.target.closest("article.cart__item");

            const id = element.dataset.id;
            const color = element.dataset.color;
            let cart = getCart();
            const products = await getProducts();

            const product = cart.filter(product => id == product.id && color == product.color);
            const productIndex = cart.indexOf(product[0]);
            cart[productIndex].quantity = event.target.value;

            updateTotalQuantity(cart);
            updateTotalPrice(cart, products);
            setCart(cart);
        })
    }

    // Suppression d'un produit
    for (i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', async function(event) {
            const element = event.target.closest("article.cart__item");

            const id = element.dataset.id;
            const color = element.dataset.color;
            let cart = getCart();
            const products = await getProducts();

            const product = cart.filter(product => id == product.id && color == product.color);
            const productIndex = cart.indexOf(product[0]);
            cart.splice(productIndex, 1);

            updateTotalQuantity(cart);
            updateTotalPrice(cart, products);
            setCart(cart);

            element.remove();
        })
    }

}

(async() => { await init() })();