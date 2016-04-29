
var render = function(element) {
  var vwFilter = function(task) { 
    //filter out blank tasks (unassigned tasks)
    if (task.actor == ""){
        return false;
    }
    else{
        /*
        //filter by milestone
        return filterByMilestone(task,"")
        */

        //filter by timeWindow
        //return filterOverTimeWindow(task,"",""); //all tasks
        //return filterOverTimeWindow(task,"1460678400",""); //tasks in progress after 4/15
        //return filterOverTimeWindow(task,"","1460678400"); //tasks completed 4/15
        //return filterOverTimeWindow(task,"1460678400","1461628800"); //tasks from 4/15 - 4/26

        //filter by actor
        return filterByActor(task,"Cullen Brown"); //tasks assigned to Cullen Brown
    }
    
    }
  
  function filterByActor (task,actor){
    if (actor != ""){
        if (!task.actor.includes(actor))
            return false;
        return true;
    }
    else{
        //no actor specified; all tasks are good
        return true;
    }
  }

  function filterByMilestone(task,milestone){
    //add case for no filter
    if (milestone == ""){
        return true;
    }
    //filter out tasks not from milestone
    if (task.milestone != milestone)
        return false;
    return true;
  }

  /*
        Return false if a task is completed before startTime; else, return true
  */
  function filterByStartTime(task,startTime){
    if (startTime != ""){
        //task has been completed
        if (task.completionDate != ""){
            var completeDate = convertTimestampToDate(task.completionDate);
            var completeTime = completeDate.getTime()/1000;
            //var startDate = convertTimestampToDate(startTime);
            if (completeTime < startTime)
                return false;
            return true;
        }
        //return true otherwise (task still in process)
        return true;
    }
    else{
        //no limiting start time; return all tasks from beginning of time until now
        return true;
    }
  }

  /*
        Return false if a task is started after the endTime; else, return true
  */
  function filterByEndTime(task,endTime){
    if (endTime != ""){
        //task has been started
        if (task.startDate != ""){
            var startingDate = convertTimestampToDate(task.startDate);
            var startTime = startingDate.getTime()/1000;
            //var startDate = convertTimestampToDate(startTime);
            if (endTime < startTime)
                return false;
            return true;
        }
        //return true otherwise (task not started)
        return true;
    }
    else{
        //no limiting end time; return all tasks from now to end of time
        return true;
    }
  }

  /*
        Return true if task not filtered out by either startTime or endTime
  */
  function filterOverTimeWindow(task,startTime,endTime){
    var passStartFilter = filterByStartTime(task,startTime);
    var passEndFilter = filterByEndTime(task,endTime);
    if (passStartFilter && passEndFilter)
        return true;
    return false;
  }

  function convertTimestampToDate(timestamp){
    var match = timestamp.match(/^(\d+)\/(\d+)\/(\d+) (\d+)\:(\d+)\:(\d+)$/)
    var date = new Date(match[3], match[1] - 1, match[2], match[4], match[5], match[6])
    return date;
  }

  function recompileArray(taskArray){
    //first, get list of component names
    var compNames = getComponentList(taskArray);
    //console.log(compNames.length);
    var compLayerTasks = createComponentLayer(taskArray, compNames);
    //console.log(compLayerTasks.length);
    return compLayerTasks;
  }

    function flattenActorList(actorList){
        var actorNameString = "";
        for (var i = 0; i < actorList.length-1; i++){
            actorNameString += actorList[i] + ", ";
        }
        actorNameString+=actorList[actorList.length-1];
    return actorNameString;
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
        return 9;
    return 2;
  }

  
  function callResults(tasks){
    results(recompileArray(tasks));
  }


  function determineColor(task){
    if (task.actor == "Cullen Brown"){
        return '#E25F9D';
    }
    else if (task.actor == "Eric Gonzalez"){
        return '#58D27D';
    }
    else if (task.actor == "Aqib Bhat"){
        return '#FF7F6B';
    }
    else if (task.actor == "Jorge Herrera"){
        return '#BAF165';
    }
    else{
        return '#999999';
    }
  }

  function determineStatus(task){
    if (task.startDate != ""){
        if (task.completionDate != ""){
            return "Completed";
        }
        else{
            return "In Progress";
        }
    }
    else{
        return "Not Started";
    }

  }

  function setToolTip(task){
    var tip = Array();
    tip.backgroundColor = "(0,0,0,0)";
    return tip;
  }

  var results = function(tasks) {
        //var reformattedTasks = recompileArray(tasks);
        var compKeyList = Object.keys(tasks);
        var updatedTasks = Array();
        var compI = 0;

        for (component in tasks){
            var featI = 0;
            var compS = 0;
            //create component segment for graph
            var compP = {
                id: "id_" + compI,
                name: compKeyList[compI],
                description:"",
                startTime: "",
                endTime: "",
                status:""
            };
            var featKeyList = Object.keys(tasks[component]);
            var featActors = Array();
            for (feature in tasks[component]){
                var taskI = 0;
                var featS = 0;
                // create feature segment for graph
                var featP = {
                    id: compP.id + "_" + featI,
                    name:featKeyList[featI],
                    parent:compP.id,
                    description:"",
                    startTime: "",
                    endTime: "",
                    status:""
                };
                //var taskKeyList = Object.keys(tasks[component][feature]);
                var taskActors = Array();
                for (task in tasks[component][feature]){
                    //create task segment for graph
                    var taskP ={
                        actor:tasks[component][feature][task].actor,
                        //name: "task/" + tasks[component][feature][task].id + "-" + tasks[component][feature][task].name,
                        name:tasks[component][feature][task].name,
                        id: featP.id + "_" + taskI,
                        parent:featP.id,
                        description: tasks[component][feature][task].description,
                        startTime: tasks[component][feature][task].startDate,
                        endTime: tasks[component][feature][task].completionDate,
                        status:""
                    }
                    
                    taskP.value = determineTaskValue(tasks[component][feature][task]);
                    taskP.color = determineColor(tasks[component][feature][task]);
                    taskP.status = determineStatus(tasks[component][feature][task]);
                    //taskP.tooltip = setToolTip(tasks[component][feature][task]);

                    if ($.inArray(taskP.actor, taskActors) == -1){
                        taskActors.push(taskP.actor);
                    }

                    updatedTasks.push(taskP);
                    featS += taskP.value;
                    //console.log(taskID);
                    taskI++;
                }
                featP.actor = flattenActorList(taskActors);
                for (var i = 0; i < taskActors.length; i++){
                    if ($.inArray(taskActors[i], featActors) == -1){
                        featActors.push(taskActors[i]);
                    }
                }
                //console.log(featureID);
                featP.value = featS;
                updatedTasks.push(featP);
                compS += featS;
                featI++;
            }
            //console.log(componentID);
            compP.actor = flattenActorList(featActors);
            compP.value = compS;
            updatedTasks.push(compP);
            compI++;
        }



       $(element).highcharts({
			series: [{
				type: "treemap",
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                animationLimit: 1000,
                dataLabels: {
                enabled: false
                },

                levelIsConstant: false,
                levels: [{
                level: 1,
                dataLabels: {
                    enabled: true
                },
                borderWidth: 3,

                },{
                level:2,
                //layoutAlgorithm: "stripes"
                //dataLabels:{
                //    formatter: function(){
                //        return '<b>Name: </b>' + this.point.name;
                //    }
                //},
                             
                }],

				data: updatedTasks,

                tooltip:{
                    backgroundColor:'#00ffff',
                    formatter: function() 
                    {    
                        return '<b>Actor(s): </b>' + this.point.actor;
                    }
                }
   
			}],
            tooltip:{
                formatter: function() {
                        return '<b>Name: </b>' + this.point.name + '<br>' 
                        + '<b>Assignee(s): </b>' + this.point.actor + '<br>'
                        + this.point.description + '<br>'
                        + '<b>' + this.point.status + '</b>';
                        
                    //return '<b>Actor(s): </b>' + this.point.actor + '</br>' ;
               },
            },
            subtitle:{
                text: 'Tasks grouped by features and components, colored by actor. Click components to drill down'
            },
			title: {
				text: "Group Taskload"
			}
		});
    
  };
  taskManager.getTasks({filter:vwFilter,results:callResults}); 
};



var configuration = { name:"Taskload", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis1-body");