const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestorderSchema = new Schema({
    id: String,
    id_table: Number,
    ordertime: Number,
    price: Number,
    status: String,
    archieved: Boolean
});

module.exports = mongoose.model('guestorder', guestorderSchema);
