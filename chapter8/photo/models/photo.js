var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/node_chapter_8");

var Photo = mongoose.model("Photo", {
  name: String,
  image_path: String
});

module.exports = Photo;
