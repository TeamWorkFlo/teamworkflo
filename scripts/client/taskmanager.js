
/* The TaskFilter is simply a function that,
given a task object, returns true or false
on whether that task should be returned.
This acts as a binary classifier. */
function TaskFilter(operation) {
  this.passes = operation;
}


/* The Task Manager is the client-side source
for tasks. It maintains the list of tasks and
allows for filtering to retrieve them.*/
// Task Manager
function TaskManager () {
  
  this.tasks = [];
  
  this.loadTasks = function () {
    // TODO load tasks from task aggregator
    this.tasks.push({id:40,
      assignee:"Eric",
      name:"Test",
      importance:"High",
      startDate:new Date(),
      estimatedTime: "2 hr"
      });
  }
  
  /* getTasks returns all tasks available that
  pass the provided filter rules. The parameter
  should be of type TaskFilter to behave correctly. */
   this.getTasks = function (filter) {
     var filteredTasks = [];
     var taskCount = this.tasks.length;
     for (task in this.tasks) {
       if (filter(task))
         filteredTasks.push(task);
     }
     return filteredTasks;
   }
}

taskManager = new TaskManager();
taskManager.loadTasks();