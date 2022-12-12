const { Schema, model } = require('mongoose');

const PlanetaSchema = new Schema({
    nome: String,
    descricao: String,
});

const PlanetaModel = model('planeta', PlanetaSchema);