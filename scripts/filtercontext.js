/*
 *	Filter context object for use in filters
 */

var FilterContext = function(object) {
	//this.name = object.name;
	if (object.hasOwnProperty('actor'))
		this.actor = object.actor;
	if (object.hasOwnProperty('component'))
		this.component = object.component;

}