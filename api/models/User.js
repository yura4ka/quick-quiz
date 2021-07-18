const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: { type: String, required : true, maxlength : 15, unique : true },
    password: { type: String, required: true },
    isAdmin: { type : Boolean, default : false }
});

module.exports = model('User', schema);