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
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'></i><span class='badge badge-primary' id='CartCount'> 0 </span></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temporaryData("#headIF").replaceWith(temporaryHead.html());
    res.send(temporaryData.html());
  }
  else {
    res.send(readData);
  }
});

app.get('/menu', (req, res) => {
  if (req.session.authenticated) {
    let temporaryHead = cheerio.load(retHead);
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./MenuPage.html");
    temp("#first-page").css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/menupage.css");
    temp("#mainJS").attr("src", "./assets/js/addToCart.js");
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'></i><span class='badge badge-primary' id='CartCount'> 0 </span></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
    temp("#headIF").replaceWith(temporaryHead.html());
    res.send(temp.html());
  } else {
    let temp = cheerio.load(readData);
    temp("#bodyIF").attr("src", "./MenuPage.html");
    temp('#first-page').css("display", "none");
    temp("#mainCSS").attr("href", "./assets/css/menupage.css");
    temp("#mainJS").attr("src", "./assets/js/addToCart.js");
    res.send(temp.html());
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
    req.session.destroy((err) => {
      if (err) {
        res.status(400);
        res.send({ "response": "400" });
      }
      res.redirect("/");
    })
  }
  else {
    res.status(400);
    res.send({ "response": "400" });
  }
});

let urlencodedParser = bodyParser.urlencoded({ extended: false })
let jsonencodeParser = bodyParser.json()

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
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'></i><span class='badge badge-primary' id='CartCount'> 0 </span></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
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
    temporaryHead('body').find("#loginLink").replaceWith("<a class='nav-link' href='/cart' id='cart'><h2 style='color: gray;margin-right: 5vw;cursor: pointer;'><i class='bi bi-cart3'></i><span class='badge badge-primary' id='CartCount'> 0 </span></h2></a></li><li class='nav-item'><a class='nav-link' href='#'><div class='dropdown'><h2 id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='color: gray;margin-right: 12vw;cursor: pointer;'> <i class='bi bi-person-circle'></i></h2><div class='dropdown-menu p-4' aria-labelledby='dropdownMenuButton' style='min-width: 375px;left: -175px;'><div class='card-body' style='border-bottom: 1px solid gray;'><div class='row'><div class='col'><h1 class='card-title'><i class='bi bi-person-circle'></i></h1></div><div class='col'><span id='spanName'>" + req.session.name + "</span><br><br><span id='spanEmail'>" + req.session.email + "</span></div></div></div><div class='card-footer text-center bg-transparent'><button type='button' class='btn btn-primary' onclick='window.location.href=`/logout`'>Logout</button></div></div></div></a>")
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
  let temp = readData.replace("./HomePage.html", "./AboutPage.html");
  res.send(temp);
});

app.listen(3000, () => {
  // console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`);
});