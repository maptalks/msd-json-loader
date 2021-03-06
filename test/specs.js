const { MSDJSONLoader } = require('../dist/MSDJSONLoader.js');
const fetch = require('node-fetch');
const startServer = require('./server.js');
const assert = require('assert');

const PORT = 4399;

const mapJsonFile = 'msd_json/map.json';

describe('sepcs', () => {
    let server;
    before(done => {
        server = startServer(PORT, done);
    });

    after(() => {
        server.close();
    });

    it('can get map json', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const json = loader.getMapJSON();
            const expected = {"jsonVersion":"1.0","version":"1.0.0-beta.10","extent":{"xmin":112.81991128710933,"ymin":29.37271426782948,"xmax":115.96474771289058,"ymax":31.940619063164462},"options":{"spatialReference":{},"lights":{"directional":{"direction":[1,0,-1],"color":[1,1,1]},"ambient":{"resource":null,"exposure":1,"hsv":[0,0,0],"orientation":0}},"seamlessZoom":true,"renderable":true,"doubleClickZoom":true,"zoomable":true,"draggable":true,"center":{"x":114.39232949999996,"y":30.66519600000001},"zoom":9,"bearing":0,"pitch":0},"layers":[{"type":"GroupGLLayer","id":"group","layers":[{"type":"VectorTileLayer","id":"vt0","options":{"urlTemplate":"http://116.63.251.32:8080/tile/planet-single/{z}/{x}/{y}.mvt","spatialReference":"preset-vt-3857","style":{"style":[{"filter":["all",["==","$layer","building"],["==","$type","Polygon"]],"renderPlugin":{"type":"lit","dataConfig":{"type":"3d-extrusion","uv":true,"tangent":true,"altitudeProperty":"null","minHeightProperty":"null","altitudeScale":1,"defaultAltitude":10,"topThickness":0,"top":true,"side":true},"sceneConfig":{"animation":null,"animationDuration":800}},"symbol":{"bloom":false,"ssr":false,"polygonOpacity":1,"material":{"baseColorTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Base_Color.png","baseColorFactor":[1,1,1,1],"hsv":[0,0,0],"baseColorIntensity":1,"contrast":1,"outputSRGB":1,"metallicRoughnessTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Roughness.png","roughnessFactor":1,"metallicFactor":1,"normalTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Normal.png","noiseTexture":null,"uvScale":[1,1],"uvOffset":[0,0],"uvRotation":0,"uvOffsetAnim":[0,0],"normalMapFactor":1,"normalMapFlipY":0,"bumpTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Height.png","bumpScale":0.02,"clearCoatThickness":5,"clearCoatFactor":0,"clearCoatIor":1.4,"clearCoatRoughnessFactor":0.04,"occlusionTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Ambient_Occlusion.png","emissiveTexture":null,"emissiveFactor":[0,0,0],"emitColorFactor":1,"emitMultiplicative":0},"visible":true}}],"featureStyle":[]}}},{"type":"GLTFLayer","id":"gltf0","options":{},"geometries":[{"coordinates":{"x":-74.01086979939879,"y":40.711035446586976},"options":{"zIndex":0,"id":"data0","symbol":{"visible":true,"bloom":false,"ssr":false,"shadow":true,"url":"http://localhost:4399/msd_json/res/resources/gltf-model/4d1/4d199d97-918e-4b57-950b-2c0998017db0/e2e_test.glb","animation":true,"animationName":null,"loop":true,"speed":1,"translation":[0,0,0],"scale":[1,1,1],"rotation":[0,0,0],"fixSizeOnZoom":-1,"shader":"pbr","uniforms":{"polygonFill":[1,1,1,1],"polygonOpacity":1,"baseColorIntensity":1,"outputSRGB":1}}},"zoomOnAdded":16}]},{"type":"PointLayer","id":"point0","options":{"collision":false},"geometries":[{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.15200357226558,30.843400403680192]},"id":"data0","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}},{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.34975747851558,30.791507350323826]},"id":"data1","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}},{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.54751138476558,30.831608990054377]},"id":"data2","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}}]},{"type":"GeoJSONVectorTileLayer","id":"geojson0","options":{"data":"http://localhost:4399/msd_json/res/temp-resources/dev/geojson/e8c/e8c7ecb1-56d2-4f44-85df-cafbdf382203/data.geojson","spatialReference":null,"style":{"style":[{"filter":true,"renderPlugin":{"dataConfig":{"type":"fill"},"sceneConfig":{},"type":"fill"},"symbol":{"polygonBloom":false,"polygonFill":[0.345,0.345,0.502,1],"polygonOpacity":1,"polygonPatternFile":null,"visible":true}},{"filter":true,"renderPlugin":{"dataConfig":{"type":"line"},"sceneConfig":{},"type":"line"},"symbol":{"lineBloom":false,"lineCap":"butt","lineColor":[0.73,0.73,0.73,1],"lineDasharray":[0,0,0,0],"lineDashColor":[1,1,1,0],"lineDx":0,"lineDy":0,"lineGapWidth":0,"lineJoin":"miter","lineOpacity":1,"linePatternAnimSpeed":0,"linePatternFile":null,"lineStrokeWidth":0,"lineStrokeColor":[0,0,0,0],"lineJoinPatternMode":0,"lineWidth":2,"visible":true}}]},"zIndex":3}}],"options":{"sceneConfig":{"environment":{"enable":true,"mode":0,"level":0,"brightness":0},"shadow":{"type":"esm","enable":true,"quality":"high","opacity":0.5,"color":[0,0,0],"blurOffset":1},"postProcess":{"enable":true,"antialias":{"enable":true,"taa":true,"jitterRatio":0.25},"ssr":{"enable":true},"bloom":{"enable":true,"threshold":0,"factor":1,"radius":1},"ssao":{"enable":true,"bias":0.08,"radius":0.08,"intensity":1.5},"sharpen":{"enable":false,"factor":0.2},"outline":{"enable":true,"outlineFactor":0.3,"highlightFactor":0.2,"outlineWidth":1,"outlineColor":[1,1,0]}},"ground":{"enable":false,"renderPlugin":{"type":"fill"},"symbol":{"polygonFill":[0.54,0.54,0.54,1],"polygonOpacity":1},"extras":{"currentMaterial":""}}}}}]};
            assert.deepEqual(json, expected);
            done();
        });
    });

    it('can get msd json', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const json = loader.getMSDJSON();
            const expected = {"jsonVersion":"1.0","version":"1.0.0-beta.10","extent":{"xmin":112.81991128710933,"ymin":29.37271426782948,"xmax":115.96474771289058,"ymax":31.940619063164462},"options":{"spatialReference":{},"lights":{"directional":{"direction":[1,0,-1],"color":[1,1,1]},"ambient":{"resource":null,"exposure":1,"hsv":[0,0,0],"orientation":0}},"seamlessZoom":true,"renderable":true,"doubleClickZoom":true,"zoomable":true,"draggable":true,"center":{"x":114.39232949999996,"y":30.66519600000001},"zoom":9,"bearing":0,"pitch":0},"layers":[{"type":"GroupGLLayer","id":"group","layers":[{"type":"VectorTileLayer","id":"vt0","options":{"urlTemplate":"http://116.63.251.32:8080/tile/planet-single/{z}/{x}/{y}.mvt","spatialReference":"preset-vt-3857","style":{"style":[{"filter":["all",["==","$layer","building"],["==","$type","Polygon"]],"renderPlugin":{"type":"lit","dataConfig":{"type":"3d-extrusion","uv":true,"tangent":true,"altitudeProperty":"null","minHeightProperty":"null","altitudeScale":1,"defaultAltitude":10,"topThickness":0,"top":true,"side":true},"sceneConfig":{"animation":null,"animationDuration":800}},"symbol":{"bloom":false,"ssr":false,"polygonOpacity":1,"material":{"baseColorTexture":"./res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Base_Color.png","baseColorFactor":[1,1,1,1],"hsv":[0,0,0],"baseColorIntensity":1,"contrast":1,"outputSRGB":1,"metallicRoughnessTexture":"./res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Roughness.png","roughnessFactor":1,"metallicFactor":1,"normalTexture":"./res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Normal.png","noiseTexture":null,"uvScale":[1,1],"uvOffset":[0,0],"uvRotation":0,"uvOffsetAnim":[0,0],"normalMapFactor":1,"normalMapFlipY":0,"bumpTexture":"./res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Height.png","bumpScale":0.02,"clearCoatThickness":5,"clearCoatFactor":0,"clearCoatIor":1.4,"clearCoatRoughnessFactor":0.04,"occlusionTexture":"./res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Ambient_Occlusion.png","emissiveTexture":null,"emissiveFactor":[0,0,0],"emitColorFactor":1,"emitMultiplicative":0},"visible":true}}],"featureStyle":[]}}},{"type":"GLTFLayer","id":"gltf0","options":{},"geometries":[{"coordinates":{"x":-74.01086979939879,"y":40.711035446586976},"options":{"zIndex":0,"id":"data0","symbol":{"visible":true,"bloom":false,"ssr":false,"shadow":true,"url":"./res/resources/gltf-model/4d1/4d199d97-918e-4b57-950b-2c0998017db0/e2e_test.glb","animation":true,"animationName":null,"loop":true,"speed":1,"translation":[0,0,0],"scale":[1,1,1],"rotation":[0,0,0],"fixSizeOnZoom":-1,"shader":"pbr","uniforms":{"polygonFill":[1,1,1,1],"polygonOpacity":1,"baseColorIntensity":1,"outputSRGB":1}}},"zoomOnAdded":16}]},{"type":"PointLayer","id":"point0","options":{"collision":false},"geometries":[{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.15200357226558,30.843400403680192]},"id":"data0","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}},{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.34975747851558,30.791507350323826]},"id":"data1","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}},{"feature":{"type":"Feature","geometry":{"type":"Point","coordinates":[114.54751138476558,30.831608990054377]},"id":"data2","properties":null},"options":{"maxMarkerHeight":255,"maxMarkerWidth":255},"symbol":{"visible":true,"markerAllowOverlap":false,"markerBloom":false,"markerDx":0,"markerDy":0,"markerFile":null,"markerFill":[0.53,0.77,0.94,1],"markerFillOpacity":1,"markerHeight":20,"markerHorizontalAlignment":"middle","markerIgnorePlacement":false,"markerLineColor":[1,1,1,1],"markerLineDasharray":[0,0,0,0],"markerLineOpacity":1,"markerLineWidth":3,"markerOpacity":1,"markerPitchAlignment":"viewport","markerPlacement":"point","markerRotationAlignment":"viewport","markerType":"ellipse","markerVerticalAlignment":"middle","markerWidth":20,"textBloom":false,"textAllowOverlap":false,"textDx":0,"textDy":0,"textFaceName":"Microsoft YaHei,sans-serif","textFill":[0,0,0,1],"textHaloFill":[1,1,1,1],"textHaloOpacity":1,"textHaloRadius":0,"textHorizontalAlignment":"middle","textIgnorePlacement":false,"textName":"","textOpacity":1,"textPitchAlignment":"viewport","textPlacement":"point","textRotation":0,"textRotationAlignment":"viewport","textSize":30,"textStyle":"normal","textVerticalAlignment":"middle","textWeight":"normal","textWrapWidth":240}}]},{"type":"GeoJSONVectorTileLayer","id":"geojson0","options":{"data":"./res/temp-resources/dev/geojson/e8c/e8c7ecb1-56d2-4f44-85df-cafbdf382203/data.geojson","spatialReference":null,"style":{"style":[{"filter":true,"renderPlugin":{"dataConfig":{"type":"fill"},"sceneConfig":{},"type":"fill"},"symbol":{"polygonBloom":false,"polygonFill":[0.345,0.345,0.502,1],"polygonOpacity":1,"polygonPatternFile":null,"visible":true}},{"filter":true,"renderPlugin":{"dataConfig":{"type":"line"},"sceneConfig":{},"type":"line"},"symbol":{"lineBloom":false,"lineCap":"butt","lineColor":[0.73,0.73,0.73,1],"lineDasharray":[0,0,0,0],"lineDashColor":[1,1,1,0],"lineDx":0,"lineDy":0,"lineGapWidth":0,"lineJoin":"miter","lineOpacity":1,"linePatternAnimSpeed":0,"linePatternFile":null,"lineStrokeWidth":0,"lineStrokeColor":[0,0,0,0],"lineJoinPatternMode":0,"lineWidth":2,"visible":true}}]},"zIndex":3}}],"options":{"sceneConfig":{"environment":{"enable":true,"mode":0,"level":0,"brightness":0},"shadow":{"type":"esm","enable":true,"quality":"high","opacity":0.5,"color":[0,0,0],"blurOffset":1},"postProcess":{"enable":true,"antialias":{"enable":true,"taa":true,"jitterRatio":0.25},"ssr":{"enable":true},"bloom":{"enable":true,"threshold":0,"factor":1,"radius":1},"ssao":{"enable":true,"bias":0.08,"radius":0.08,"intensity":1.5},"sharpen":{"enable":false,"factor":0.2},"outline":{"enable":true,"outlineFactor":0.3,"highlightFactor":0.2,"outlineWidth":1,"outlineColor":[1,1,0]}},"ground":{"enable":false,"renderPlugin":{"type":"fill"},"symbol":{"polygonFill":[0.54,0.54,0.54,1],"polygonOpacity":1},"extras":{"currentMaterial":""}}}}}]};
            assert.deepEqual(json, expected);
            done();
        });
    });


    it('can get vector tile layer', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('vt0');
            assert(layer);
            assert(layer.getId() === 'vt0');
            done();
        });
    });

    it('can get vector tile layer style', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('vt0');
            const style = layer.getStyle();
            const expected = {"style":[{"filter":["all",["==","$layer","building"],["==","$type","Polygon"]],"renderPlugin":{"type":"lit","dataConfig":{"type":"3d-extrusion","uv":true,"tangent":true,"altitudeProperty":"null","minHeightProperty":"null","altitudeScale":1,"defaultAltitude":10,"topThickness":0,"top":true,"side":true},"sceneConfig":{"animation":null,"animationDuration":800}},"symbol":{"bloom":false,"ssr":false,"polygonOpacity":1,"material":{"baseColorTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Base_Color.png","baseColorFactor":[1,1,1,1],"hsv":[0,0,0],"baseColorIntensity":1,"contrast":1,"outputSRGB":1,"metallicRoughnessTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Roughness.png","roughnessFactor":1,"metallicFactor":1,"normalTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Normal.png","noiseTexture":null,"uvScale":[1,1],"uvOffset":[0,0],"uvRotation":0,"uvOffsetAnim":[0,0],"normalMapFactor":1,"normalMapFlipY":0,"bumpTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Height.png","bumpScale":0.02,"clearCoatThickness":5,"clearCoatFactor":0,"clearCoatIor":1.4,"clearCoatRoughnessFactor":0.04,"occlusionTexture":"http://localhost:4399/msd_json/res/resources/material/d81/d81c6c80-aca4-4773-a33c-707d64c184d7/Wood_wall_Ambient_Occlusion.png","emissiveTexture":null,"emissiveFactor":[0,0,0],"emitColorFactor":1,"emitMultiplicative":0},"visible":true}}],"featureStyle":[]};
            assert.deepEqual(style, expected);
            assert(style.style.length === 1);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get layer json', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('geojson0');
            const json = layer.getJSON();
            const expected = {"type":"GeoJSONVectorTileLayer","id":"geojson0","options":{"data":"http://localhost:4399/msd_json/res/temp-resources/dev/geojson/e8c/e8c7ecb1-56d2-4f44-85df-cafbdf382203/data.geojson","spatialReference":null,"style":{"style":[{"filter":true,"renderPlugin":{"dataConfig":{"type":"fill"},"sceneConfig":{},"type":"fill"},"symbol":{"polygonBloom":false,"polygonFill":[0.345,0.345,0.502,1],"polygonOpacity":1,"polygonPatternFile":null,"visible":true}},{"filter":true,"renderPlugin":{"dataConfig":{"type":"line"},"sceneConfig":{},"type":"line"},"symbol":{"lineBloom":false,"lineCap":"butt","lineColor":[0.73,0.73,0.73,1],"lineDasharray":[0,0,0,0],"lineDashColor":[1,1,1,0],"lineDx":0,"lineDy":0,"lineGapWidth":0,"lineJoin":"miter","lineOpacity":1,"linePatternAnimSpeed":0,"linePatternFile":null,"lineStrokeWidth":0,"lineStrokeColor":[0,0,0,0],"lineJoinPatternMode":0,"lineWidth":2,"visible":true}}]},"zIndex":3}};
            assert.deepEqual(json, expected);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get geojson layer data', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('geojson0');
            const data = layer.getData();
            const expected = 'http://localhost:4399/msd_json/res/temp-resources/dev/geojson/e8c/e8c7ecb1-56d2-4f44-85df-cafbdf382203/data.geojson';
            assert.deepEqual(data, expected);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get a gltf marker', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('gltf0');
            const marker = layer.getGeometryById('data0');
            const url = marker.options.symbol.url;
            assert(url === 'http://localhost:4399/msd_json/res/resources/gltf-model/4d1/4d199d97-918e-4b57-950b-2c0998017db0/e2e_test.glb', url);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get all gltf markers', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('gltf0');
            const markers = layer.getGeometries();
            assert.deepEqual(markers[0], layer.getGeometryById('data0'));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can set basePath', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch,
            basePath: 'http://resources.example.com'
        });
        loader.load().then(() => {
            const layer = loader.getLayer('gltf0');
            const marker = layer.getGeometryById('data0');
            const url = marker.options.symbol.url;
            assert(url === 'http://resources.example.com/res/resources/gltf-model/4d1/4d199d97-918e-4b57-950b-2c0998017db0/e2e_test.glb', url);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get lights config', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const lights = loader.getLights();            
            const expected = {"directional":{"direction":[1,0,-1],"color":[1,1,1]},"ambient":{"resource":null,"exposure":1,"hsv":[0,0,0],"orientation":0}};
            assert.deepEqual(lights, expected);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('can get scene config', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/${mapJsonFile}`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const sceneConfig = loader.getSceneConfig();
            const expected = {"environment":{"enable":true,"mode":0,"level":0,"brightness":0},"shadow":{"type":"esm","enable":true,"quality":"high","opacity":0.5,"color":[0,0,0],"blurOffset":1},"postProcess":{"enable":true,"antialias":{"enable":true,"taa":true,"jitterRatio":0.25},"ssr":{"enable":true},"bloom":{"enable":true,"threshold":0,"factor":1,"radius":1},"ssao":{"enable":true,"bias":0.08,"radius":0.08,"intensity":1.5},"sharpen":{"enable":false,"factor":0.2},"outline":{"enable":true,"outlineFactor":0.3,"highlightFactor":0.2,"outlineWidth":1,"outlineColor":[1,1,0]}},"ground":{"enable":false,"renderPlugin":{"type":"fill"},"symbol":{"polygonFill":[0.54,0.54,0.54,1],"polygonOpacity":1},"extras":{"currentMaterial":""}}};
            assert.deepEqual(sceneConfig, expected);
            done();
        }).catch(err => {
            done(err);
        });
    });
});