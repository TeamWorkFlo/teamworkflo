
var render = function(element) {
  var vwFilter = function(task) { 
    if (task.actor == ""){
        return false;
    }
    return true; 
    }
  //var compNames = getComponentList(tasks);
  
  function recompileArray(taskArray){
    //first, get list of component names
    var compNames = getComponentList(taskArray);
    //console.log(compNames.length);
    var compLayerTasks = createComponentLayer(taskArray, compNames);
    //console.log(compLayerTasks.length);
    return compLayerTasks;
  }

    function getFeatureList(taskArray){
    var featureNames = Array();
    var nameUsed = 0;
    for (var i = 0; i < taskArray.length; i++){
        nameUsed = 0;
        for (var j = 0; j < featureNames.length; j++){
            if (taskArray[i].feature == featureNames[j]){
                nameUsed = 1;
                break;
            }
        } 
        if (nameUsed != 1){
            featureNames.push(taskArray[i].feature);
        }
    }
    return featureNames;
  }

  function createFeatureLayer(taskArray, featureNames){
    var results = Array();
    //create a subarray for each component
    for (var i = 0; i < featureNames.length; i++){
        var temp = Array();
        for (var j = 0; j < taskArray.length; j++){
            if (taskArray[j].feature == featureNames[i]){
                temp.push(taskArray[j]);
            }
        }
        console.log("Number of items in feature " + featureNames[i] + ": " + temp.length);
        results[featureNames[i]] = temp;
    }

    return results;
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
        var tempFeatureNames = getFeatureList(temp);
        console.log(tempFeatureNames.length);
        var tempFeatureLayer = createFeatureLayer(temp, tempFeatureNames);

        results[componentNames[i]] = tempFeatureLayer;
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
  
  function determineTaskValue(task){
    if (task.importance == "Low")
        return 1;
    else if (task.importance == "Medium")
        return 3;
    else if (task.importance == "High")
        return 5;
    return 0;
  }

  

  var results = function(tasks) {
        var reformattedTasks = recompileArray(tasks);
        var compKeyList = Object.keys(tasks);
        var updatedTasks = Array();
        var compI = 0;

        //for (component in reformattedTasks){
        for (component in tasks){
            var c = component;
            var componentID = "id_" + compI;
            var featI = 0;
            var compS = 0;
            //create component segment for graph
            var compP = {
                id: componentID,
                name: compKeyList[compI]
            };
            var featKeyList = Object.keys(tasks[component]);
            for (feature in tasks[component]){
                var f = feature;
                var featureID = componentID + "_" + featI; 
                var taskI = 0;
                var featS = 0;
                // create feature segment for graph
                var featP = {
                    id: featureID,
                    name:tasks[component][feature],
                    parent:componentID
                };
                //var taskKeyList = Object.keys(tasks[component][feature]);
                for (task in feature){
                    var taskID = featureID + "_" + taskI;
                    //create task segment for graph
                    var taskP ={
                        //actor:reformattedTasks[component][feature][task].actor,
                        //component:task.component,
                        name: "task " + task.id + "-" + task.name,
                        //description:task.description,
                        id: taskID,
                        parent:featureID,
                    }
                    taskP.value = determineTaskValue(task);
                    featS += taskP.value;
                    //console.log(taskID);
                    taskI++;
                }
                //console.log(featureID);
                featI++;
            }
            //console.log(componentID);
            compI++;
        }



       $(element).highcharts({
			series: [{
				type: "treemap",
				data: reformattedTasks
			}],
			title: {
				text: "Test Title"
			}
		});
    
  };

  //taskManager.getTasks({filter:vwFilter,results:results}); 
  var sampleTasks = {
    comp1:{
        feat1:{
            task1:{
                id:0,
                name:"task1",
            },
            task2:{
                id:1,
                name:"task12",
            }
        },
        feat2:{
            task1:{
                id:2,
                name:"task1",
            },
            task2:{
                id:3,
                name:"task2",
            }
        }
    },
    comp2:{
        feat1:{
            task1:{
                id:0,
                name:"task1",
            },
            task2:{
                id:1,
                name:"task12",
            }
        },
        feat2:{
            task1:{
                id:2,
                name:"task1",
            },
            task2:{
                id:3,
                name:"task2",
            }
        }
    }
};

results(sampleTasks);
};



var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);


vis.render("#vis1-body");