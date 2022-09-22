const express = require('express');
const path = require("path");
const app = express();

app.use('/',express.static(path.join(__dirname,"../client")));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/popper.js/dist/umd')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"../client/index.html"));
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`);
});