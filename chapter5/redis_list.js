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
  client.lrange("tasks_list", 0, -1, function(err, tasks) {
    if (err) throw err;
    console.log("###########");
    tasks.forEach(function(task, i) {
      console.log(task);
    });
    console.log("###########");
    client.end();
  });
}

function addTask(client, taskDescription) {
  var tasks = {};
  client.rpush("tasks_list", taskDescription, function(err) {
    if (err) throw err;
    console.log("Task added : '" + taskDescription + "'");
    client.end();
  });
}
