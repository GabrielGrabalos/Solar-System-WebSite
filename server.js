const express = require('express');

const PORT = 3000;

const app = express();

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', { nome: 'Fulano' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});