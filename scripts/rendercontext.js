/*
 *	Filter context object for use in filters
 */

var RenderContext = function(object) {
	this.renderElement = "";
	this.width = "";
	this.height = "";
	this.condensed = "";


	if (object.hasOwnProperty('renderElement'))
		this.renderElement = object.renderElement;
	if (object.hasOwnProperty('width'))
		this.width = object.width;
	if (object.hasOwnProperty('height'))
		this.height = object.height;
	if (object.hasOwnProperty('condensed'))
		this.condensed = object.condensed;

}