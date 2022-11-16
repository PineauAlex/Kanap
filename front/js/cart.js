// Les balises à récupérer pour changer la page
const cartList = document.getElementById("cart__items");

// Récupère les produits
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    for (let i = 0; i < items.length; i++) { // Affiche chaque produit
        const productElement = document.createElement("article");
        productElement.setAttribute("class", "cart__item");
        productElement.innerHTML = `<div class="cart__item__img">
            <img src="../images/product01.jpg" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>Nom du produit</h2>
            <p>Vert</p>
            <p>42,00 €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
            </div>
            </div>`
        cartList.appendChild(productElement);
    }
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});

console.log(localStorage.getItem("cart"));