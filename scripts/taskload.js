
var render = function(element) {
  var vwFilter = function(task) { return true; }
  var results = function (tasks) {
    d3.select(element)
    .selectAll("svg")
    .data(tasks)
    .enter()
    .append("svg")
    .attr("width",200)
    .attr("height",200)
    .append("circle")
    .attr("cx",25)
    .attr("cy",25)
    .attr("r",25)
    .style("fill", "gold");
    /*
    <svg width="50" height="50">
2  <circle cx="25" cy="25" r="25" fill="purple" />
3</svg>
*/
  };
    
  taskManager.getTasks({filter:vwFilter,results:results}); 
};

var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis1-body");