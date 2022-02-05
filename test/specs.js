const { MSDJSONLoader } = require('../dist/MSDJSONLoader.js');
const fetch = require('node-fetch');
const startServer = require('./server.js');
const assert = require('assert');

const PORT = 4399;

describe('sepcs', () => {
    let server;
    before(done => {
        server = startServer(PORT, done);
    });

    after(() => {
        server.close();
    });

    it('can get vector tile layer', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/map.json`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            assert(loader.getLayer('vt0'));
            done();
        });
    });

    it('can get vector tile layer style', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/map.json`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const layer = loader.getLayer('vt0');
            const style = layer.getStyle();
            assert(style);
            assert(style.style.length === 2);
            done();
        });
    });

    it('can get lights config', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/map.json`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const lights = loader.getLights();
            assert(lights);
            assert(lights.ambient);
            assert(lights.directional);
            done();
        });
    });

    it('can get scene config', done => {
        const loader = new MSDJSONLoader({
            data: `http://localhost:${PORT}/map.json`,
            fetchFunction: fetch
        });
        loader.load().then(() => {
            const sceneConfig = loader.getSceneConfig();
            assert(sceneConfig);
            assert(sceneConfig.postProcess);
            assert(sceneConfig.shadow);
            done();
        });
    });
});