/*
 *	Filter context object for use in filters
 */

function FilterContext(object){
	//this.name = object.name;
	if (object.hasOwnProperty('actor'))
		this.actor = object.actor;
	if (object.hasOwnProperty('component'))
		this.component = object.component;

}