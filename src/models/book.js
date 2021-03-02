const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: String,
  title: String,
  genre: String,
  pages: Number,
  price: Number,
  isFavourite: Boolean,
  authorID: String,
});

module.exports = mongoose.model('Book', bookSchema);