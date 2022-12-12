const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index.ejs', { nome: "" });
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});