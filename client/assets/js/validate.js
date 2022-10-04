
window.addEventListener("load", () => {
    $("#email").on("focus", () => {
        $("#form-message").html("");
    });
    $("#form").submit((event) => {
        event.preventDefault();
        $("#email").removeClass("shaker border border-danger");
        $("#pwd").removeClass("shaker border border-danger");
        $("#msg").text("");
        let email = $("#email").val();
        let emailParts = email.split("@");
        if (emailParts.length > 2 || email.length < 4 || email.length > 64) {
            $("#msg").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        else if (emailParts[1] != "keshav.du.ac.in") {
            $("#msg").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        else {
            let pwd = $("#pwd").val();
            if (pwd.length < 8 || pwd.length > 20) {
                $("#msg").text("Invalid Password");
                $("#pwd").addClass("shaker border border-danger").on("focus", () => {
                    $("#pwd").removeClass("shaker border border-danger");
                    $("#msg").text("");
                });
                return;
            }
            else {
                $("#login-container").slideUp(500);
                $("#load-container").slideDown(500);
                $.ajax({
                    url: "/login",
                    type: "post",
                    dataType: "json",
                    async: 'false',
                    data: $("#form").serialize(),
                    success: function (data) {
                        if (data.response === 100)
                            setTimeout(() => {
                                $("#spin").fadeOut(200);
                                $("#tick").fadeIn(200);
                                sessionStorage.setItem("count", 2);
                                sessionStorage.setItem("visited", Date.now());
                                setTimeout(() => {
                                    window.location.href = "/";
                                }, 1000);
                            }, 2000);
                        if (data.response === 200)
                            setTimeout(() => {
                                $("#spin").fadeOut(200);
                                $("#tick").fadeIn(200);
                                sessionStorage.setItem("count", 2);
                                sessionStorage.setItem("visited", Date.now());
                                setTimeout(() => {
                                    window.location.href = "/";
                                }, 1000);
                            }, 2000);
                        if (data.response === 500) {
                            setTimeout(() => {
                                $("#form-message").text("Failed to Login, Try Again.");
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                                setTimeout(() => {
                                    $("#msg").text("Wrong Password");
                                    $("#pwd").addClass("shaker border border-danger").on("focus", () => {
                                        $("#pwd").removeClass("shaker border border-danger");
                                        $("#msg").text("");
                                    });
                                }, 500);
                            }, 2000);
                        }
                        if (data.response === 404) {
                            setTimeout(() => {
                                $("#form-message").text("Email not registered. Use another or create one.");
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                                setTimeout(() => {
                                    $("#msg").text("Wrong Email");
                                    $("#email").addClass("shaker border border-danger").on("focus", () => {
                                        $("#email").removeClass("shaker border border-danger");
                                        $("#msg").text("");
                                    });
                                }, 500);
                            }, 2000);
                        }
                        if (data.response === 400) {
                            setTimeout(() => {
                                $("#form-message").text("Invalid data entries in login form.");
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                                setTimeout(() => {
                                    $("#msg").text("Invalid Email or Password");
                                    $("#email").addClass("shaker border border-danger").on("focus", () => {
                                        $("#email").removeClass("shaker border border-danger");
                                        $("#msg").text("");
                                    });
                                }, 500);
                            }, 2000);
                        }
                    },
                    error: function (jqXHR, textStatus, err) {
                        window.location.reload();
                    }
                })
            }
        }
    })

    $("#regForm").submit((event) => {
        event.preventDefault();
        $("#email").removeClass("shaker border border-danger");
        $("#pwd").removeClass("shaker border border-danger");
        $("#msg").text("");
        let fname = $("#fname").val();
        let lname = $("#lname").val();
        let fnameTest = /^(?=.*[A-Za-z])[A-Za-z]{3,64}$/
        let lnameTest = /^(?=.*[A-Za-z])[A-Za-z]{3,64}$/
        if (fnameTest.test(fname) === false) {
            $("#msg").text("Invalid First Name");
            $("#fname").addClass("shaker border border-danger").on("focus", () => {
                $("#fname").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        if (lname.length > 0 && lnameTest.test(lname) === false) {
            $("#msg").text("Invalid Last Name");
            $("#lname").addClass("shaker border border-danger").on("focus", () => {
                $("#lname").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        let email = $("#email").val();
        let emailParts = email.split("@");
        if (emailParts.length > 2 || email.length < 4 || email.length > 64) {
            $("#msg").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        else if (emailParts[1] != "keshav.du.ac.in") {
            $("#msg").text("Invalid Email");
            $("#email").addClass("shaker border border-danger").on("focus", () => {
                $("#email").removeClass("shaker border border-danger");
                $("#msg").text("");
            });
            return;
        }
        else {
            let pwd = $("#rpwd").val();
            let cpwd = $("#rcpwd").val();
            let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d@*_]{7,19}$/;
            if (reg.test(pwd) === false) {
                $("#msg").text("Invalid Password");
                $("#rpwd").addClass("shaker border border-danger").on("focus", () => {
                    $("#rpwd").removeClass("shaker border border-danger");
                    $("#msg").text("");
                });
                return;
            }
            else if (pwd !== cpwd) {
                $("#msg").text("Passwords do not match");
                $("#rcpwd").addClass("shaker border border-danger").on("focus", () => {
                    $("#rcpwd").removeClass("shaker border border-danger");
                    $("#msg").text("");
                });
                return;
            }
            else {
                $("#login-container").slideUp(500);
                $("#load-container").slideDown(500);
                $.ajax({
                    url: "/register",
                    type: "post",
                    dataType: "json",
                    async: 'false',
                    data: $("#regForm").serialize(),
                    success: function (data) {
                        if (data.response === 100) {
                            setTimeout(() => {
                                $("#spin").fadeOut(200);
                                $("#tick").fadeIn(200);
                                sessionStorage.setItem("count", 2);
                                sessionStorage.setItem("visited", Date.now());
                                setTimeout(() => {
                                    window.location.href = "/";
                                }, 1000);
                            }, 2000);
                        }
                        if (data.response === 200) {
                            setTimeout(() => {
                                $("#spin").fadeOut(200);
                                $("#tick").fadeIn(200);
                                setTimeout(() => {
                                    window.location.href = "/login";
                                }, 1500);
                            }, 2000);
                        }
                        if (data.response === 500) {
                            setTimeout(() => {
                                $("#form-message").text("Failed to Register. Try Again in some time.");
                                $("#regForm").trigger('reset');
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                            }, 2000);
                        }
                        if (data.response === 1) {
                            setTimeout(() => {
                                $("#form-message").html("Username already taken. Continue to <a class='text-danger' href='/login'><u>Login</u></a> or use another email.");
                                $("#regForm").trigger('reset');
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                            }, 2000);
                        }
                        if (data.response === 400) {
                            setTimeout(() => {
                                $("#form-message").text("Invalid data entries in registration form.");
                                $("#regForm").trigger('reset');
                                $("#load-container").slideUp(500);
                                $("#login-container").slideDown(500);
                            }, 2000);
                        }
                    },
                    error: function (jqXHR, textStatus, err) {
                        window.location.reload();
                    }
                })
            }
        }
    })
})
