$("document").ready(()=>{
    if(Date.now()-parseInt(sessionStorage.getItem("visited"))>180000)
    {    
        $("#first-page").css("display","block");
        $("#HomePage").css("display","none");
        sessionStorage.setItem("visited",Date.now());
    }
    else if(parseInt(sessionStorage.getItem("count"))>1)
    {    
        $("#first-page").css("display","none");
        $("#HomePage").css("display","block");
    }
    $(".next").click(()=>{
        $(".front-img").slideUp(600);
        $(".next").slideUp(100);
        $("#HomePage").fadeIn(1100);
    });
});

function setActiveLink(param) {
    let currentActive = document.getElementsByClassName("active");
    if (currentActive.length > 0) currentActive[0].classList.remove("active");
    param.target.classList.add("active");
  }