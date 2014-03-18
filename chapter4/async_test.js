async = require("async");

foo = function(callback) {
  console.log("foo");
  callback();
}

bar = function(callback) {
  setTimeout(function() {
    callback("SUPER BAD ERROR");  
  });
}

try {
  async.series({
    one: foo,
    two: bar,
    three: bar,
  }, function(err, results) {
    console.log("err", err);
    if (err) {
      throw err;
    }
  });
} catch(e) {
  console.log("CATCH?");
}