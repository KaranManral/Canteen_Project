$("document").ready(() => {
    if (Date.now() - parseInt(sessionStorage.getItem("visited")) > 180000) {
        $("#first-page").css("display", "block");
        $("#HomePage").css("display", "none");
        sessionStorage.setItem("visited", Date.now());
    }
    else if (parseInt(sessionStorage.getItem("count")) > 1) {
        $("#first-page").css("display", "none");
        $("#HomePage").css("display", "block");
    }
    $("#explorer").click(() => {
        $(".front-img").animate({ top: "-200%" }, 1500, () => {
            $(".front-img").css("display", "none");
        });
        $("#explorer").animate({ top: "100%" }, 400, () => {
            $("#explorer").css("display", "none");
        });
        $("#HomePage").fadeIn(1500);
    });
    $("#first-page").on("mouseenter", () => {
        $(".front-img").fadeTo(0, 0.5);
        $("#explorer").animate({ top: "64%" }, 500);
        $("#first-page").stop();
    }).on("mouseleave", () => {
        $(".front-img").fadeTo(0, 1);
        $("#explorer").animate({ top: "100%" }, 500);
        $("#first-page").stop();
    })
    $(".front-img").on("click", () => {
        $(".front-img").fadeTo(0, 0.5);
        $("#explorer").animate({ top: "64%" }, 500);
        $("#first-page").stop();
    })
});