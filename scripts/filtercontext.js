/*
 *	Filter context object for use in filters
 */

var FilterContext = function(object) {
	this.actor = "";
	this.component = "";
	this.feature = "";
	this.milestone = "";
	this.startTime = "";
	this.endTime = "";

	if (object.hasOwnProperty('actor'))
		this.actor = object.actor;
	if (object.hasOwnProperty('component'))
	 	this.component = object.component;
    if (object.hasOwnProperty('feature'))
	 	this.feature = object.feature;
	if (object.hasOwnProperty('milestone'))
	 	this.milestone = object.milestone;
	if (object.hasOwnProperty('startTime'))
	 	this.startTime = object.startTime;
	if (object.hasOwnProperty('endTime'))
		this.endTime = object.endTime;

}

function filterVis(vis, renderContext, filterContext){
  var dates = $("#slider").dateRangeSlider("values");
  var milestone = $( "#milestones_selector option:selected" ).text();
  var actor = $( "#actor_selector option:selected" ).text();
  var viz = $( "#visualizations_selector option:selected" ).text();
  alert(viz);
  var minDate = getUnixTimestamp(dates.min)/1000;
  var maxDate = getUnixTimestamp(dates.max)/1000;

  filterContext.milestone = milestone;
  filterContext.startTime = minDate;
  filterContext.endTime = maxDate;
  filterContext.actor = actor;
  vis.render(renderContext,filterContext);
}
