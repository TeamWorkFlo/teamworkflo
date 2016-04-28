
/*
    Parse through task list to make components
*/
/*
function getComponentList(taskArray){
    var componentNames = Array();
    var nameUsed = 0;
    for (var i = 0; i < tasks.length; i++){
        nameUsed = 0;
        for (var j = 0; j < componentNames.length; j++){
            if (taskArray[i].component == componentNames[j]){
                nameUsed = 1;
                break;
            }
        } 
        if (nameUsed != 1){
            componentNames.push(taskArray[i].component);
        }
    }
    return componentNames;
}
*/
var render = function(element) {
  var vwFilter = function(task) { return true; }
  //var compNames = getComponentList(tasks);
  
  var compNames = function getComponentList(taskArray){
    var componentNames = Array();
    var nameUsed = 0;
    for (var i = 0; i < tasks.length; i++){
        nameUsed = 0;
        for (var j = 0; j < componentNames.length; j++){
            if (taskArray[i].component == componentNames[j]){
                nameUsed = 1;
                break;
            }
        } 
        if (nameUsed != 1){
            componentNames.push(taskArray[i].component);
        }
    }
    return componentNames;
};
  
  var results = function(tasks) {
       $(element).highcharts({
			series: [{
				type: "treemap",
				data: tasks
			}],
			title: {
				text: "Test Title"
			}
		});
    
  };
    
  taskManager.getTasks({filter:vwFilter,results:results}); 
};

var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);


vis.render("#vis1-body");