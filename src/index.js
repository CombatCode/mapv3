import MapSet from './components/MapSet';
import Map from './components/Map';
import Feature from './components/Feature/Feature';
import CameraFeature from './components/Feature/FeatureCamera';
import Overlay from './components/Overlay';


const littleton = new Feature([39.61, -105.02]);
const denver = new Feature([39.74, -104.99]);
const aurora = new Feature([39.73, -104.8]);
const golden = new CameraFeature([39.77, -105.23], {
    angle: 50,
    title: 'xyz'
}).bindPopup('xoxox').openPopup();

var cities = L.layerGroup([littleton, denver, aurora, golden]);

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
    center: [39.73, -104.99],
    zoom: 10,
    layers: [nightMap, streetMap]
});


var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[39.73, -104.99], [39.77, -105.23]];
let over = new Overlay(imageUrl, imageBounds);

var baseMaps = {
    "nightMap": nightMap,
    "streetMap": streetMap
};

var overlayMaps = {
    "Cities": cities,
    "over": over
};

L.control.layers(baseMaps, overlayMaps).addTo(mapSet);
