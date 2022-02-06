// https://github.com/fuzhenn/maptalks-ide/issues/1255

class LayerJSON {
    constructor(json) {
        this._json = json || {};
    }

    getJSON() {
        return copyJSON(this._json);
    }

    getId() {
        return this._json.id;
    }

    getStyle() {
        if (!this._json.options) {
            return null;
        }
        return copyJSON(this._json.options.style);
    }

    getData() {
         if (!this._json.options) {
            return null;
        }
        return copyJSON(this._json.options.data);
    }

    getGeometryById(id) {
        const geometries = this._json.geometries;
        if (!geometries) {
            return null;
        } 
        for (let i = 0; i < geometries.length; i++) {
            if (geometries[i] && geometries[i].options && geometries[i].options.id === id) {
                return copyJSON(geometries[i]);
            }
        }
        return null;
    }

    getGeometries() {
        if (!this._json.geometries) {
            return [];
        } 
        return copyJSON(this._json.geometries);
    }
}

export default class MSDJSONLoader {

    constructor(options) {
        this._options = options || {};
    }

    load() {
        const data = this._options.data;
        let resRootPath = this._options.basePath;
        if (isString(data)) {
            // a remote one
            const fetchFunction = this._options.fetchFunction || fetch;
            const fetchOptions = this._options.fetchOptions;
            if (!resRootPath) {
                const lastSlashIndex = data.lastIndexOf('/');
                if (lastSlashIndex < 0) {
                    resRootPath = './';
                } else {
                    resRootPath = data.substring(0, lastSlashIndex);
                }
            }
            return fetchFunction(data, fetchOptions)
                .then(response => response.json())
                .then(json => {
                    this._parse(json, resRootPath);
                    return this;
                });
        } else {
            this._parse(data, resRootPath || './');
            return Promise.resolve(this);
        }
    }

    getMSDJSON() {
        return copyJSON(this._msdJSON);
    }

    getMapJSON() {
        return copyJSON(this._json);
    }

    getView() {
        if (!this._json) {
            return null;
        }
        const { center, zoom, pitch, bearing } = this._json;
        return {
            center,
            zoom,
            pitch,
            bearing
        };
    }

    getLights() {
        return this._json && this._json.options['lights'];
    }

    getSceneConfig() {
        return this._json && this._json.layers[0].options.sceneConfig;
    }

    _parse(json, resRootPath) {
        if (resRootPath !== './' && resRootPath !== '.') {
            const lastChar = resRootPath[resRootPath.length - 1];
            if (lastChar !== '/') {
                resRootPath += '/';
            }
            this._msdJSON = json;
            let jsonStr = JSON.stringify(json);
            // replace all "./res with basePath
            jsonStr = jsonStr.replace(/".\/res/g, '"' + resRootPath + 'res');    
            json = JSON.parse(jsonStr);
        } else {
            this._msdJSON = copyJSON(json);
        }
        this._json = json || {};
        this._layers = convertLayer(json.layers[0]);
    }

    getLayer(id) {
        const layers = this._layers;
        if (!layers) {
            return null;
        }
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer && id === layer.getId()) {
                return layer;
            }
        }
        return null;
    }

    getLayers() {
        return this._layers || [];
    }
}

function isString(obj) {
    return typeof obj === 'string' || (obj.constructor !== null && obj.constructor === String);
}

function copyJSON(json) {
    if (!json) {
        return null;
    }
    return JSON.parse(JSON.stringify(json));
}

function convertLayer(json) {
    if (!json.layers) {
        return [];
    }
    return json.layers.map(layer => {
        if (!layer) {
            return null;
        }
        return new LayerJSON(layer);
    });
}