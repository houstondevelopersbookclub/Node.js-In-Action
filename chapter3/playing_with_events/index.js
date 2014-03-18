var net = require("net");
var events = require("events");

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on("join", function(id, client) {
  console.log("join = ", client);
  this.clients[id] = client;
  this.subscriptions[id] = function(senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  }
  this.on("broadcast", this.subscriptions[id]);
});

var server = net.createServer(function(client) {
  console.log("create server");
  var id = client.removeAddress + ":" + client.remotePort;
  console.log("join ", id, ":", client);
  channel.emit("join", id, client);
  client.on("connect", function() {
    console.log("connect");
    channel.emit("join", id, client);
  });
  client.on("data", function(data) {
    console.log("data ? ", data.toString());
    data = data.toString();
    channel.emit("broadcast", id, data);
  });
});

server.listen(8888);