

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
      slack: [],
      github: [],
      drive: []
    },{
      name: "Cullen Brown",
      slack: [],
      github: [],
      drive: []
    },{
      name: "Eric Gonzalez",
      slack: [],
      github: [],
      drive: []
    },{
      name: "Jorge Herrera",
      slack: [],
      github: [],
      drive: []
    }];
    
    //Bucketize the data
    $.each(activities, function(key, data) {
      var actor = data.actor;
      var index = nameToIndex(actor);
      if (index < 0) // not a member
        return;
      
      // Get the actor's activity series  
      var actorActivity = actorArr[index];
      
      // Get the series for the activity occurring
      var source = data.source;
      var sourceBins = actorActivity[source];
      
      // Increment the number of instances on that day
      var date = new Date(data.timestamp * 1000);
      var day = date.setHours(0,0,0,0);
      var dayBin = sourceBins[day];
      if (!dayBin) {
        dayBin = {x:date,count:0,tasks:new buckets.Set()};
        sourceBins[day] = dayBin;
      }
      dayBin.count++;
      if (data.hasOwnProperty(task))
        dayBin.tasks.push(task);
    });
    
    actorArr.forEach(function(object) {
      // Translate each bin to an entry
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