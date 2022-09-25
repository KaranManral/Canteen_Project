const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();

let readData = "";

app.use('/', express.static(path.join(__dirname, "../client")));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/popper.js/dist/umd')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));

fs.readFile(path.join(__dirname, "../client/index.html"), "utf-8", (err, data) => {
  if (err) {
    return console.log("Error");
  }
  readData = data;
})

app.get('/', (req, res) => {
  res.send(readData);
});

app.get('/menu', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./MenuPage.html");
  res.send(temp);
});

app.get('/login', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./LoginPage.html");
  res.send(temp);
});

app.get('/support', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./SupportPage.html");
  res.send(temp);
});

app.get('/feedback', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./FeedbackPage.html");
  res.send(temp);
});

app.get('/register', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./RegisterPage.html");
  res.send(temp);
});

app.get('/about', (req, res) => {
  let temp = readData.replace("./HomePage.html", "./AboutPage.html");
  res.send(temp);
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`);
});