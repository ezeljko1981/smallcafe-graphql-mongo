const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleinorderSchema = new Schema({
    id_article: Number,
    id_order: String,
    price_article: Number,
    price_total: Number,
    quantity: Number,
    name: String
});

module.exports = mongoose.model('articleinorder', articleinorderSchema);
