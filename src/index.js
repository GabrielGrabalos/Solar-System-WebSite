const express = require('express');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs', { nome: 'caju' });
});

app.get('/src/stars.jpg' , (req, res) => {
    res.sendFile('stars.jpg', { root: __dirname });
});

app.get('/script3.js' , (req, res) => {
    res.sendFile('script3.js', { root: __dirname });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});