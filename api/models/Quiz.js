const { Schema, model } = require('mongoose');

const schema = new Schema({
    question: { type: String, required: true, maxlength: 50 },
    answers: [{ type: String, required: true, maxlength: 30 }],
    correct: { type: Number, required: true },
});

module.exports = model('Quiz', schema);
