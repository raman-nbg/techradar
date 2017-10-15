export default class DummyRadarDataProvider {
    constructor() {
        this.data = [
            {
                "id" : 1,
                "radius" : 1,
                "angle" : 45,
                "label" : "HBase",
                "link" : "http://google.de"
            },
            {
                "id" : 2,
                "radius" : 0.6,
                "angle" : 120,
                "label" : "Apache Kafka",
                "link" : ""
            }
        ];
    }

    load() {
        return new Promise(function(resolve, reject) {
            window.setTimeout(function() {
                resolve(this.data);
            }.bind(this), 100);
        }.bind(this));
    }

    updateItem(item) {
        return new Promise(function(resolve, reject) {
            resolve(item);
        })
    }

    addItem(radius, angle) {
        return new Promise(function(resolve, reject) {
            var label = prompt("Please enter the label of the new blip:", "");
            if (label === null || label === "") {
                reject();
            } else {
                this.data.push({"id" : this.data.length + 1, "radius" : radius, "angle" : angle, "label" : label});
                resolve(this.data[this.data.length - 1]);
            }
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