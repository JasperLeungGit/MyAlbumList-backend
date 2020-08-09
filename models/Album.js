const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  artwork: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Album", AlbumSchema);
