// Les balises à récupérer pour changer la page
const orderIdMsg = document.getElementById("orderId");;

// On récupère la valeur du produit choisit
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

// Affichez ID
orderIdMsg.innerHTML = `${orderId}`