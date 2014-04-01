var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(" ");

var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1");

client.on("error", function(err) {
  console.log("Redis Error " + err);
});

switch(command) {
  case "list":
    listTasks(client);
    break;
  case "add":
    addTask(client, taskDescription);
    break;
  default:
    console.log("Usage " + process.argv[0] + " list|add [taskDescription]");
}

function listTasks(client) {
  client.hkeys("tasks", function(err, keys) {
    keys.forEach(function(key, i) {
      client.hget("tasks", key, function(err, result) {
        client.end();
      });
    });
  });
}

function addTask(client, taskDescription) {
  var tasks = {};
  var id = Math.floor(Math.random() * 10000);
  tasks[id] = taskDescription;
  client.hmset("tasks", tasks, function(err) {
    if (err) throw err;
    console.log("Task added : '" + taskDescription + "'");
    client.end();
  });
}
