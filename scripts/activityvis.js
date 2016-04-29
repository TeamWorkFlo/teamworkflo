

var activityCompare = function(a,b) {
  var aTime = a.x;
  var bTime = b.x;
  return bTime - aTime;
}

var nameToIndex = function(name) {
  if (name === null)
    return -1;
  if (name.match(/jorge/i)) {
    return 3;
  }  
  if (name.match(/eric/i)) {
    return 2;
  }
  if (name.match(/cullen/i)) {
    return 1;
  }
  if (name.match(/aqib/i)) {
    return 0;
  }
  return -1;
}

var render = function(element) {
  var vwFilter = function(activity) { return true; }
  var activityCallback = function (activities) {
   
    var actorArr = [{
      name: "Aqib Bhat",
      data: new buckets.PriorityQueue(activityCompare)
    },{
      name: "Cullen Brown",
      data: new buckets.PriorityQueue(activityCompare)
    },{
      name: "Eric Gonzalez",
      data: new buckets.PriorityQueue(activityCompare)
    },{
      name: "Jorge Herrera",
      data: new buckets.PriorityQueue(activityCompare)
    }];
    $.each(activities, function(key, data) {
      var actor = data.actor;
      var index = nameToIndex(actor);
      if (index < 0) // not a member
        return;
        
      var actorActivity = actorArr[index];
      
      var source = data.source;
      var sourceSeries = actorActivity.data;
      
      //var yValue = nameToNumber(actor);
      
      var entry = {
        x: data.timestamp * 1000,
        y: index,
        name: source
      };
      
      sourceSeries.add(entry);
    });
    
    actorArr.forEach(function(object) {
      object.data = object.data.toArray();
    }, this);
    
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
        },
        categories: ["Aqib Bhat", "Cullen Brown", "Eric Gonzalez", "Jorge Herrera"]
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          turboThreshold: 3000
        }
      },
      series: actorArr
    });
  };
    
  activityManager.getActivity({filter:vwFilter,results:activityCallback}); 
};

var configuration = { name:"Activity", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis1-body");