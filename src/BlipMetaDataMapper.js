'use strict';

import ArgumentError from './ArgumentError';

export default class BlipMetaDataMapper {
    constructor(metaData) {
        if (metaData === undefined || metaData === null) {
            throw new ArgumentError();
        }

        this.metaData = metaData;
    }

    mapQuadrant(blip) {
        var quadrantIndex = Math.floor(blip.angle / 90);
        return this.metaData.quadrants[quadrantIndex];
    }
}