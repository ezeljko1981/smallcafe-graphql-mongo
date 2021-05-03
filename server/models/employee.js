const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model('employee', employeeSchema);
