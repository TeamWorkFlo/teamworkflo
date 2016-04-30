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



function updateVisualizations(milestone, minDate, maxDate){
	var filterContext = new FilterContext();
	filterContext['milestone'] = milestone;
	filterContext['minDate'] = minDate;
	filterContext['maxDate'] = maxDate;
	alert(filterContext['milestone'] + " &&"+ filterContext['minDate']+ "&& "+filterContext['maxDate']);


}