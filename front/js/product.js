// Les balises à récupérer pour changer la page
const titles = document.getElementsByTagName("title");
const pageTitle = titles[0];

const productTitle = document.getElementById("title");
const productDescription = document.getElementById("description");
const productPrice = document.getElementById("price");

const itemImages = document.getElementsByClassName("item__img");
const productImage = itemImages[0];

const options = document.querySelector("#colors option");
const colorInput = document.getElementById("colors");

const quantityInput = document.getElementById("quantity");

const addButton = document.getElementById("addToCart");

// On récupère la valeur du produit choisit
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id')

// Récupère les produits
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    for (let i = 0; i < items.length; i++) { // Essaye chaque produit
        if (productId == items[i]._id) { // Cherche lequel correspond au produit choisit

            // On applique les données sur la page
            pageTitle.innerHTML = `${items[i].name}`;
            productTitle.innerHTML = `${items[i].name}`;
            productDescription.innerHTML = `${items[i].description}`;
            productPrice.innerHTML = `${items[i].price}`;
            productImage.innerHTML = `<img src="${items[i].imageUrl}" alt="${items[i].altTxt}">`;

            for (let j = 0; j < items[i].colors.length; j++) { // Affiche chaque option de couleurs
                const colorChoice = document.createElement("option");
                colorChoice.setAttribute("value", items[i].colors[j]);
                colorChoice.innerHTML = `${items[i].colors[j]}`;
                options.after(colorChoice);
            }
        }
    }
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});

// Detection du 'clic' de la souris sur le bouton d'achat
addButton.addEventListener('click', function() {
    // Récupère le panier si il y a des élèments
    let cartProduct = [];
    if (localStorage.getItem("cart") != null) {
        cartProduct = JSON.parse(localStorage.getItem("cart"));
    }

    // Rajoute un élement dans le panier ou augmente la quantité
    let inCart = false;
    for (let i = 0; i < cartProduct.length; i++) {
        if (productId == cartProduct[i].id && colorInput.value == cartProduct[i].color) {
            cartProduct[i].quantity = parseInt(cartProduct[i].quantity) + parseInt(quantityInput.value);
            inCart = true;
        }
    }
    if (!inCart) {
        cartProduct.push({ id:productId, color:colorInput.value, quantity:quantityInput.value });
    }
    localStorage.setItem("cart", JSON.stringify(cartProduct));
})