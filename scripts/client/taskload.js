
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
  
  function recompileArray(taskArray){
    //first, get list of component names
    var compNames = getComponentList(taskArray);
    console.log(compNames.length);
    var compLayerTasks = createComponentLayer(taskArray, compNames);
    console.log(compLayerTasks.length);
  }

  function createComponentLayer(taskArray, componentNames){
    var results = Array();
    //create a subarray for each component
    for (var i = 0; i < componentNames.length; i++){
        var temp = Array();
        for (var j = 0; j < taskArray.length; j++){
            if (taskArray[j].component == componentNames[i]){
                temp.push(taskArray[j]);
            }
        }
        results[componentNames[i]] = temp;
    }
    return results;
  }

  function getComponentList(taskArray){
    var componentNames = Array();
    var nameUsed = 0;
    for (var i = 0; i < taskArray.length; i++){
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
        var reformattedTasks = recompileArray(tasks);
        
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