// Endroit à changer pour afficher les produits
const productList = document.getElementById("items");

// Récupère les produits et les affichent
fetch("http://localhost:3000/api/products", { method: 'GET' })
.then(function(res) { // Tente de se connecter
    if (res.ok) {
        return res.json();
    }
})
.then(function(items) { // "items" = Les données récupérées. 
    for (let i = 0; i < items.length; i++) { // Affiche chaque produit
        const productElement = document.createElement("a");
        productElement.setAttribute("href", "./product.html?id=" + items[i]._id);
        productElement.innerHTML = `<article>
            <img src="${items[i].imageUrl}" alt="${items[i].altTxt}">
            <h3 class="productName">${items[i].name}</h3>
            <p class="productDescription">${items[i].description}</p>
            </article>`
        productList.appendChild(productElement);
    }
})
.catch(function(err) { // Récupère l'erreur si le script ne fonctionne pas
    console.log(err);
});