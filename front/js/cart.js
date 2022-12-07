// Valeurs
let totalQuantity = 0;
let totalPrice = 0;


// Les balises à récupérer pour changer la page
const cartList = document.getElementById("cart__items");
const cartQuantity = document.getElementById("totalQuantity");
const cartPrice = document.getElementById("totalPrice");


// Récupère les produits et le panier pour afficher la liste
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    const cart = getCart();

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

        totalQuantity += parseInt(cart[i].quantity);
        totalPrice += (product[0].price * cart[i].quantity);
    }

    setTotalQuantity(totalQuantity);
    setTotalPrice(totalPrice);
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});


// Seulement à executer quand la fenêtre a fini de charger
window.addEventListener('load', function () {

    // Balises des boutons/input ajoutés après le chargement de la page
    const quantityInputs = document.getElementsByClassName("itemQuantity");
    const deleteButtons = document.getElementsByClassName("deleteItem");

    // Changement quantité d'un produit
    for (i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', function(event) {
            const element = event.target.closest("article.cart__item");

            const id = element.dataset.id;
            const color = element.dataset.color;
            let cart = getCart();

            const product = cart.filter(product => id == product.id && color == product.color);
            const productIndex = cart.indexOf(product[0]);
            cart[productIndex].quantity = event.target.value;

            setCart(cart);
        })
    }

    // Suppression d'un produit
    for (i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function(event) {
            const element = event.target.closest("article.cart__item");

            const id = element.dataset.id;
            const color = element.dataset.color;
            let cart = getCart();

            const product = cart.filter(product => id == product.id && color == product.color);
            const productIndex = cart.indexOf(product[0]);
            cart.splice(productIndex, 1);
            setCart(cart);

            element.remove();
        })
    }

});


// Récupère le panier en LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

// Défini le panier dans le LocalStorage
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Défini le prix total du panier
function setTotalPrice(price) {
    cartPrice.innerHTML = `${price}`
}

// Défini la quantité totale de produits dans le panier
function setTotalQuantity(quantity) {
    cartQuantity.innerHTML = `${quantity}`
}