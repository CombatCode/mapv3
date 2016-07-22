(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = L || window.L;

var Feature = (function (_L$Marker) {
    _inherits(Feature, _L$Marker);

    function Feature(latlng) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Feature);

        _L$Marker.call(this, latlng, options);
        this.origin = options.origin || '50% 50%';
        this.angle = options.angle || 0;
    }

    Feature.prototype._setPos = function _setPos(pos) {
        _L$Marker.prototype._setPos.call(this, pos);

        if (this.angle) {
            var oldIE = L.DomUtil.TRANSFORM === 'msTransform';
            this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.origin;
            console.log('oldIE', oldIE, this._icon.style[L.DomUtil.TRANSFORM]);
            if (oldIE) {
                this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.angle + 'deg)';
            } else {
                // Use 3D accelerated version for the modern browsers
                this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.angle + 'deg)';
            }
            console.log(this._icon.style[L.DomUtil.TRANSFORM]);
        }
    };

    return Feature;
})(L.Marker);

exports['default'] = Feature;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Feature2 = require('../Feature');

var _Feature3 = _interopRequireDefault(_Feature2);

var L = L || window.L;

var CameraFeature = (function (_Feature) {
    _inherits(CameraFeature, _Feature);

    function CameraFeature(latlng) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, CameraFeature);

        options.icon = L.icon({
            iconUrl: 'http://127.0.0.1:8000/common/images/gis/feature-camera-inuse.png',
            iconSize: [26, 26]
        });
        _Feature.call(this, latlng, options);
    }

    return CameraFeature;
})(_Feature3['default']);

exports['default'] = CameraFeature;
module.exports = exports['default'];

},{"../Feature":1}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = L || window.L;

var Map = (function (_L$TileLayer) {
    _inherits(Map, _L$TileLayer);

    function Map(url, options) {
        _classCallCheck(this, Map);

        _L$TileLayer.call(this, url, options);
    }

    return Map;
})(L.TileLayer);

exports["default"] = Map;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = L || window.L;

var MapSet = (function (_L$Map) {
    _inherits(MapSet, _L$Map);

    function MapSet(id, options) {
        _classCallCheck(this, MapSet);

        _L$Map.call(this, id, options);
    }

    return MapSet;
})(L.Map);

exports["default"] = MapSet;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = L || window.L;

var OverLayer = (function (_L$ImageOverlay) {
    _inherits(OverLayer, _L$ImageOverlay);

    function OverLayer(imageUrl, imageBounds) {
        _classCallCheck(this, OverLayer);

        _L$ImageOverlay.call(this, imageUrl, imageBounds);
    }

    return OverLayer;
})(L.ImageOverlay);

exports["default"] = OverLayer;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsMapSet = require('./components/MapSet');

var _componentsMapSet2 = _interopRequireDefault(_componentsMapSet);

var _componentsMap = require('./components/Map');

var _componentsMap2 = _interopRequireDefault(_componentsMap);

var _componentsFeatureFeature = require('./components/Feature/Feature');

var _componentsFeatureFeature2 = _interopRequireDefault(_componentsFeatureFeature);

var _componentsFeatureTypeCameraFeature = require('./components/Feature/Type/CameraFeature');

var _componentsFeatureTypeCameraFeature2 = _interopRequireDefault(_componentsFeatureTypeCameraFeature);

var _componentsOverLayer = require('./components/OverLayer');

var _componentsOverLayer2 = _interopRequireDefault(_componentsOverLayer);

var littleton = new _componentsFeatureFeature2['default']([39.61, -105.02]);
var denver = new _componentsFeatureFeature2['default']([39.74, -104.99]);
var aurora = new _componentsFeatureFeature2['default']([39.73, -104.8]);
var golden = new _componentsFeatureTypeCameraFeature2['default']([39.77, -105.23], {
    angle: 50,
    title: 'xyz'
}).bindPopup('xoxox').openPopup();

var cities = L.layerGroup([littleton, denver, aurora, golden]);

var nightMap = new _componentsMap2['default']('https://api.mapbox.com/styles/v1/combatcode/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Teleste.com',
    maxZoom: 18,
    id: 'ciqt6cafh0008ccno3oke4lbd',
    accessToken: 'pk.eyJ1IjoiY29tYmF0Y29kZSIsImEiOiJjaXF0NmFqZTQwMDBqaTNuaW0zcGl5ZnlvIn0.T5y8V6UbhGk82fL5tZXeig'
});

var streetMap = new _componentsMap2['default']('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Teleste.com',
    maxZoom: 18
});

var mapSet = new _componentsMapSet2['default']('mapid', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [nightMap, streetMap]
});

var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[39.73, -104.99], [39.77, -105.23]];
var over = new _componentsOverLayer2['default'](imageUrl, imageBounds);

var baseMaps = {
    "nightMap": nightMap,
    "streetMap": streetMap
};

var overlayMaps = {
    "Cities": cities,
    "over": over
};

L.control.layers(baseMaps, overlayMaps).addTo(mapSet);

console.log('ftw');

},{"./components/Feature/Feature":1,"./components/Feature/Type/CameraFeature":2,"./components/Map":3,"./components/MapSet":4,"./components/OverLayer":5}]},{},[6]);
