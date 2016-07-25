import MapSet from './components/MapSet';
import Map from './components/Map';
import Feature from './components/Feature/Feature';
import CameraFeature from './components/Feature/FeatureCamera';
import Overlay from './components/Overlay';


const cameras = L.layerGroup([
    new CameraFeature([48.867029, 2.320647], {
        angle: 156,
        title: 'top left'
    }),
    new CameraFeature([48.866387, 2.323415], {
        angle: 228,
        title: 'top right'
    }),
    new CameraFeature([48.864700, 2.319381], {
        angle: 50,
        title: 'bottom left'
    }),
    new CameraFeature([48.864022, 2.321462], {
        angle: -16,
        title: 'bottom right'
    }),
]);

const nightMap = new Map(
    'https://api.mapbox.com/styles/v1/combatcode/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
    {
        attribution: 'Teleste.com',
        maxZoom: 18,
        id: 'ciqt6cafh0008ccno3oke4lbd',
        accessToken: 'pk.eyJ1IjoiY29tYmF0Y29kZSIsImEiOiJjaXF0NmFqZTQwMDBqaTNuaW0zcGl5ZnlvIn0.T5y8V6UbhGk82fL5tZXeig'
    }
);

const streetMap = new Map(
    'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'Teleste.com',
        maxZoom: 18
    }
);

const mapSet = new MapSet('mapv3', {
    center: [48.865412, 2.321065],
    maxBounds: [
        [42.25, -5.2],
        [51.100, 8.23]
    ],
    zoom: 15,
    layers: [nightMap, streetMap]
});


var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[48.867029, 2.320647], [48.864022, 2.321462]];
let over = new Overlay(imageUrl, imageBounds);

var baseMaps = {
    "nightMap": nightMap,
    "streetMap": streetMap
};

var overlayMaps = {
    "Features": cameras,
    "over": over
};

L.control.layers(baseMaps, overlayMaps).addTo(mapSet);

