const mongoose = require('mongoose');

const ClothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
});

const ClothingItem = mongoose.model('ClothingItem', ClothingItemSchema);

module.exports = ClothingItem;
