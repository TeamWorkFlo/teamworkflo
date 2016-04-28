/* The Activity Manager is the client-side source
for activities. It maintains the list of activities and
allows for filtering to retrieve them.*/
// Activity Manager

// Here we can also define the activity filter

function ActivityFilter(operation) {
  this.passes = operation;
}


/* The Activity Manager is the client-side source
for activities. It maintains the list of activities and
allows for filtering to retrieve them.*/
// Activity Manager
function ActivityManager () {
  
  this.activities = [];
  this.queue = [];
  
  this.loadActivity = function () {
    $.getJSON("./twfapi/index.php?method=activities", function(data, status){
      activityManager.activities = data.data;
      
      while (activityManager.queue.length) {
          activityManager.processActivity(activityManager.queue.pop());
      }
    });
  }
  
  /* getTasks returns all tasks available that
  pass the provided filter rules. The parameter
  should be of type TaskFilter to behave correctly. */
   this.getActivity = function (callback) {
     if (activityManager.activities.length > 0) {
       activityManager.processActivity(callback);
     }
     else {
       activityManager.queue.push(callback);
     }
   }
   
   this.processActivity = function(callback) {
      var filteredActivity = [];
      var activityCount = activityManager.activities.length;
      for(var i = 0; i < activityCount; i++){  
        var activity =  activityManager.activities[i];
        if (callback.filter(activity))
          filteredActivity.push(activity);
      }
      
      callback.results(filteredActivity);
   }
}

activityManager = new ActivityManager();
activityManager.loadActivity();