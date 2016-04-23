
/* The Task Manager is the client-side source
for tasks. It maintains the list of tasks and
allows for filtering to retrieve them.*/
// Task Manager

// Here we can also define the task filter

function TaskManager () {
  
  this.tasks = [];
  
  this.loadTasks = function () {
    // TODO load tasks from task aggregator
  }
  
   this.getTasks = function (filter) {
     var filteredTasks = [];
     var taskCount = tasks.length;
     for (task in tasks) {
       if (filter.passes(task))
         filteredTasks.push(task);
     }
     return filteredTasks;
   }
}