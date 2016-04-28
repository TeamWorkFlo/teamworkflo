function getGanttTasks(json_tasks){
  var gantt_tasks = [];


 for(var i=0;i<json_tasks.length;i++){
       
        var obj = json_tasks[i];
        var task_name = obj['id'] + " - "+obj['name'];

//alert(obj['startDate']*1000 +""+ obj['endDate']*1000);


var intervals = [{
    name:task_name,
    from:obj['startDate']*1000,
    to:obj['endDate']*1000,
    label:obj['actor']
    
}];


var task = {
    name:task_name,
    actor:obj['actor'],
    description:obj['description'],
    intervals:intervals
    
};

        gantt_tasks.push(task);
    }

    return gantt_tasks;
}


function getTaskNames(json_tasks){
  var task_names = [];


 for(var i=0;i<json_tasks.length;i++){
       
        var obj = json_tasks[i];
        var task_name = obj['id'] + " - "+obj['name'];
        task_names.splice(0,0,task_name);
    }

    return task_names;
}



 function showChart(task_string) {
        //potentially we could receive two dates here, and use them to filter 
        //what data are we going to show on the visualization
        var tasks = getGanttTasks(task_string);
        var task_names = getTaskNames(task_string);
        
       
        
        // re-structure the tasks into line seriesvar series = [];
        var series = [];
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
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'viz_one' //This might change, its the id of the first visualization
            },

            title: {
                text: ''
            },

            xAxis: {
                type: 'datetime',
                min: new Date('2016/04/10').getTime(), //This would need to change depending on the time window the user select
                max: new Date('2016/04/17').getTime(), //This would need to change depending on the time window the user select
                
            },

            yAxis: {

                categories: task_names,
                tickInterval: 1,            
                tickPixelInterval: 200,
                labels: {
                    style: {
                        color: '#525151',
                        font: '12px Helvetica',
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
                minPadding: 0.2,
                maxPadding: 0.2,
                   fontSize:'15px'
                
            },

            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ tasks[this.y].name + '</b><br/>' +
                        "Actor: "+ tasks[this.y].actor +'</b><br/>' +
                        "Description: "+tasks[this.y].description; 

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
                        formatter: function() {
                            return this.point.options && this.point.options.label;
                        }
                    }
                }
            },

            series: series

        });      
     };