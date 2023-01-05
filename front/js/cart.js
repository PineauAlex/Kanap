// Les balises à récupérer pour changer la page
const cartList = document.getElementById("cart__items");
const cartQuantity = document.getElementById("totalQuantity");
const cartPrice = document.getElementById("totalPrice");

const orderForm = document.getElementsByClassName("cart__order__form")[0];

const formFirstName = document.getElementById("firstName");
const formLastName = document.getElementById("lastName");
const formAddress = document.getElementById("address");
const formCity = document.getElementById("city");
const formEmail = document.getElementById("email");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const orderButton = document.getElementById("order");
const orderButtonBox = document.getElementsByClassName("cart__order__form__submit")[0];

const emptyCart = document.createElement("p");
orderButtonBox.after(emptyCart);


// Valeurs boolean pour le formulaire
let firstNameIsValid = false;
let lastNameIsValid = false;
let addressIsValid = false;
let cityIsValid = false;
let emailIsValid = false;


// Fonction qui se lance au chargement de la page
async function init() {
    const products = await getProducts()
    const cart = getCart();

    if (cart != null) {
        showCart(products, cart);
        createProductEvents();
    }
    createFormEvents();
    
    updateTotalQuantity(cart);
    updateTotalPrice(cart, products);

    orderForm.reset();
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
    let totalQuantity;
    if (cart == null) {
        totalQuantity = 0;
    }
    else {
        totalQuantity = cart.reduce((accumulator, currentProduct) => accumulator + parseInt(currentProduct.quantity), 0);
    }
    cartQuantity.innerHTML = `${totalQuantity}`;
}

// Défini le prix total du panier
function updateTotalPrice(cart, products) {
    let productPrice = [];
    let totalPrice;
    if (cart != null) {
        for (let i = 0; i < cart.length; i++) {
            const product = products.filter(product => product._id == cart[i].id);
            productPrice.push(product[0].price * parseInt(cart[i].quantity));
        }
        totalPrice = productPrice.reduce((accumulator, currentPrice) => accumulator + currentPrice, 0);
    }
    else {
        totalPrice = 0;
    }
    cartPrice.innerHTML = `${totalPrice}`
}

function updateOrderButton() {
    if (firstNameIsValid && lastNameIsValid && addressIsValid && cityIsValid && emailIsValid) {
        orderButton.removeAttribute("disabled");
    }
    else {
        orderButton.setAttribute("disabled", "true");
    }
}

// Crée les évènements sur les différents éléments
function createProductEvents() {

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

            updateOrderButton();
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

            updateOrderButton();
        })
    }

}

// Crée les évènements pour le formulaire
function createFormEvents() {

    // Formulaire
    formFirstName.addEventListener('input', function(event) {
        const input = event.target.value;
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]{2,}$/.test(input)) {
            firstNameErrorMsg.innerHTML = ``;
            firstNameIsValid = true;
        }
        else {
            firstNameErrorMsg.innerHTML = `Prénom invalide !`;
            firstNameIsValid = false;
        }
        updateOrderButton();
    });

    formLastName.addEventListener('input', function(event) {
        const input = event.target.value;
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]{2,}$/.test(input)) {
            lastNameErrorMsg.innerHTML = ``;
            lastNameIsValid = true;
        }
        else {
            lastNameErrorMsg.innerHTML = `Nom invalide !`;
            lastNameIsValid = false;
        }
        updateOrderButton();
    });

    formAddress.addEventListener('input', function(event) {
        const input = event.target.value;
        if (/^([0-9]*)([a-zA-ZÀ-ÖØ-öø-ÿ ]*)$/.test(input)) {
            addressErrorMsg.innerHTML = ``;
            addressIsValid = true;
        }
        else {
            addressErrorMsg.innerHTML = `Adresse invalide !`;
            addressIsValid = false;
        }
        updateOrderButton();
    });

    formCity.addEventListener('input', function(event) {
        const input = event.target.value;
        if (/^([a-zA-ZÀ-ÖØ-öø-ÿ ]*)$/.test(input)) {
            cityErrorMsg.innerHTML = ``;
            cityIsValid = true;
        }
        else {
            cityErrorMsg.innerHTML = `Ville invalide !`;
            cityIsValid = false;
        }
        updateOrderButton();
    });

    formEmail.addEventListener('input', function(event) {
        const input = event.target.value;
        if (/^([a-zÀ-ÖØ-öø-ÿ0-9]+)@([a-zÀ-ÖØ-öø-ÿ0-9]+)$/.test(input)) {
            emailErrorMsg.innerHTML = ``;
            emailIsValid = true;
        }
        else {
            emailErrorMsg.innerHTML = `Email invalide !`;
            emailIsValid = false;
        }
        updateOrderButton();
    });

    orderForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const cart = getCart();

        if (cart != null && cart.length > 0) {
            emptyCart.innerHTML = ``;

            const contact = {
                firstName: formFirstName.value,
                lastName: formLastName.value,
                address: formAddress.value,
                city: formCity.value,
                email: formEmail.value
            };
            const products = getCart().map(product => product.id);

            const order = await fetch("http://localhost:3000/api/products/order", { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({contact, products}) })
            const result = await order.json();

            const orderId = result.orderId;
            window.location.replace("./confirmation.html?orderId=" + orderId);
        }
        else {
            emptyCart.innerHTML = `Votre panier est vide !`;
        }
    });

}

(async() => { await init() })();