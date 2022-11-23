// Les balises à récupérer pour changer la page
const cartList = document.getElementById("cart__items");
const cartQuantity = document.getElementById("totalQuantity");
const cartPrice = document.getElementById("totalPrice");

const quantityInputs = document.getElementsByClassName("itemQuantity");
const deleteButtons = document.getElementsByClassName("deleteItem");

let totalQuantity = 0;
let totalPrice = 0;

// Récupère les produits
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    cart = JSON.parse(localStorage.getItem("cart"));

    for (let i = 0; i < cart.length; i++) { // Affiche chaque produit
        const product = items.filter(product => product._id == cart[i].id);
        const productElement = document.createElement("article");
        productElement.setAttribute("class", "cart__item");
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
            <input type="number" class="itemQuantity" name="${product[0]._id + "|" + cart[i].color}" min="1" max="100" value="${cart[i].quantity}">
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

    cartQuantity.innerHTML = `${totalQuantity}`
    cartPrice.innerHTML = `${totalPrice}`
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});

// Changement quantité d'un produit
// for (quantityInputs)
quantityInputs.addEventListener('change', function(event) {
    const element = event.target;
    console.log(element);
})

// Suppression d'un produit
deleteButtons.addEventListener('click', function() {
})