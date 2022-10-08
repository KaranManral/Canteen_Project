document.onvisibilitychange = function () {
    if (document.visibilityState === 'hidden') {
        $.ajax({
            url: "/save_cart",
            dataType: "json",
            contentType: "application/json",
            type: "post",
            async: false,
            data: JSON.stringify({
                productId: "1",
                quant: 1
            }),
            success: function (data) {
                //do something
            },
            error: function (err) {
                window.location.href = "/login";
            }
        })
    }
}

function countChanged(element) {
    $.ajax({
        url: "/cart",
        dataType: "json",
        contentType: "application/json",
        type: "post",
        async: false,
        data: JSON.stringify({
            productId: element.id,
            quant: element.value
        }),
        success: function (data) {
            if (data.response === 302) {
                window.location.href = "/login";
            }
            if (data.response === 200) {
                let ppu = ($(`#ppu${element.id}`).text()).split(" ");
                $("#lblCartCount").text(` ${data.count} `);
                if (parseInt(element.value) == 0) {
                    $(`#parent${element.id}`).remove();
                }
                else
                    $(`#totalPrice${element.id}`).text(`Rs. ${parseInt(element.value) * parseInt(ppu[ppu.length - 1])}`);
                $("#grandCount").text(`items : ${data.count}`);
                let grandTotal = 0.00;
                let cartItems = document.querySelectorAll("input[type=number]");
                for (let i = 0; i < cartItems.length; i++) {
                    let id = cartItems[i].id;
                    let ppui = ($(`#ppu${id}`).text()).split(" ");
                    let count = cartItems[i].value;
                    grandTotal += (parseInt(count) * parseFloat(ppui[ppui.length - 1]));
                }
                if (grandTotal === 0.00) {
                    document.getElementById("proceedPayment").disabled = true;
                }
                else {
                    document.getElementById("proceedPayment").disabled = false;
                }
                $("#grandTotal").text(`Rs. ${grandTotal}`);
            }
        },
        error: function (err) {
            window.location.href = "/login";
        }
    })
}
