const express = require('express');
const app = express();

const port = 9000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.listen(process.env.PORT || port, err => {
    if(err) console.log(err);
    else console.log("Server has Stared!!!");
});