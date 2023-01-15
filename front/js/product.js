// Les balises à récupérer pour changer la page
const pageTitle = document.getElementsByTagName("title")[0];

const productTitle = document.getElementById("title");
const productDescription = document.getElementById("description");
const productPrice = document.getElementById("price");
const productImage = document.getElementsByClassName("item__img")[0];

const options = document.querySelector("#colors option");
const colorInput = document.getElementById("colors");
const quantityInput = document.getElementById("quantity");

const addButton = document.getElementById("addToCart");
const addButtonBox = document.getElementsByClassName("item__content__addButton")[0];

const confirmation = document.createElement("p");
addButtonBox.after(confirmation);


// On récupère la valeur du produit choisit
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');


// Récupère les produits
fetch("http://localhost:3000/api/products/" + productId, { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(item) { // "item" = Le produit récupérée. 

    // On applique les données sur la page
    pageTitle.innerHTML = `${item.name}`;
    productTitle.innerHTML = `${item.name}`;
    productDescription.innerHTML = `${item.description}`;
    productPrice.innerHTML = `${item.price}`;
    productImage.innerHTML = `<img src="${item.imageUrl}" alt="${item.altTxt}">`;

    for (let i = 0; i < item.colors.length; i++) { // Affiche chaque option de couleurs
        const colorChoice = document.createElement("option");
        colorChoice.setAttribute("value", item.colors[i]);
        colorChoice.innerHTML = `${item.colors[i]}`;
        options.after(colorChoice);
    }

})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});


// Detection du 'clic' de la souris sur le bouton d'achat
addButton.addEventListener('click', function() {

    // On regarde s'il y a une couleur et une quantité choisi
    if (colorInput.value != "" && quantityInput.value > 0) {

        // Récupère le panier si il y a des élèments
        let cartProduct = [];
        if (localStorage.getItem("cart") != null) {
            cartProduct = getCart();
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
            confirmation.innerHTML = `Votre produit a bien été ajouté au panier.`;
        }
        else {
            confirmation.innerHTML = `La quantité de votre produit a bien été augmentée.`;
        }
        setCart(cartProduct);

    }
    else {
        confirmation.innerHTML = `Veuillez sélectionner une couleur et une quantité.`;
    }

})


// Récupère le panier en LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

// Défini le panier dans le LocalStorage
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}