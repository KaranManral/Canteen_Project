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

function addToCart(element) {
    $(".alert").fadeIn(500);
    setTimeout(() => {
        $(".alert").fadeOut(500);
    }, 1000);
    $.ajax({
        url: "/menu",
        dataType: "json",
        contentType: "application/json",
        type: "post",
        async: false,
        data: JSON.stringify({
            productId: element.id,
            quant: 1
        }),
        success: function (data) {
            if (data.response === 302) {
                window.location.href = "/login";
            }
            if (data.response === 200) {
                $("#lblCartCount").text(` ${data.count} `);
                if (parseInt(data.count) > 0)
                    $("#checkout").fadeIn(500);
                else
                    $("#checkout").fadeOut(500);
            }
        },
        error: function (err) {
            window.location.href = "/login";
        }
    })
}