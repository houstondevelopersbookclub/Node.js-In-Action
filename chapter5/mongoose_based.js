var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(" ");

var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/tasks");

var Schema = mongoose.Schema;
var Tasks = new Schema({
  description: String
});
mongoose.model("Task", Tasks);

switch(command) {
  case "list":
    listTasks(mongoose);
    break;
  case "add":
    addTask(mongoose, taskDescription);
    break;
  default:
    console.log("Usage " + process.argv[0] + " list|add [taskDescription]");
}

function listTasks(mongoose) {
  var Task = mongoose.model("Task");
  Task.find({}, function(err, tasks) {
    console.log("############");
    tasks.forEach(function(task, i) {
      console.log("[" + i + "] : " + task.description);
    })
    console.log("############");
    mongoose.disconnect();
  });
}

function addTask(mongoose, taskDescription) {
  var Task = mongoose.model("Task");
  var task = new Task();
  task.description = taskDescription;
  task.save(function(err) {
    if (err) throw err;
    console.log("Task added : '" + taskDescription + "'");
    mongoose.disconnect();
  });
}
