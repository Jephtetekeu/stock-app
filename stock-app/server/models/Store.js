const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  currency: {
    type: String,
    default: '$',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Store', StoreSchema);