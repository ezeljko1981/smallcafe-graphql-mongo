const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    id: Number,
    name: String,
    price: Number,
    active: Boolean
});

module.exports = mongoose.model('article', articleSchema);
