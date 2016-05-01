
/* The visualization type manages a specific view. In
this view it renders one of several visualizations. The
visualizations change depending on interactions set from
else where, so this class responds to those changes. */
// Visualization

function Visualization(configuration) {
  this.name = configuration.name;
  this.render = configuration.renderer;
}

function switchActiveVisualization(activeVis, activeRender, activeFilter, switchingVis, switchingRender, switchingFilter){
	tempVis = activeVis;
	tempRender = activeRender;
	tempFilter = activeFilter;

	activeVis = switchingVis;
	activeRender = switchingRender;
	activeFilter = switchingFilter;

	switchingVis = tempVis;
	switchingRender = tempRender;
	switchingFilter = tempFilter;

}

function switchVisualizations(activeVis, activeRender, activeFilter, switchingVis, switchingRender, switchingFilter){
	var tempElem1 = activeRender.renderElement;
	var tempElem2 = activeRender.labelElement;

	activeRender.renderElement = switchingRender.renderElement;
	activeRender.labelElement = switchingRender.labelElement;
	switchingRender.renderElement = tempElem1;
	switchingRender.labelElement = tempElem2;

	activeVis.render(activeRender,activeFilter);
	switchingVis.render(switchingRender, switchingFilter);

	switchActiveVisualization(activeVis, activeRender, activeFilter, switchingVis, switchingRender, switchingFilter);
}