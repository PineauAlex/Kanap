// Les balises à récupérer pour changer la page
const productsList = document.getElementById("cart__items");

// Récupère les produits
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    for (let i = 0; i < items.length; i++) { // Affiche chaque produit
        console.log(items[i]);
    }
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});