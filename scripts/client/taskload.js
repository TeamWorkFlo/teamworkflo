
var render = function(element) {
  var vwFilter = function(task) { return true; }
  
  var tasks = taskManager.getTasks(vwFilter);
    d3.select(element).
    selectAll("p").
    data(tasks).
    enter().
    append("p").
    text("hello");
};

var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis1-body");