window.addEventListener("load", () => {
    $("#feedbackForm").submit((event) => {
        event.preventDefault();
        $("#invalidFeedback").text("");
        let rating = $(`input[name="rating"]:checked`).val();
        let feedHead = $("#input-one").val();
        let feedBody = $("#input-two").val();
        if (rating === undefined || rating === null || rating === "") {
            $("#invalidFeedback").text("Please select a rating from 1 to 5");
            $(`input[name="rating"]`).on("click", () => {
                $("#invalidFeedback").text("");
            });
        }
        else if (feedHead === undefined || feedHead === null || feedHead === "") {
            $("#invalidFeedback").text("Please write some feedback about our service.");
            $("#input-one").css("border", "1px solid red");
            $("#input-one").on("click", () => {
                $("#invalidFeedback").text("");
                $("#input-one").css("border", "1px solid black");
            });
        }
        else {
            $("#feedbackForm").slideUp(500);
            $("#load-container").slideDown(500);
            feedHead = feedHead.replace(/[^a-zA-Z0-9 ]/g, '');
            if (feedBody === undefined || feedBody === null || feedBody === "") { }
            else {
                feedBody = feedBody.replace(/[^a-zA-Z0-9 ]/g, '');
            }
            let feedback = {
                "rating": rating,
                "feedHead": feedHead,
                "feedBody": feedBody
            };
            $.ajax({
                url: '/feedback',
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                async: true,
                data: JSON.stringify(feedback),
                success: function (data) {
                    if (data.response === 200) {
                        setTimeout(() => {
                            $("#spin").fadeOut(200);
                            $("#tick").fadeIn(200);
                            sessionStorage.setItem("count", 2);
                            sessionStorage.setItem("visited", Date.now());
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 1000);
                        }, 500);
                    }
                    else {
                        setTimeout(() => {
                            $("#spin").fadeOut(200);
                            $("#cross").fadeIn(200);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }, 500);
                    }
                },
                error: function (jqXHR, textStatus, err) {
                    window.location.reload();
                }
            })
        }
    })
});