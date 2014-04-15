var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/node_chapter_8");

var Photo = mongoose.model("Photo", { name: String });


var app;

router.setApp = function(a) {
  app = a;
};

/* GET photos listing. */
router.get('/', function(req, res) {
  Photo.find(function(err, photos){
    res.render('photos/index', { photos: photos });
  });
});

router.get('/new', function(req, res) {
  res.render('photos/new', { });
});

router.post("/", function(req, res) {
  var photo = new Photo();
  photo.name = req.body.name;
  photo.save(function(err) {
    if (err) throw err;
    res.redirect("/photos");
  });
});

module.exports = router;
