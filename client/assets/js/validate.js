
window.addEventListener("load", () => {
    $("#form").submit((event) => {
        event.preventDefault();
        let email = $("#email").val();
        let emailParts = email.split("@");
        if (emailParts.length > 2 || email.length < 4 || email.length > 64) {
            $(".text-danger").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $(".text-danger").text("");
            });
            return;
        }
        else if (emailParts[1] != "keshav.du.ac.in") {
            $(".text-danger").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $(".text-danger").text("");
            });
            return;
        }
        else {
            let pwd = $("#pwd").val();
            let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d@*_]{7,19}$/;
            if (reg.test(pwd) === false) {
                $(".text-danger").text("Invalid Password");
                $("#pwd").addClass("shaker border border-danger").on("focus", () => {
                    $("#pwd").removeClass("shaker border border-danger");
                    $(".text-danger").text("");
                });
                return;
            }
            else {
                $.ajax({
                    url: "/login",
                    type: "post",
                    dataType: "json",
                    async: 'false',
                    data: $("#form").serialize(),
                    success: function (data) {
                        alert("success");
                    },
                    error: function (jqXHR, textStatus, err) {
                        alert('text status ' + textStatus + ', err ' + err);
                    }
                })
            }
        }
    })
})
