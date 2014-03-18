var http = require("http");
var eyes = require("eyes");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");

var items = ["Howdy", "Test Items"];
var root = __dirname;

var server = http.createServer(function(req, res) {
  console.log("request received");
  // eyes.inspect(req);
  switch(req.method) {
    case "PUT":
    case "POST":
      var item = "";
      req.setEncoding("utf8");
      req.on("data", function(chunk) {
        console.log("chunky");
        item += chunk;
      });
      req.on("end", function() {
        items.push(item);
        res.end("Item Added!");
      });
      break;
    case "GET":
      var url = parse(req.url);
      console.log(url);
      console.log(url.path);
      if (url.path === "/items") {
        returnItems(res);
      } else {
        var path = join(root, url.pathname);
        console.log("path", path);

        fs.stat(path, function(err, stat) {
          if (err) {
            if ("ENOENT" == err.code) {
              res.statusCode = 400;
              res.end("NOT FOUND");
            } else {
              res.statusCode = 500;
              res.end("ERROR - You stink!");
            }
          } else {
            res.setHeader("Content-Length", stat.size)
          }
        });

        var stream = fs.createReadStream(path);
        stream.pipe(res);
        stream.on("end", function() {
          console.log("end");
          res.end();
        });
        stream.on("error", function(er) {
          
        });
      }
      break;

  }
});

function returnItems(res) {
  items.forEach(function(item, i) {
    res.write(i + " : " + item + "\n");
  });
  res.end();
}

server.listen(3000);