
var taskloadRender = function(renderContext,filterContext) {
  var vwFilter = function(task) { 
    //filter out blank tasks (unassigned tasks)
    if (task.actor == ""){
        return false;
    }
    else{
        //var testContext = new FilterContext({'actor':'','component':'','feature':'',
         //'milestone':'', 'startTime':'','endTime':''});
        /*
        //filter by milestone
        //return filterByMilestone(task,"") //all tasks
        return filterByMilestone(task,"Functional Prototype"); //only tasks in functional prototype
        */

        /*
        //filter by timeWindow
        //return filterOverTimeWindow(task,"",""); //all tasks
        //return filterOverTimeWindow(task,"1460678400",""); //tasks in progress after 4/15
        return filterOverTimeWindow(task,"","1460678400"); //tasks completed by 4/15
        //return filterOverTimeWindow(task,"1460678400","1461628800"); //tasks from 4/15 - 4/26
        */

        return overallTaskFilter(task,filterContext);

        //no other filters set
        return true;
    }
    
    }
  
  
    function overallTaskFilter(task,filterContext){
        var actorResult = filterByActor(task,filterContext);
        var componentResult = filterByComponent(task,filterContext);
        var featureResult = filterByFeature(task,filterContext);
        var milestoneResult = filterByMilestone(task,filterContext);
        var timeResult = filterOverTimeWindow(task,filterContext);

        return (actorResult && componentResult && featureResult && milestoneResult && timeResult); 
    }
    

  function filterByActor (task,filterContext){
    if ((filterContext.actor != "") && (filterContext.actor !="All")){
        if (!task.actor.includes(filterContext.actor))
            return false;
        return true;
    }
    else{
        //no actor specified; all tasks are good
        return true;
    }
  }

  function filterByMilestone(task,filterContext){
    if ((filterContext.milestone != "") && (filterContext.milestone != "All") ){
        if (task.milestone != filterContext.milestone)
            return false;
        return true;
    }
    else{
        //no milestone specified; all tasks are good
        return true;
    }
  }

  //function filterByComponent(task,component){
    function filterByComponent(task,filterContext){
    if (filterContext.component == ""){
        return true;
    }
    //filter out tasks not from component
    if (task.component != filterContext.component)
        return false;
    return true;
  }

   function filterByFeature(task,filterContext){
    if (filterContext.feature == ""){
        return true;
    }
    //filter out tasks not from feature
    if (task.feature != filterContext.feature)
        return false;
    return true;
  }

  /*
        Return false if a task is completed before startTime; else, return true
  */
  function filterByStartTime(task,filterContext){
    if (filterContext.startTime !== null){
        //task has been completed
        if (task.completionDate != "" && task.completionDate !== null){
            var completeDate = convertTimestampToDate(task.completionDate);
            var completeTime = completeDate.getTime()/1000;
            //var startDate = convertTimestampToDate(startTime);
            if (completeTime < filterContext.startTime)
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
  function filterByEndTime(task,filterContext){
    if (filterContext.endTime !== null){
        //task has been started
        if (task.startDate != "" && task.startDate !== null){
            var startingDate = convertTimestampToDate(task.startDate);
            var startTime = startingDate.getTime()/1000;
            //var startDate = convertTimestampToDate(startTime);
            if (filterContext.endTime < startTime)
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
  function filterOverTimeWindow(task,filterContext){
    var passStartFilter = !filterContext.hasOwnProperty('startTime') || filterByStartTime(task,filterContext);
    var passEndFilter = !filterContext.hasOwnProperty('endTime') || filterByEndTime(task,filterContext);
    return (passStartFilter && passEndFilter);
  }

  function convertTimestampToDate(timestamp){
    var match = timestamp.match(/^(\d+)\/(\d+)\/(\d+) (\d+)\:(\d+)\:(\d+)$/)
    var date = new Date(match[3], match[1] - 1, match[2], match[4], match[5], match[6])
    return date;
  }

  function recompileArray(taskArray){
    //first, get list of component names
    var compNames = getComponentList(taskArray);
    var compLayerTasks = createComponentLayer(taskArray, compNames);
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
    var taskStatus = determineStatus(task);
    if (task.actor == "Cullen Brown"){

        if(taskStatus == "Completed"){
            //return "#FF8E3A";
            return "#ED2A2A";
        }
        else if (taskStatus == "In Progress"){
            return "#FF5858";
        }
        else{
            return "#FFA8A8";
        }
        return "#ED2A2A";
    }
    else if (task.actor == "Eric Gonzalez"){
        if(taskStatus == "Completed"){
            return "#EDBC2A";
        }
        else if (taskStatus == "In Progress"){
            return "#FFD558";
        }
        else{
            return "#FFE9A8";
        }
        return "#EDBC2A";
    }
    else if (task.actor == "Aqib Bhat"){
        if(taskStatus == "Completed"){
            return "#22BE22";
        }
        else if (taskStatus == "In Progress"){
            return "#55F855";
        }
        else{
            return "#8AD18A";
        }
        return "#22BE22";
    }
    else if (task.actor == "Jorge Herrera"){
        if(taskStatus == "Completed"){
            return "#3232A6";
        }
        else if (taskStatus == "In Progress"){
            return "#6C6CF4";
        }
        else{
            return "#8484BA";
        }
        return "#3232A6";
    }
    else{
        if(taskStatus == "Completed"){
            return '#999999';
        }
        else if (taskStatus == "In Progress"){
            return "#cccccc";
        }
        else{
            return "#eeeeee";
        }
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
                    taskI++;
                }
                featP.actor = flattenActorList(taskActors);
                for (var i = 0; i < taskActors.length; i++){
                    if ($.inArray(taskActors[i], featActors) == -1){
                        featActors.push(taskActors[i]);
                    }
                }
                featP.value = featS;
                updatedTasks.push(featP);
                compS += featS;
                featI++;
            }
            compP.actor = flattenActorList(featActors);
            compP.value = compS;
            updatedTasks.push(compP);
            compI++;
        }

     $(renderContext.renderElement).html('');


       $(renderContext.renderElement).highcharts({
			series: [{
				type: "treemap",
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                animationLimit: 1000,
                reflow: false,
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
                color:"rgba(127,127,127,0)"

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
				//text: "Group Taskload"
                text:""
			}
		});
    
  };
  taskManager.getTasks({filter:vwFilter,results:callResults}); 
};
