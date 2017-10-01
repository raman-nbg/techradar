'use strict';

import * as d3 from 'd3';
import {event as currentEvent} from 'd3';
import ArgumentError from './ArgumentError';
import BlipRenderingEngine from './BlipRenderingEngine';
import MathHelper from './MathHelper';

export default class RadarRenderingEngine {
    constructor(targetId, data, metaData, options) {
        if (targetId === undefined || targetId === null) {
            throw new ArgumentError();
        }
        if (data === undefined || data === null) {
            throw new ArgumentError();
        }
        if (metaData === undefined || metaData === null) {
            throw new ArgumentError();
        }
        if (options === undefined || options === null) {
            throw new ArgumentError();
        }

        this.targetId = targetId;
        this.data = data;
        this.metaData = metaData;
        this.options = options;

        this.onBlipMoved = function() { };
        this.onAddBlip = function() { };

        this.blipRenderingEngine = new BlipRenderingEngine(options, metaData);
    }
    
    setOnBlipMoved(callback) {
        this.onBlipMoved = callback;
    }
        
    setOnAddBlip(callback) {
        this.onAddBlip = callback;
    }

    start() {
        this.init();
        this.removePreviousRadar();

        this.svg = d3.select(this.targetId).append("svg")
        .attr("width", this.options.canvasWidth + this.options.margin.left + this.options.margin.right)
        .attr("height", this.options.canvasHeight + this.options.margin.top + this.options.margin.bottom)
        .attr("class", this.targetId + "Inner");

        this.svgGroup = this.svg.append("g").attr(
            "transform", 
            "translate(" + (this.options.canvasWidth / 2 + this.options.margin.left) + "," + (this.options.canvasHeight / 2 + this.options.margin.top) + ")");

        this.drawBackground();
        this.drawAxis();
        this.drawQuadrantNames();
        this.drawStateNames();
        this.blipRenderingEngine.render(this.svgGroup, this.data);
    }

    init() {
        this.options.maxRadius = this.getRadarRadius();
        this.circleRadius = Math.min(this.options.canvasWidth / 2, this.options.canvasHeight / 2)
        this.radiusScale = d3.scale.linear()
            .domain([0, this.options.maxRadius])
            .range([0, this.circleRadius]);
        this.inverseRadiusScale = d3.scale.linear()
            .domain([0, this.circleRadius])
            .range([0, this.options.maxRadius]);
        this.angleSlice = Math.PI * 2 / 4;

        this.calculateCartesianCoordinates()
    }

    calculateCartesianCoordinates() {
        var radiusScale = this.radiusScale;

        this.data.forEach(function (item) {
            var cartesianCoordinates = MathHelper.polarToCartesian(radiusScale(item.radius), item.angle);
            item.x = cartesianCoordinates.x;
            item.y = cartesianCoordinates.y;
        });
    }

    getRadarRadius() {
        return Math.max(
            this.options.maxRadius, 
            d3.max(
                this.data,
                function (d) { 
                    return d.radius;
                }
            )
        );
    }

    removePreviousRadar() {
        //Remove whatever chart with the same id/class was present before
	    d3.select(this.targetId).select("svg").remove();
    }

    drawBackground() {
        var metaData = this.metaData;
        var circleRadius = this.circleRadius;
        var options = this.options;
        this.axisGroup = this.svgGroup.append("g")
            .attr("class", "axisWrapper");

        //draw the circles for the different states
        this.axisGroup.selectAll(".level")
            .data(d3.range(1, metaData.states.length + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function (d) { return circleRadius / metaData.states.length * d; })
            .style("stroke", options.radarColorStrokes)
            .style("fill", function(d) { return metaData.states[d - 1].backgroundColor; });
    }

    drawAxis() {
        var radiusScale = this.radiusScale;
        var maxValue = this.options.maxRadius;
        var angleSlice = this.angleSlice;
        var options = this.options;

        //Create the straight lines radiating outward from the center
        var axis = this.axisGroup.selectAll(".axis")
            .data([0, 1, 2, 3])
            .enter()
            .append("g")
                .attr("class", "axis");

        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return radiusScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return radiusScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", options.radarColorStrokes)
            .style("stroke-width", "2px");
    }

    drawQuadrantNames() {
        var circleRadius = this.circleRadius;
        var metaData = this.metaData;

        var quadrantNamesWrapper = this.svgGroup.append("g")
            .attr("class", "quadrantNamesWrapper");
    
        var quadrantName = quadrantNamesWrapper.selectAll(".quadrantName")
            .data([0, 1, 2, 3])
            .enter()
            .append("text")
            .attr("class", "quadrantNameText")
            .attr("x", function(d) {
                var angle = d * 90;
                var x = MathHelper.polarToCartesian(circleRadius, angle + 45).x;
                
                if (angle >= 90 && angle < 270) {
                    x -= 30;
                } else {
                    x += 30;
                }

                return x;
            }) 
            .attr("y", function(d) {
                return MathHelper.polarToCartesian(circleRadius, d * 90 + 45).y;
            })
            .attr("text-anchor", function(d) {
                var angle = d * 90;
                if (angle >= 90 && angle < 270) {
                    return "end";
                } else {
                    return "start";
                }
             })
            .text(function(d) { 
                return metaData.quadrants[d].name; 
            })
            .style("font-size", "18px")
            .style("fill", function(d) {
                return metaData.quadrants[d].color.blip;
            });
    }

    drawStateNames() {
        var metaData = this.metaData;
        var circleRadius = this.circleRadius;
        var options = this.options;

        this.svgGroup.append("g")
            .attr("class", "stateNames")
            .selectAll(".stateName")
            .data(d3.range(0, metaData.states.length).reverse())
            .enter()
            .append("text")
            .attr("class", "stateName")
            .attr("x", 0)
            .attr("y", function (d) { return (circleRadius / metaData.states.length * (d + 1) * -1) + 40; })
            .attr("text-anchor", "middle")
            .style("fill", options.radarStateLabelColor)
            .style("font-size", "15px")
            .text(function(d) { return metaData.states[d].name; });
    }

    enableBlipDragBehavior() {
        var inverseRadiusScale = this.inverseRadiusScale;
        var circleRadius = this.circleRadius;
        var onBlipMoved = this.onBlipMoved;

        var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function(d) {
                currentEvent.sourceEvent.stopPropagation();
        
                if (d.dx === undefined) {
                    d.dx = 0;
                }
                if (d.dy === undefined) {
                    d.dy = 0;
                }
            })
            .on("drag", function(d) {
                d.dx += currentEvent.dx;
                d.dy += currentEvent.dy;

                var polarCoordinates = MathHelper.cartesianToPolar(d.x + d.dx, d.y + d.dy);
                if (polarCoordinates.radius > circleRadius) {
                    polarCoordinates.radius = circleRadius;
                }
                var adjustedCartesianCoordinates = MathHelper.polarToCartesian(polarCoordinates.radius, polarCoordinates.angle);
                d.dx = adjustedCartesianCoordinates.x - d.x;
                d.dy = adjustedCartesianCoordinates.y - d.y;
        
                d3.select(this).attr({
                    transform: "translate(" + d.dx + "," + d.dy + ")"
                });
            })
            .on("dragend", function(d) {
                var polarCoordinates = MathHelper.cartesianToPolar(d.x + d.dx, d.y + d.dy);
                d.radius = inverseRadiusScale(polarCoordinates.radius);
                d.angle = polarCoordinates.angle;

                d.dx = 0;
                d.dy = 0;

                onBlipMoved(d);
            });

        return drag;
    }
    
    disableBlipDragBehavior() {
        var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", null)
            .on("drag", null)
            .on("dragend", null);

        return drag;
    }

    setEditMode(enabled) {
        this.editEnabled = enabled;

        var inverseRadiusScale = this.inverseRadiusScale;
        var onAddBlip = this.onAddBlip;

        var gridCircle = d3.selectAll(".gridCircle");
        var blip = d3.selectAll(".blip");

        if (enabled) {
            gridCircle.on("click", function() {
                var cartesianCoordinates = d3.mouse(this);
                var polarCoordinates = MathHelper.cartesianToPolar(cartesianCoordinates[0], cartesianCoordinates[1]);
                var radius = inverseRadiusScale(polarCoordinates.radius);
                var angle = polarCoordinates.angle;
                onAddBlip(radius, angle);
            });

            blip.call(this.enableBlipDragBehavior());
        } else {
            gridCircle.on("click", null);
            blip.call(this.disableBlipDragBehavior());
        }

        this.blipRenderingEngine.setEditMode(enabled);
    }

    getEditMode() {
        if (this.editEnabled === undefined) {
            return false;
        }

        return this.editEnabled;
    }
}