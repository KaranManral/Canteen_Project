const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();
const mdb = require("./configDB");
const session = require("express-session");
const cheerio = require("cheerio");

let readData = "", retHead = "";

app.use('/', express.static(path.join(__dirname, "../client")));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/popper.js/dist/umd')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));
app.use(session({
  secret: Date.now().toString(36) + Math.random().toString(36).substring(2),
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 86400000 }
}));
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let jsonencodeParser = bodyParser.json()

fs.readFile(path.join(__dirname, "../client/main.html"), "utf-8", (err, data) => {
  if (err) {
    return
  }
  readData = data;
})
fs.readFile(path.join(__dirname, "../client/header.html"), "utf-8", (err, data) => {
  if (err) {
    return
  }
  retHead = data;
})

app.get('/', (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temporaryData = cheerio.load(readData);
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'><span class='badge badge-warning' id='lblCartCount'> " + req.session.count + " </span></i></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temporaryData("#headIF").replaceWith(temporaryHead.html());
    res.send(temporaryData.html());
  }
  else {
    res.send(readData);
  }
});

app.get('/menu', async (req, res) => {
  let items = await mdb.getItems();
  if (items.flag === 1) {
    if (req.session.authenticated) {
      let temporaryHead = cheerio.load(retHead);
      let temp = cheerio.load(readData);
      temp("#bodyIF").attr("src", "./MenuPage.html")
      temp("#first-page").css("display", "none");
      temp("#mainCSS").attr("href", "./assets/css/menupage.css");
      temp("#mainJS").attr("src", "./assets/js/addToCart.js");
      temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'><span class='badge badge-warning' id='lblCartCount'> " + req.session.count + " </span></i></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
      temp("#headIF").replaceWith(temporaryHead.html());
      temp("body").append(`<script src="./assets/js/createMenu.js"></script>`);
      temp("body").append(`<p id="data" style="display:hidden">${JSON.stringify(items)}</p>`);
      res.send(temp.html());
    } else {
      let temp = cheerio.load(readData);
      temp("#bodyIF").attr("src", "./MenuPage.html")
      temp('#first-page').css("display", "none");
      temp("#mainCSS").attr("href", "./assets/css/menupage.css");
      temp("#mainJS").attr("src", "./assets/js/addToCart.js");
      temp("body").append(`<script src="./assets/js/createMenu.js"></script>`);
      temp("body").append(`<p id="data" style="display:hidden">${JSON.stringify(items)}</p>`);
      res.send(temp.html());
    }
  }
  else {
    res.status(500);
    res.send("Internal Server Error");
  }
});

app.post('/menu', jsonencodeParser, (req, res) => {
  if (req.session.authenticated) {
    let order = req.body;
    if (req.session.cart.length === 0) {
      req.session.cart.push({
        "pid": order["productId"],
        "pquant": order["quant"]
      })
      req.session.count++;
    }
    else {
      let check = false;
      for (let i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].pid === order["productId"]) {
          req.session.cart[i].pquant = parseInt(req.session.cart[i].pquant) + 1;
          check = true;
          req.session.count++;
        }
      }
      if (check === false) {
        req.session.cart.push({
          "pid": order["productId"],
          "pquant": order["quant"]
        })
        req.session.count++;
      }
    }
    res.send({ "response": 200, "count": req.session.count })
  }
  else {
    res.send({ "response": 302 })
  }
});

app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/");
  }
  else {
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./LoginPage.html");
    temp('#first-page').css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/login-register.css");
    temp("#mainJS").attr("src", "./assets/js/validate.js");
    res.send(temp.html());
  }
});

app.get('/register', (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/");
  }
  else {
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./RegisterPage.html");
    temp('#first-page').css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/login-register.css");
    temp("#mainJS").attr("src", "./assets/js/validate.js");
    res.send(temp.html());
  }
});

app.get('/logout', (req, res) => {
  if (req.session.authenticated) {
    mdb.addCart(req.session.cart, req.session.email);
    req.session.destroy((err) => {
      if (err) {
        res.status(400);
        res.send({ "response": "400" });
      }
      res.redirect("/");
    })
  }
  else {
    res.redirect("/");
  }
});

app.post('/login', urlencodedParser, async (req, res) => {
  if (req.session.authenticated) {
    res.status(200);
    res.send({ "response": 100 });
    res.end();
  }
  else {
    try {
      let userData = req.body;
      let email = userData["email"];
      let emailParts = email.split("@");
      if (emailParts.length > 2 || email.length < 4 || email.length > 64) {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      else if (emailParts[1] != "keshav.du.ac.in") {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      else {
        let pwd = userData["password"];
        try {
          let checkExists = await mdb.checkUser(userData);
          if (checkExists.flag === 0) {
            res.status(200);
            res.send({ "response": 404 });
            res.end();
          }
          else {
            if (checkExists.user["email"] === email && checkExists.user["password"] === pwd) {
              req.session.authenticated = true;
              req.session.email = checkExists.user["email"];
              req.session.name = checkExists.user["fname"] + " " + checkExists.user["lname"];
              let existcart = await mdb.checkCart(req.session.email);
              if (existcart.flag === 1) {
                if (existcart.cart === null || existcart.cart === undefined) {
                  req.session.cart = [];
                  req.session.count = 0;
                }
                else {
                  req.session.cart = existcart.cart;
                  req.session.count = 0;
                  for (let i = 0; i < (existcart.cart).length; i++)
                    req.session.count += parseInt(existcart.cart[i].pquant);
                }
              }
              else {
                req.session.cart = [];
                req.session.count = 0;
              }
              res.status(200);
              res.send({ "response": 200 });
              res.end();
            }
            else {
              res.status(200);
              res.send({ "response": 500 });
              res.end();
            }
          }
        } catch (err) {
          res.send({ "response": 500 });
        }
      }
    } catch (e) {
      res.send({ "response": 400 });
    }
  }
});
app.post('/register', urlencodedParser, async (req, res) => {
  if (req.session.authenticated) {
    res.status(200);
    res.send({ "response": 100 });
    res.end();
  }
  else {
    try {
      let userData = req.body;
      let fname = userData["fname"];
      let lname = userData["lname"];
      let fnameTest = /^(?=.*[A-Za-z])[A-Za-z]{3,64}$/
      let lnameTest = /^(?=.*[A-Za-z])[A-Za-z]{3,64}$/
      if (fnameTest.test(fname) === false) {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      if (lname.length > 0 && lnameTest.test(lname) === false) {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      let email = userData["email"];
      let emailParts = email.split("@");
      if (emailParts.length > 2 || email.length < 4 || email.length > 64) {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      else if (emailParts[1] != "keshav.du.ac.in") {
        res.send({ "response": 400 });
        res.end();
        return;
      }
      else {
        let pwd = userData["password"];
        let cpwd = userData["cpassword"];
        let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d@*_]{7,19}$/;
        if (reg.test(pwd) === false) {
          res.send({ "response": 400 });
          res.end();
          return;
        }
        else if (pwd !== cpwd) {
          res.send({ "response": 400 });
          res.end();
          return;
        }
        else {
          try {
            let checkExists = await mdb.checkUser(userData);
            if (checkExists.flag === 0) {
              let response = await mdb.addUser(userData);
              if (response === 1) {
                res.status(200);
                res.send({ "response": 200 });
                res.end();
              }
              else {
                res.status(200);
                res.send({ "response": 500 });
                res.end();
              }
            }
            else {
              res.status(200);
              res.send({ "response": 1 });
              res.end();
            }
          } catch (err) {
            res.send({ "response": 500 });
          }
        }

      }
    } catch (e) {
      res.send({ "response": 400 });
    }
  }
});

app.get("/support", (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./SupportPage.html");
    temp("#first-page").css("display", "none");
    temp('#mainCSS').remove();
    temp('#mainJS').remove();
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'><span class='badge badge-warning' id='lblCartCount'> " + req.session.count + " </span></i></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temp("#headIF").replaceWith(temporaryHead.html());
    res.send(temp.html());
  } else {
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./SupportPage.html");
    temp("#first-page").css("display", "none");
    temp('#mainCSS').remove();
    temp('#mainJS').remove();
    res.send(temp.html());
  }
});

app.get("/feedback", (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./FeedbackPage.html");
    temp("#first-page").css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/feedback.css");
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'><span class='badge badge-warning' id='lblCartCount'> " + req.session.count + " </span></i></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temp("#headIF").replaceWith(temporaryHead.html());
    temp("#mainJS").attr("src", "./assets/js/feedback.js");
    res.send(temp.html());
  } else {
    res.redirect("/login");
  }
});

app.post("/feedback", jsonencodeParser, async (req, res) => {
  if (req.session.authenticated) {
    try {
      let feedback = req.body;
      feedback["name"] = req.session.name;
      feedback["email"] = req.session.email;
      let submit = await mdb.submitFeedback(feedback);
      if (submit === 1) {
        res.status(200);
        res.send({ "response": 200 });
        res.end();
      }
      else {
        res.status(200);
        res.send({ "response": 500 });
        res.end();
      }
    } catch (e) {
      res.status(400);
      res.send({ "response": 400 });
      res.end();
    }
  }
  else {
    res.redirect("/");
  }
});

app.get('/about', (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./AboutPage.html");
    temp("#first-page").css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/aboutpage.css");
    temp("#mainJS").remove();
    temporaryHead("body")
      .find("#loginLink")
      .replaceWith(
        "<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'></i><span class='badge badge-primary' id='CartCount'> 0 </span></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" +
          req.session.name +
          "</span><br><br><span id='spanEmail'>" +
          req.session.email +
          "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>"
      );
    temp("#headIF").replaceWith(temporaryHead.html());
    res.send(temp.html());
  } else {
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./AboutPage.html");
    temp("#first-page").css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/aboutpage.css");
    temp("#mainJS").remove();
    res.send(temp.html());
  }
});

app.get('/cart', async (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temp = cheerio.load(readData);
    temp("#bodyIF").replaceWith(`
    <div class="container py-5">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-12">
        <div class="card card-registration card-registration-2" style="border-radius: 15px;">
          <div class="card-body p-0">
            <div class="row g-0">
              <div class="col-lg-9">
                <div class="p-5">
                  <div class="d-flex justify-content-between align-items-center mb-5">
                    <h1 class="fw-bold mb-0 text-dark">Checkout</h1>
                  </div>
                  

                  <div id="itemContainer"></div>
                  

                  <div class="pt-5">
                    <h6 class="mb-0"><a href="/menu" class="text-body"><i
                          class="bi bi-arrow-left mr-2"></i>Back to shop</a></h6>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 bg-grey">
                <div class="p-5">
                  <h3 class="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                  <hr class="my-4">

                  <div id="total"></div>

                  <button type="button" class="btn btn-dark btn-block btn-lg"
                    data-mdb-ripple-color="dark" id="proceedPayment" onclick="window.location.href='/'">Pay</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `);
    temp("#first-page").css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/cart.css");
    temp("#mainJS").attr("src", "./assets/js/displayCart.js");
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'><span class='badge badge-warning' id='lblCartCount'> " + req.session.count + " </span></i></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temp("#headIF").replaceWith(temporaryHead.html());
    let items = await mdb.getItems();
    let grandTotal = 0;
    for (let i = 0; i < req.session.cart.length; i++) {
      let image = "", price = 0, name = "", quantity = "", count = 0, pID = "";
      for (let j = 0; j < items.data.length; j++) {
        if (items.data[j]._id == req.session.cart[i].pid) {
          image = items.data[j].img;
          price = parseInt(items.data[j].price);
          name = items.data[j].name;
          quantity = items.data[j].quant;
          pID = items.data[j]._id;
        }
      }
      count = parseInt(req.session.cart[i].pquant);
      temp("#itemContainer").append(`
        <div class="row mb-4 d-flex justify-content-between align-items-center" id="parent${pID}">
        <hr class="my-4">
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <img
                            src="${image}"
                            class="img-fluid rounded-3" alt="${name}" title="${name}">
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-3">
                          <h6 class="text-muted">${name}</h6>
                          <h6 class="text-black mb-0">${quantity}</h6>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <h6 class="text-muted">Unit Price</h6>
                          <h6 class="text-black mb-0" id="ppu${pID}">Rs. ${price}</h6>
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <button class="btn btn-link px-2"
                            onclick="this.parentNode.querySelector('input[type=number]').stepDown();countChanged(this.parentNode.querySelector('input[type=number]'))">
                            <i class="bi bi-dash"></i>
                          </button>
    
                          <input id="${pID}" min="0" name="quantity" value="${count}" type="number"
                            class="form-control form-control-sm" onchange="countChanged(this)" />
    
                          <button class="btn btn-link px-2"
                            onclick="this.parentNode.querySelector('input[type=number]').stepUp();countChanged(this.parentNode.querySelector('input[type=number]'))">
                            <i class="bi bi-plus"></i>
                          </button>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2 offset-lg-1">
                        <h6 class="text-muted">Total Price</h6>
                          <h6 class="mb-0" id="totalPrice${pID}">Rs. ${count * price}</h6>
                        </div>
                        <hr class="my-4"></hr>
                      </div>
      `);
      grandTotal += (count * price);
    }
    temp("#total").append(`
      <div class="d-flex justify-content-between mb-4">
        <h5 class="text-uppercase" id="grandCount">items : ${req.session.count}</h5>
      </div>

      <hr class="my-4">

      <div class="d-flex justify-content-between mb-5">
        <h5 class="text-uppercase">Total price</h5>
        <h5 id="grandTotal">Rs. ${grandTotal}.00</h5>
      </div>
    `);
    res.send(temp.html());
  } else {
    res.redirect("/login");
  }
});

app.post('/cart', jsonencodeParser, (req, res) => {
  if (req.session.authenticated) {
    let order = req.body;
    let check = { flag: false, pos: -1 };
    for (let i = 0; i < req.session.cart.length; i++) {
      if (req.session.cart[i].pid === order["productId"]) {
        req.session.count += (parseInt(order["quant"]) - parseInt(req.session.cart[i].pquant));
        req.session.cart[i].pquant = parseInt(order["quant"]);
        check.flag = true;
        check.pos = i;
      }
    }
    if (check.flag) {
      if (req.session.cart[check.pos].pquant == 0) {
        req.session.cart.splice(check.pos, 1);
      }
    }
    res.send({ "response": 200, "count": req.session.count })
  }
  else {
    res.send({ "response": 302 })
  }
});

app.post('/save_cart', jsonencodeParser, async (req, res) => {
  if (req.session.authenticated) {
    try {
      let flag = await mdb.addCart(req.session.cart, req.session.email);
      if (flag === 1) {
        res.send({ "response": 200 });
      }
      else {
        res.send({ "response": 400 });
      }
    }
    catch (e) {
      res.send({ "response": 400 });
    }
  }
  else
    res.send({ "response": 400 });
});

app.listen(3000, () => {
  // console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`);
});