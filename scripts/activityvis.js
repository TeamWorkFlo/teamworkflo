

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

var activityRender = function(renderContext, filterContext) {
  var vwFilter = function(activity) { 
    if (!(activity.hasOwnProperty('actor') && activity.actor !== null))
      return false;
    
    if (filterContext.actor != "" && filterContext.actor != 'All' && !filterContext.actor.match(activity.actor))
      return false;
    
    var passesTime = true;
    if (filterContext.hasOwnProperty('startTime') && activity.timestamp < filterContext.startTime)
      passesTime = false;
    passesTime = passesTime || (filterContext.hasOwnProperty('endTime') && activity.timestamp < filterContext.endTime);
  
    return passesTime;
  }
  var activityCallback = function (activities) {
   
    var actorArr = [{
      name: "Aqib Bhat",
      color: "#22BE22",
      Slack: {bins:{}},
      github: {bins:{}},
      googledrive: {bins:{}}
    },{
      name: "Cullen Brown",
      color: "#ED2A2A",
      Slack: {bins:{}},
      github: {bins:{}},
      googledrive: {bins:{}}
    },{
      name: "Eric Gonzalez",
      color: "#EDBC2A",
      Slack: {bins:{}},
      github: {bins:{}},
      googledrive: {bins:{}}
    },{
      name: "Jorge Herrera",
      color: "#3232A6",
      Slack: {bins:{}},
      github: {bins:{}},
      googledrive: {bins:{}}
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
        dayBin = {x:day,y:0,tasks:new buckets.Set(function(activity) {
          return activity.taskid
        })};
        sourceBins[day] = dayBin;
      }
      dayBin.y++;
      if (data.hasOwnProperty('taskid'))
        dayBin.tasks.add(data.taskid);
    });
    
    var sources = [{source: "Slack", name:"Slack",yAxis:"Messages"},
     {source: "googledrive", name: "Google Drive", yAxis:"Edits"},
     {source: "github", name: "GitHub", yAxis: "Commits"}];
     
     $(renderContext.renderElement).html('');
     var condensed = renderContext.condensed;
     var height = condensed ? 115 : 175;
     
    sources.forEach(function(source) {
      var sourceId = source.source;
      var series = getSourceSeries(actorArr, sourceId);
      var divId = 'act-' + sourceId;
      $(renderContext.renderElement).append('<div id=\'' + divId + '\'></div>');
      
      var chartOptions = {
        chart: {
          height: height
        },
        title: {
          text: source.name,
          style: {
            'fontSize': condensed ? 10 : 16
          }
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: source.yAxis,
            style: {
              fontSize: condensed ? 10 : 12
            }
          }
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          }
        },
        legend: {
          enabled: false
        },
        series: series
      };
      
      if (filterContext.hasOwnProperty('startTime') && filterContext.startTime !== null && filterContext.startTime != "")
        chartOptions.xAxis.min = new Date(filterContext.startTime*1000).getTime(); //This would need to change depending on the time window the user select
      if (filterContext.hasOwnProperty('endTime') && filterContext.endTime !== null && filterContext.endTime != "")
        chartOptions.xAxis.max = new Date(filterContext.endTime*1000).getTime(); //This would need to change depending on the time window the user select

      
      $('#'+divId).highcharts(chartOptions);
    }, this);
  };
    
  activityManager.getActivity({filter:vwFilter,results:activityCallback}); 
};

function translateData(bins) {
  var data = [];    
  
  for (var binKey in bins) {
    var bin = bins[binKey];
    if (bin.hasOwnProperty('tasks'))
      bin.tasks = bin.tasks.toArray();
    data.push(bin);
  }
  data.sort(activityCompare);
  return data;
}

function getSourceSeries(actorArr, source) {
  
  var series = [];
  
  // Translate each bin to an entry
  actorArr.forEach(function(actor) {
    var name = actor.name;
    var sData = translateData(actor[source].bins);
    var color = actor.color;
    
    series.push({name: name, data: sData, color: color});
  }, this);
  
  return series;
}
