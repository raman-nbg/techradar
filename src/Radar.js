import ArgumentError from './ArgumentError';
import RadarRenderingEngine from './RadarRenderingEngine';
import Options from './Options';

export default class Radar {
    constructor(targetId, radarDataProvider, options) {
        if (targetId === undefined || targetId === null) {
            throw new ArgumentError();
        }
        if (radarDataProvider === undefined || radarDataProvider === null) {
            throw new ArgumentError();
        }

        this.targetId = targetId;
        this.dataProvider = radarDataProvider;

        options = Options.mergeOptionsWithDefault(options);
        this.options = options;
    }

    render() {
        var targetId = this.targetId;
        var options = this.options;
        var dataProvider = this.dataProvider;

        dataProvider.load()
            .then(function(data) {
                var radarRenderingEngine = new RadarRenderingEngine(targetId, data, dataProvider.getMetaData(), options);
                this.radarRenderingEngine = radarRenderingEngine;

                if (options.enableMove) {
                    this.radarRenderingEngine.setOnBlipMoved(function(item) {
                        dataProvider.updateItem.bind(dataProvider)(item)
                            .then(function(editedItem) {
                                radarRenderingEngine.updateBlip(editedItem);
                                radarRenderingEngine.start();
                                radarRenderingEngine.setEditMode(true);
                            })
                            .catch(function() {
                                console.log("Updating item rejected");
                            });
                    });
                }
                if (options.enableAddNew) {
                    this.radarRenderingEngine.setOnAddBlip(function(radius, angle) {
                        dataProvider.addItem.bind(dataProvider)(radius, angle)
                            .then(function(newItem) {
                                radarRenderingEngine.onAddBlip(newItem);
                                radarRenderingEngine.start();
                                radarRenderingEngine.setEditMode(true);
                            })
                            .catch(function() {
                                console.log("Adding new item rejected");
                            });
                    });
                }

                this.radarRenderingEngine.start();
            }.bind(this))
            .catch(function() {
                console.log("Loading data rejected");
            });
    }

    setEditMode(enabled) {
        if (this.radarRenderingEngine !== undefined && this.radarRenderingEngine !== null) {
            this.radarRenderingEngine.setEditMode(enabled);
        }
    }

    getEditMode() {
        return this.radarRenderingEngine.getEditMode();
    }
}