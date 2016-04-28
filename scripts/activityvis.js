

var activityCompare = function(a,b) {
  var aTime = a.x;
  var bTime = b.x;
  return bTime - aTime;
}

var render = function(element) {
  var vwFilter = function(activity) { return true; }
  var activityCallback = function (activities) {
   
    var actorArr = [{
      name: "Aqib Bhat",
      data: new buckets.PriorityQueue()
    },{
      name: "Cullen Brown",
      data: new buckets.PriorityQueue()
    },{
      name: "Eric Gonzalez",
      data: new buckets.PriorityQueue()
    },{
      name: "Jorge Herrera",
      data: new buckets.PriorityQueue()
    }];
    $.each(activities, function(key, data) {
      var actor = data.actor;
      
      var actorActivity = actorArr[actor];
      
      var source = data.source;
      var sourceSeries = actorActivity[source];
      
      var entry = {x:data.timestamp,y:source}
      
      sourceSeries.add(entry);
    });
    
    $(element).highcharts({
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Team Activity'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Team Member'
        }
      },
      legend: {
        enabled: false
      },
      series: [{data:[1,2,3,5,6,1]}]
    });
  };
    
  activityManager.getActivity({filter:vwFilter,results:activityCallback}); 
};

var configuration = { name:"Activity", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis1-body");