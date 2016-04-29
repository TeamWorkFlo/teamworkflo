
var render = function(element) {
  var vwFilter = function(task) { return true; }
  var results = function (tasks) {
    
  };
    
  //taskManager.getTasks({filter:vwFilter,results:results}); 
};

var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis3-body");