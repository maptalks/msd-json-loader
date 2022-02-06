# MSDJSONLoader
![CircleCI](https://circleci.com/gh/maptalks/MSDJSONLoader.svg?style=shield)

MapTalks IDE msd文件导出的json数据的读取工具库。

MSDJSONLoader提供了各种接口，用于读取MSD导出的JSON中的整个地图，某个图层，某个图层的样式/数据，全局后处理配置或灯光配置等。

您可以方便的使用这个工具库来选择MSD文件中需要的资源，加载到您自己的地图程序中。

## 安装

```
npm i @maptalks/msdjsonloader
```
或
```
<script type="text/javascript" src="https://unpkg.com/@maptalks/MSDJSONLoader/dist/MSDJSONLoader.js"></script>
```

## 相对路径转换

MSD JSON中的资源路径都是相对路径，相对的是map.json的存储路径。

而在页面程序中，资源的相对路径都是参考的页面的路径，当map.json和页面不在同一目录下时，程序会找不到资源。

MSDJSONLoader中会自动把资源的相对路径替换为绝对路径

### 默认根路径

按照默认方式加载时，MSDJSONLoader会用map.json的路径 `path/to/map.json` 将资源路径中的 `./res` 替换为 `path/to/res`。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'http://example.com/map.json'
});
await loader.load();
const marker = loader.getLayer('gltf0').getGeometryById('data0');
// 此时的gltfURL不再是相对路径，而是绝对路径了。
const gltfURL = marker.options.symbol.url;
```
此时map.json中原有的GLTFMarker的模型路径：
```js
symbol: {
    url: './res/resources/gltf.json'
}
````
会被替换为:
```js
symbol: {
    url: 'http://example.com/res/resources/gltf.json'
}
````

### 自定义根路径

您也可以在创建MSDJSONLoader时，通过 basePath 参数指定一个根路径，例如：
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'http://example.com/map.json',
    basePath: 'http://resources.example.com'
});
```
此时map.json中原有的GLTFMarker的模型路径：
```js
symbol: {
    url: './res/resources/gltf.json'
}
````
会被替换为:
```js
symbol: {
    url: 'http://resources.example.com/res/resources/gltf.json'
}
````

## MSDJSONLoader类的接口说明

### `Constructor`
```javascript
new MSDJSONLoader(options);
```
* options **Object**
  * options.data **String** | **Object** map.json的远程地址或读取出来的map.json对象实例
  * options.basePath **String**     json中资源路径的根路径

### `load()`
加载JSON，是一个异步方法。

**Returns** Promise

### `getMSDJSON()`
获取MSD JSON对象

**Returns** Object

### `getMapJSON()`
获取Map JSON对象，可以用于创建地图对象。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const mapJSON = loader.getMapJSON();

const map = maptalks.Map.fromJSON('map', mapJSON);
````

**Returns** Object

### `getView()`
获取MSD JSON中地图的view（包括 center, zoom, pitch, bearing）。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const view = loader.getView();
map.setView(view);
````

**Returns** Object

### `getSceneConfig()`
获取MSD JSON中GroupGLLayer的sceneConfig。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const sceneConfig = loader.getSceneConfig();
groupLayer.setSceneConfig(sceneConfig);
````

**Returns** Object

### `getLights()`
获取MSD JSON中map的Lights配置。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const lights = loader.getLights();
map.setLights(lights);
````

**Returns** Object

### `getLayer(id)`
获取MSD JSON中某个图层的LayerJSON对象。
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('vt0');
````
* id **String** | **Number** 图层id

**Returns** LayerJSON

### `getLayers()`
获取MSD JSON中所有图层的LayerJSON对象数组。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layers = loader.getLayers();
````

**Returns** LayerJSON[]

## LayerJSON类的接口说明

`LayerJSON` 只能通过 `MSDJSONLoader`的`getLayer`和`getLayers`方法获取，不能直接实例化。

### `getId()`
获取图层的id
```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('vt0');
const id = layer.getId();
````

**Returns** String|Number

### `getJSON()`
获取图层JSON对象，可以用于创建Layer实例。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('vt0');
const json = layer.getJSON();

const vtLayer = maptalks.Layer.fromJSON(json);
````

**Returns** Object

### `getStyle()`
获取图层的样式对象，其中资源路径都是绝对路径。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('vt0');
const style = layer.getStyle();
````

**Returns** Object

### `getData()`
获取图层的数据对象，目前只有部分图层(例如GeoJSONVectorTileLayer)支持。

为了减少`map.json`的文件大小，GeoJSONVectorTileLayer的data是以外部geojson文件的形式存储的。

因此GeoJSONVectorTileLayer的getData方法返回的是geojson文件的绝对路径形式的url。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('geojson0');
const data = layer.getData();
````

**Returns** Object

### `getGeometryById(id)`
获取指定id的Geometry JSON，可以用于创建Geometry对象。

仅部分图层支持，如GLTFLayer，PointLayer，LineStringLayer和PolygonLayer。

不支持的图层会返回null。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('gltf0');
const markerJSON = layer.getGeometryById('data0');
const marker = maptalks.Geometry.fromJSON(markerJSON);
````
* id **String** | **Number** 图层id
**Returns** Object

### `getGeometries(id)`
获取所有的Geometry JSON对象，可以用于创建Geometry对象。

仅部分图层支持，如GLTFLayer，PointLayer，LineStringLayer和PolygonLayer。

不支持的图层会返回空数组。

```js
import MSDJSONLoader from '@maptalks/MSDJSONLoader';

const loader = new MSDJSONLoader({
    data: 'path/to/map.json'
});
await loader.load();
const layer = loader.getLayer('gltf0');
const markerJSONs = layer.getGeometries('data0');
const markers = markerJSONs.map(markerJSON => maptalks.Geometry.fromJSON(markerJSON));
````
**Returns** Object[]