'use strict';

export default class BaseRadarDataProvider {
    load() {
        return new Promise(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    updateItem(item) {
        return new Promise(function(resolve, reject) {
            reject();
        })
    }

    addItem(radius, angle) {
        return new Promise(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    getMetaData() {
        return {
            "quadrants" : [
                {
                    "id" : 0,
                    "name" : "Tools",
                    "color" : {
                        "blip" : "#86B782",
                        "text" : "#000000"
                    }
                },
                {
                    "id" : 1,
                    "name" : "Techniques",
                    "color" : {
                        "blip" : "#1EBCCD",
                        "text" : "#000000"
                    }
                },
                {
                    "id" : 2,
                    "name" : "Platforms",
                    "color" : {
                        "blip" : "#F38A3E",
                        "text" : "#000000"
                    }
                },
                {
                    "id" : 3,
                    "name" : "Languages & Frameworks",
                    "color" : {
                        "blip" : "#B32059",
                        "text" : "#000000"
                    }
                },
            ],
            "states" : [
                {
                    "id" : 0,
                    "name" : "ADOPT",
                    "backgroundColor" : "#BFC0BF"
                },
                {
                    "id" : 1,
                    "name" : "TRIAL",
                    "backgroundColor" : "#CBCCCB"
                },
                {
                    "id" : 2,
                    "name" : "ASSESS",
                    "backgroundColor" : "#D7D8D6"
                },
                {
                    "id" : 3,
                    "name" : "HOLD",
                    "backgroundColor" : "#E4E5E4"
                },
            ]
        }
    }
}