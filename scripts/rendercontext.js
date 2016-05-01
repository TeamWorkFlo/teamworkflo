/*
 *	Render context object for use in rendering
 */

var RenderContext = function(object) {
	this.renderElement = "";
	this.labelElement = "";
	this.width = "";
	this.height = "";
	this.condensed = "";


	if (object.hasOwnProperty('renderElement'))
		this.renderElement = object.renderElement;
	if (object.hasOwnProperty('labelElement'))
		this.labelElement = object.labelElement;
	if (object.hasOwnProperty('width'))
		this.width = object.width;
	if (object.hasOwnProperty('height'))
		this.height = object.height;
	if (object.hasOwnProperty('condensed'))
		this.condensed = object.condensed;

}

