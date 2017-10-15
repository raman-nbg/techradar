'use strict';

import * as d3 from 'd3';
import Radar from 'technology-radar';
import DummyRadarDataProvider from './DummyRadarDataProvider';

var radarOptions = {
	canvasWidth : 1300,
	enableMove : true,
	enableAddNew : true
}

var radarDataProvider = new DummyRadarDataProvider();
var radar = new Radar("#techradarContainer", radarDataProvider, radarOptions);
radar.render();

document.getElementById("editButton").addEventListener("click", function() {
	radar.setEditMode(!radar.getEditMode());
});