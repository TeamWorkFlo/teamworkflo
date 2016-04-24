
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
    
    // Extract tasks from worklog
      $(entry).each(function(){
        // Column names are TaskID; Actor; component:feature:task; Description; Status; Milestone;
        //   Importance; StartTime; CompletionTime; EstimatedTimeRequired;
        var task = new Task();
        task.id = this.gsx$TaskID.$t;
        task.actor = this.gsx$Actor.$t;
        var components = this.gsx$component/feature/task.$t.split("/");
        task.component = components[0];
        task.feature = components[1];
        task.task = components[2];
        task.description = this.gsx$Description.$t;
        task.status = this.gsx$Status.$t;
        task.milestone = this.gsx$Milestone.$t;
        task.importance = this.gsx$StartTime.$t;
        task.startDate = this.gsx$StartDate.$t;
        task.completionDate = this.gsx$CompletionDate.$t;
        task.estimatedTime = this.gsx$EstimatedTimeRequired.$t;
        this.tasks.push(task);
      });
      
      var length = this.queue.length;
      while (this.queue.length) {
        processTasks(this.queue.pop());
      }
    
    });
  }
  
  /* getTasks returns all tasks available that
  pass the provided filter rules. The parameter
  should be of type TaskFilter to behave correctly. */
   this.getTasks = function (callback) {
     if (this.tasks.length > 0) {
      this.processTasks(callback);
     }
     else {
       queue.append(callback);
     }
   }
   
   this.processTasks = function(callback) {
      var filteredTasks = [];
      var taskCount = this.tasks.length;
      for (task in this.tasks) {
        if (callback.filter(task))
          filteredTasks.push(task);
      }
      callback.results(filteredTasks);
   }
}

taskManager = new TaskManager();
taskManager.loadTasks();