
/* The visualization type manages a specific view. In
this view it renders one of several visualizations. The
visualizations change depending on interactions set from
else where, so this class responds to those changes. */
// Visualization

function Visualization(configuration) {
  this.name = configuration.name;
  this.render = configuration.renderer;
}

function switchActiveVisualization(activeVis, activeRender, activeFilter, targetVis, targetRender, targetFilter){
	activeVis = targetVis;
	activeRender = targetRender;
	activeFilter = targetFilter;
}