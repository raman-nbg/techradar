import ArgumentError from './ArgumentError';
import RadarRenderingEngine from './RadarRenderingEngine';

export default class Options {
    static getDefaultOptions() {
        return {
            canvasWidth: 600,				            //Width of the canvas
            canvasHeight: 600,				            //Height of the canvas
            margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the canvas
            maxRadius: 1, 			                    //What is the max value of the radius
            dotRadius: 5, 			                    //The size of the colored circles of each blip
            radarColorStrokes : "#AAAAAA",              //The color of the strokes between the states
            radarStateLabelColor : "#222222",           //The color of the state labels
            enableAddNew : false,                       //Enable adding new blips
            enableMove : false,                         //Enable moving existing blips
            blipHoverOpacity : 0.35,                    //The opacity of all blips on hovering a blip
	    };
    }

    static mergeOptionsWithDefault(userDefinedOptions) {
        var options = Options.getDefaultOptions();

        //Put all of the options into the configuration
	    if ('undefined' !== typeof userDefinedOptions) {
            for (var propertyName in userDefinedOptions) {
                if ('undefined' !== typeof userDefinedOptions[propertyName]) {
                    options[propertyName] = userDefinedOptions[propertyName];
                }
            }
        }

        return options;
    }

    static getBlipColor() {

    }
}