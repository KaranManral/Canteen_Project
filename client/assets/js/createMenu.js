window.addEventListener("load", () => {
    let items = JSON.parse(document.getElementById("data").innerText);
    for (let i = 0; i < items.data.length; i++) {
        $(".card-deck").append(`<div class="card my-3" id=${items.data[i]._id} onclick="addToCart(this)">
        <div class="card-header bg-transparent border-light"><img class="card-img-top"
            src=${items.data[i].img} alt=${items.data[i].name} title=${items.data[i].name} loading="lazy"></div>
        <div class="card-body">
          <h3 class="card-title">${items.data[i].name}</h3>
          <p class="card-text">
            Price : Rs ${items.data[i].price}<br>
            Quantity : ${items.data[i].quant}
          </p>
        </div>
        <div class="card-footer bg-transparent text-danger"><strong>Add to Cart</strong></div>
      </div>`);
    }
    $("#data").remove();
});