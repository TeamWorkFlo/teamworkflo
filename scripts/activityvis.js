

var activityCompare = function(a,b) {
  var aTime = a.x;
  var bTime = b.x;
  return aTime - bTime;
}

var nameToIndex = function(name) {
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
}

var render = function(element) {
  var vwFilter = function(activity) { 
    return activity.hasOwnProperty('actor') && activity.actor !== null;
  }
  var activityCallback = function (activities) {
   
    var actorArr = [{
      name: "Aqib Bhat",
      Slack: {bins:{}},
      github: {bins:{}},
      drive: {bins:{}}
    },{
      name: "Cullen Brown",
      Slack: {bins:{}},
      github: {bins:{}},
      drive: {bins:{}}
    },{
      name: "Eric Gonzalez",
      Slack: {bins:{}},
      github: {bins:{}},
      drive: {bins:{}}
    },{
      name: "Jorge Herrera",
      Slack: {bins:{}},
      github: {bins:{}},
      drive: {bins:{}}
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
      var sourceBins = actorActivity[source].bins;
      
      // Increment the number of instances on that day
      var date = new Date(data.timestamp * 1000);
      var day = date.setHours(0,0,0,0);
      var dayBin = sourceBins[day];
      if (!dayBin) {
        dayBin = {x:day,y:0,tasks:new buckets.Set()};
        sourceBins[day] = dayBin;
      }
      dayBin.y++;
      if (data.hasOwnProperty('task'))
        dayBin.tasks.push(task);
    });
    
    actorArr.forEach(function(actorObject) {
      // Translate each bin to an entry
      
      var name = actorObject.name;
      var data = [];
      var bins = actorObject.Slack.bins;
      for (var binKey in bins) {
        var bin = bins[binKey];
        data.push(bin);
      }
      data.sort(activityCompare);
      
      var divId = 'act-' + name.split(" ")[0];
      $(element).append('<div id=\'' + divId + '\' class=\'fill\'></div>');
      $('#'+divId).highcharts({
        chart: {
          type: 'area'
        },
        title: {
          text: name
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Count'
          }
        },
        legend: {
          enabled: false
        },
        series: [{data: data}]
      });
    }, this);
  };
    
  activityManager.getActivity({filter:vwFilter,results:activityCallback}); 
};

var configuration = { name:"Activity", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis2-body");