var connect = require("connect");
var fs = require("fs");
var parse = require("url").parse;
var join = require("path").join;

var app = connect();

function logger(req, res, next) {
  console.log("%s %s", req.method, req.url);
  next();
}

function hello(req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  res.end("hello world");
}

function goodTimes(req, res, next) {
  if (req.url === "/error") {
    next({ crazy_error: true });
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.end("good times @ " + req.url);
  }
}

function serveStaticFile(req, res, next) {
  var url = parse(req.url);
  var path = join(__dirname, url.pathname);

  fs.stat(path, function(err, stat) {
    if (err) {
      if ("ENOENT" == err.code) {
        next();
      } else {
        res.statusCode = 500;
        res.end("ERROR - You stink!");
      }
    } else {
      res.setHeader("Content-Length", stat.size)
      var stream = fs.createReadStream(path);
      stream.pipe(res);
      stream.on("end", function() {
        console.log("end");
        res.end();
      });
      stream.on("error", function(er) {
        console.log("error", er);
      });
    }
  });
}

function errorHandler(err, req, res, next) {
  console.log("ERROR HANDLER");
  if (err.crazy_error === true) {
    next(err);
  } else {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(err));
  }
}

function goodTimesErrorHandler(err, req, res, next) {
  console.log("good times error handler");
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  error_json = { message: "There are no errors when everyone is having a good time."};
  res.end(JSON.stringify(error_json));
}

function crazyIdeaErrorHandler(err, req, res, next) {
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  err.crazy = "CRAZY!";
  res.end(JSON.stringify(err));
}

function foo(req, res, next) {
  console.log("foo ? ", req.url);
  if (req.url === "/foo") {
    res.setHeader("Content-Type", "application/json");
    message = {
      message: "It worked!"
    };
    res.end(JSON.stringify(message));
  } else {
    next();
  }
}

function magic(req, res, next) {
  if (req.url === "/magic") {
    req.url = "/foo";
  }
  next();
}

app.use(logger);
app.use("/good_times", goodTimes);
app.use("/good_times", goodTimesErrorHandler);
app.use("/good", goodTimes);
app.use(magic);
app.use(serveStaticFile);
app.use(foo);
app.use(hello);
app.use(errorHandler);
app.use(crazyIdeaErrorHandler);
app.listen(3000);
