
var render = function(element) {
  var vwFilter = function(activity) { return true; }
  var activityCallback = function (activities) {
    
    var seriesArr = [];
    $.each(activities, function(key, data) {
      var actor = data.actor;
      var source = data.source;
      
      var index = actor + "." + source;
      var series = seriesArr[index];
      if (!series) {
        series = [];
        seriesArr[index] = series;
      }
      
      series.push([Date(data.timestamp), actor]);
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
      series: seriesArr
    });
  };
    
  activityManager.getActivity({filter:vwFilter,results:activityCallback}); 
};

var configuration = { name:"Activity", renderer:render };

var vis = new Visualization(configuration);

vis.render("#vis2-body");