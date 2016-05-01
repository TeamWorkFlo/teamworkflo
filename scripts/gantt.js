
//var task_milestones = {};



// function setPaginationEvents(){
// $( "#next" ).click(function() {
//   alert( "Show next" );
// });

// $( "#prev" ).click(function() {
//   alert( "Show prev" );
// });
// }

//var task_names = [];

function getUnixTimestamp(date_string){
var newdate = new Date(date_string);
return newdate.getTime();
}


function getDateFromString(date_string){
var newdate = new Date(date_string);
return newdate;
}

function getDateFromUnixTimestamp(unix_timestamp){
    return new Date(unix_timestamp);
}


function getGanttTasks(json_tasks,milestone,actor,startDate, endDate){
  var gantt_tasks = [];
 // task_names = [];
  for(var i=0;i<json_tasks.length;i++){

    var obj = json_tasks[i];
        //var task_name = obj['id'] + " - "+obj['name'];
        var task_id = obj['id'];
         var task_name = obj['name'];
         var start_date = getDateFromString(obj['startDate']);
         var end_date = getDateFromString(obj['completionDate']);

       

        if((obj['milestone']==milestone || milestone=='All') && (obj['actor']==actor || actor=='All')&& ( (start_date>startDate && start_date<endDate) || (end_date<endDate &&end_date>startDate) )){
//alert(obj['startDate']*1000 +""+ obj['endDate']*1000);

var intervals = [{
    from: getUnixTimestamp(obj['startDate']),
    to: getUnixTimestamp(obj['completionDate']),
    label:obj['actor']
    
}];


var task = {
    taskid:task_id,
    name:task_name,
    actor:obj['actor'],
    description:obj['description'],
    intervals:intervals
    
};
//task_names.push(obj['name']);
//alert(task_id+"---"+getDateFromString(obj['startDate']) + getDateFromString(obj['startDate']));
gantt_tasks.push(task);
}




}

return gantt_tasks;
}


// function getTaskNames(json_tasks){
//     return task_names;
// }

function getTaskNames(json_tasks){
  var task_names = [];


  for(var i=0;i<json_tasks.length;i++){

    var obj = json_tasks[i];
        //var task_name = obj['id'] + " - "+obj['name'];
        var task_name = obj['name'];
        task_names.splice(0,0,task_name);
    }

    return task_names;
}




function getMilestones(json_tasks){
  var task_milestones = [];

  for(var i=0;i<json_tasks.length;i++){

    var obj = json_tasks[i];
    var current_milestone = obj['milestone'];
    if(jQuery.inArray(current_milestone, task_milestones) == -1){
        task_milestones.push(current_milestone);
    }
}

return task_milestones;
}



// function getPreviousDate(date){
//     return date.setTime( date.getTime() - 1 * 86400000 );
// }

// function getNextDate(date){
//     return date.setTime( date.getTime() + 1 * 86400000 );;
// }



var ganttRender = function(renderContext,filterContext) {

  var vwFilter = function(task_array) { 
    return true;
}

var results = function (tasks) {

    var tasks = getGanttTasks(tasks,filterContext.milestone, filterContext.actor, new Date(filterContext.startTime*1000), new Date(filterContext.endTime*1000));
    var task_names = getTaskNames(tasks);
    //var date = new Date(date);


        // re-structure the tasks into line seriesvar series = [];
        var series = [ {'reflow': false}];
        $.each(tasks.reverse(), function(i, task) {
            var item = {
                name: task.name,
                data: []
            };
            $.each(task.intervals, function(j, interval) {
                item.data.push({
                    x: interval.from,
                    y: i,
                    label: interval.label,
                    from: interval.from,
                    to: interval.to
                }, {
                    x: interval.to,
                    y: i,
                    from: interval.from,
                    to: interval.to
                });
                
                // add a null value between intervals
                if (task.intervals[j + 1]) {
                    item.data.push(
                        [(interval.to + task.intervals[j + 1].from) / 2, null]
                        );
                }

            });

            series.push(item);
        });

        // restructure the milestones
        /*$.each(milestones, function(i, milestone) {
            var item = Highcharts.extend(milestone, {
                data: [[
                    milestone.time,
                    milestone.task
                ]],
                type: 'scatter'
            });
            series.push(item);
        });
*/

        // create the chart

        //alert(new Date(filterContext.startTime*1000));

        // alert(new Date(filterContext.endTime*1000));

            $(renderContext.renderElement).css({ 'height': tasks.length*20 + "px" });
            $(renderContext.renderElement).parent().css({ 'height': tasks.length*20 + "px" });
             
                  $(renderContext.renderElement).html('');

        $(renderContext.renderElement).highcharts({
            chart: {
                zoomType: 'y',                  
                panning: true,

                

            },
            colors: ['#7cb5ec'],

            title: {
                text: ''
            },

            xAxis: {
                type: 'datetime',
                 min: new Date(filterContext.startTime*1000).getTime(), //This would need to change depending on the time window the user select
                max: new Date(filterContext.endTime*1000).getTime(),//This would need to change depending on the time window the user select
                
            },

            yAxis: {

                categories: task_names,
                tickInterval: 1,            
                tickPixelInterval: 200,
                scalable: false,
                max:task_names.length,
                labels: {
                    style: {
                        color: '#525151',
                        font: '8px Helvetica',
                        fontWeight: 'bold'
                    },
                   /* formatter: function() {
                        if (tasks[this.value]) {
                            return tasks[this.value].name;
                        }
                    }*/
                },
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Tasks'
                },
                //minPadding: 0.2,
                //maxPadding: 0.2,
                fontSize:'15px'
                
            },

            scrollbar: {
               enabled: false
           },
           legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return '<b>ID: '+ tasks[this.y].taskid + '</b><br/>' +
                "<b>Name: </b>"+ tasks[this.y].name +'</b><br/>' +
                "<b>Actor: </b>"+ tasks[this.y].actor +'</b><br/>' +
                "<b>Description: </b>"+tasks[this.y].description  +'</b><br/>' +
                "<b>Start: </b>"+ getDateFromUnixTimestamp(this.point.options.from) +'</b><br/>' +
                "<b>End: </b>"+ getDateFromUnixTimestamp(this.point.options.to) +'</b><br/>'; 

                        // Highcharts.dateFormat('%m-%d-%Y', this.point.options.from)  +
                        // ' - ' + Highcharts.dateFormat('%m-%d-%Y', this.point.options.to)
                    }
                },

                plotOptions: {
                    line: {
                        lineWidth: 10,
                        marker: {
                            enabled: false
                        },
                        dataLabels: {
                            enabled: true,
                            align: 'left',
                            style: { fontFamily: '\'Lato\', sans-serif', lineHeight: '10px', fontSize: '8px'},
                            formatter: function() {
                                return this.point.options && this.point.options.label;
                            }
                        }
                    }
                },

                series: series
                


        

            },function(chart){
              
               // alert();

});   

};
taskManager.getTasks({filter:vwFilter,results:results}); 

}

// var configuration = { name:"Gantt", renderer:render };
// //setPaginationEvents();
// var vis = new Visualization(configuration);

// vis.render("#vis3-body");