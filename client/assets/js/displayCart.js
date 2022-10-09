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

window.onload = function () {
    let temp = ($("#grandTotal").text()).split(" ");
    let grandTotal = parseInt(temp[temp.length - 1]);
    if (grandTotal == 0) {
        document.getElementById("proceedPayment").disabled = true;
    }
    else {
        document.getElementById("proceedPayment").disabled = false;
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
                if (grandTotal == 0.00) {
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

function proceedPayment(e) {
    let orderId;
    let temp = ($("#grandTotal").text()).split(" ");
    let grandTotal = (parseInt(temp[temp.length - 1])) * 100;

    let settings = {
        "url": "/create/orderId",
        "method": "POST",
        "timeout": 0,
        async: false,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "amount": grandTotal
        }),
    };

    //creates new orderId everytime
    $.ajax(settings).done(function (response) {

        orderId = response.orderId;

        let options = {
            "key": "rzp_test_q9fdWD6XW6gjOQ", // Enter the Key ID generated from the Dashboard
            "amount": grandTotal, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "KMV Canteen",
            "description": "Food Order",
            "image": "./assets/images/restaurant.png",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                $("#pageBody").replaceWith(`
                    <div class="text-center" id="tick">
                    <h1 class="display-1"><i class="bi bi-patch-check-fill text-success"></i></h1>
                    <br><br>
                    <h4 class="text-primary">Payment Successful</h4>
                </div>
            `);
                var settings = {
                    "url": "/api/payment/verify",
                    "method": "POST",
                    "timeout": 0,
                    async: false,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({ response }),
                }
                $.ajax(settings).done(function (response) {
                    $.ajax({
                        "url": "/payment_success",
                        "method": "POST",
                        "timeout": 0,
                        async: false,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "payment": "success",
                            "orderID": orderId
                        }),
                    }).done(function (response) {
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    }).fail(function (response) {
                        $("#pageBody").replaceWith(`
            <div class="text-center" id="cross">
        <h1 class="display-1"><i class="bi bi-patch-exclamation-fill text-danger"></i></i></h1>
        <br><br>
        <h4 class="text-primary">Payment Failed</h4>
    </div>
            `);
                        setTimeout(() => { window.location.reload() }, 2000)
                    })
                });
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
        });

        rzp1.open();



    }).fail(function (data) {
        $("#pageBody").replaceWith(`
        <div class="text-center" id="cross">
        <h1 class="display-1"><i class="bi bi-patch-exclamation-fill text-danger"></i></i></h1>
        <br><br>
        <h4 class="text-primary">Payment Failed</h4>
    </div>
        `);
        setTimeout(() => { window.location.reload() }, 2000)
    });
}