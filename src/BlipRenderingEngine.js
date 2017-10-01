'use strict';

import * as d3 from 'd3';
import {event as currentEvent} from 'd3';
import BlipMetaDataMapper from './BlipMetaDataMapper';

export default class BlipRenderingEngine {
    constructor(options, metaData) {
        this.options = options;
        this.blipMetaDataMapper = new BlipMetaDataMapper(metaData);
    }

    render(svgGroup, data) {
        var blipWrapper = this.renderBlipWrapper(svgGroup, data);
        this.renderBlipSymbol(blipWrapper);
        this.renderBlipLabel(blipWrapper);

        this.setEditMode(false);
    }

    renderBlipWrapper(svgGroup, data) {
        var blipWrapper = svgGroup.selectAll(".blip")
        .data(data)
        .enter().append("g")
        .attr("class", "blip");

        return blipWrapper;
    }

    renderBlipSymbol(blipWrapper) {
        var blipMetaDataMapper = this.blipMetaDataMapper;

        //Append the circles
        blipWrapper
            .append("circle")
            .attr("class", "blipCircle")
            .attr("r", this.options.dotRadius)
            .attr("cx", function(d) {
                return d.x;
            }) 
            .attr("cy", function(d) {
                return d.y;
            })
            .style("fill", function(d) {
                var quadrant = blipMetaDataMapper.mapQuadrant(d);
                return quadrant.color.blip;
            });
    }

    renderBlipLabel(blipWrapper) {
        var blipMetaDataMapper = this.blipMetaDataMapper;

        //Append the labels
        blipWrapper
            .append("text")
            .attr("class", "blipText")
            .attr("x", function(d) {
                return d.x + 12;
            })
            .attr("y", function(d) {
                return d.y + 5;
            })
            .style("fill", function(d) {
                var quadrant = blipMetaDataMapper.mapQuadrant(d);
                return quadrant.color.text;
            })
            .style("font-size", "12px")
            .text(function(d) { return d.label; });
    }

    setEditMode(enabled) {
        var options = this.options;
        var blip = d3.selectAll(".blip");

        if (!enabled) {
            blip.on("click", function(d) {
                if (currentEvent.defaultPrevented) {
                    return;
                }
                
                console.log(d);
                if (d.link !== undefined && d.link !== null && d.link !== "") {
                    window.open(d.link);
                }
            });
        } else {
            blip.on("click", null);
        }

        
        blip.on("mouseover", function(currentBlip) {
            if (enabled || (currentBlip.link !== undefined && currentBlip.link !== null && currentBlip.link !== "")) {
                d3.select(this).style("cursor", "pointer");
            }
            
            d3.selectAll(".blip")
                .transition().duration(400)
                .style("opacity", function(otherBlip) {
                    if (currentBlip.id === otherBlip.id) {
                        return 1.0;
                    } else {
                        return options.blipHoverOpacity;
                    }
                })
        })
        .on("mouseout", function(currentBlip) {
            d3.select(this).style("cursor", "default");
            d3.selectAll(".blip")
                .transition().duration(400)
                .style("opacity", 1)
        });
    }
}