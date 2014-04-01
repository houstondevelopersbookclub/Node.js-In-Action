var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(" ");

var pg = require("pg");
var connectionString = "tcp://localhost:5432/node_fun";
var client = new pg.Client(connectionString);
client.connect(function(err) {
  if (err) throw err; // XOX Alper
  console.log("connected");

  switch(command) {
    case "list":
      listTasks(client);
      break;
    case "add":
      addTask(client, taskDescription);
      break;
    default:
      console.log("Usage " + process.argv[0] + " list|add [taskDescription]");
      client.end();
  }
  
});

function listTasks(client) {
  client.query("SELECT description FROM Tasks", function(err, result) {
    if (err) throw err;
    console.log("##########");
    for(var i in result.rows) {
      row = result.rows[i];
      console.log("[" + i + "] : " + row.description);
    }
    console.log("##########");
    client.end();
  });
}

function addTask(client, taskDescription) {
  client.query("INSERT INTO Tasks (description) VALUES ($1)", [taskDescription], function(err) {
    if (err) throw err;
    console.log("Task - '" + taskDescription + "' inserted successfully");
    client.end();
  });
}
