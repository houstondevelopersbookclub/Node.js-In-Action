var Photo = require("../models/photo");

module.exports = function(app) {
  app.get('/photos', function(req, res) {
    Photo.find(function(err, photos){
      res.render('photos/index', { photos: photos });
    });
  });

  app.get('/photos/new', function(req, res) {
    res.render('photos/new', { });
  });

  app.post("/photos", function(req, res, next) {
    var photo = new Photo({
      name: req.body.name,
      image_path: req.files.image.path.replace("public", "")
    });
    photo.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/photos");
    });
  });
}
