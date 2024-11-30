const mongoose = require('mongoose');
const yup = require('yup');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  price: Number,
  available: Boolean
});

const Book = mongoose.model('Book', bookSchema);

const bookValidationSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  genre: yup.string().required(),
  price: yup.number().required().positive(),
  available: yup.boolean().required()
});

module.exports = { Book, bookValidationSchema };