
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
  this.queue = [];
  
  this.loadTasks = function () {
 
    // ID of the Google Spreadsheet
    var spreadsheetID = "1UUJAbPlcJ9ODmTmRNrNEG3tkGhjTF2c4WIwCG_RbKck";
    
    // Make sure it is public or set to Anyone with link can view 
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
    
    $.getJSON(url, function(data) {
    
      var entry = data.feed.entry;
    
    var ts = [];
    // Extract tasks from worklog
      $(entry).each(function(){
        // Column names are TaskID; Actor; component:feature:task; Description; Status; Milestone;
        //   Importance; StartTime; CompletionTime; EstimatedTimeRequired;
        var task = {};
        task.id = this.gsx$taskid.$t;
        task.actor = this.gsx$actor.$t;
        task.component = this.gsx$component.$t;
        task.feature = this.gsx$feature.$t;
        task.name = this.gsx$name.$t;
        task.description = this.gsx$description.$t;
        task.milestone = this.gsx$milestone.$t;
        task.importance = this.gsx$importance.$t;
        task.startDate = this.gsx$starttime.$t;
        task.completionDate = this.gsx$completiontime.$t;
        task.estimatedTime = this.gsx$estimatedtimerequired.$t;
        taskManager.tasks.push(task);
      });
      
      while (taskManager.queue.length) {
        taskManager.processTasks(taskManager.queue.pop());
      }
    
    });
  }
  
  /* getTasks returns all tasks available that
  pass the provided filter rules. The parameter
  should be of type TaskFilter to behave correctly. */
   this.getTasks = function (callback) {
     if (taskManager.tasks.length > 0) {
      taskManager.processTasks(callback);
     }
     else {
       taskManager.queue.push(callback);
     }
   }
   
   this.processTasks = function(callback) {
      var filteredTasks = [];
      var taskCount = this.tasks.length;
      for(var i = 0; i < taskCount; i++){   
        if (callback.filter(this.tasks[i]))
          filteredTasks.push(this.tasks[i]);
      }
      
      callback.results(filteredTasks);
   }
}

taskManager = new TaskManager();
taskManager.loadTasks();