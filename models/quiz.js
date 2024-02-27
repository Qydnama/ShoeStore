const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number
});

exports.Quiz = mongoose.model('Quiz', quizSchema);

