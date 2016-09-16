import L from 'leaflet';

import '../../handlers/selection/BoxSelect';
import '../../handlers/selection/LassoSelect';
import '../../handlers/drop/Map.Drop';
import { createFeature, FeatureGroup } from '../Feature/Features';
import ControlRotate from './../Control/Control.Rotate';
import ControlSelectionMode from '../Control/ControlSelectionMode'


/**
 * Class representing MapSets
 * @module components/MapSet
 * @augments L.Map
 */
export default class MapSet {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#map-example} for more details.
     * @param {number} [id]
     * @param {string} [name]
     * @param {object} [options]
     */
    constructor(id = NaN, name = '', options = {}) {
        // Parameters in class body
        this.id = id;
        this.name = name;
        Object.assign(this.options, options);

        // Static settings
        this._containerId = 'mapv3';
        this._instance = L.Map;
    }

    /**
     * Lazy initialize of L.Map instance
     * @returns {L.Map|*}
     */
    initialize() {
        let lmap = this._instance = new L.Map(this._containerId, this.options);
        lmap._mapSet = this;
        let features = this.features = lmap.features = new FeatureGroup({zoomToBoundsOnClick: false});

        lmap.addControl(new ControlRotate({
            content: '<i class="icon rotate"></i>'
        }));
        lmap.addControl(new ControlSelectionMode({
            contentLasso: '<i class="icon lasso-select"></i>',
            contentBox: '<i class="icon box-select"></i>'

        }));

        lmap.on('drop', this._onDrop, this);
        lmap.once('zoomlevelschange', (e) => features.addTo(lmap));

        return lmap;
    }

    /**
     * Get instance of L.Map class
     * @returns {L.Map|*}
     */
    get instance() {
        return this._instance;
    }

    get isInitialized() {
        console.log(this._instance);
        debugger;
    }

    /**
     * Assign options for the Map Set
     * @param {object} options
     */
    set setOptions(options) {
        Object.assign(this.options, options);
    }

    _onDrop(event) {
        event.originalEvent.preventDefault();
        let dt = event.originalEvent.dataTransfer;
        let data;

        if (dt.types.includes('application/json')) {
            data = dt.getData('application/json');
        } else {
            data = dt.getData('text');
        }

        data = JSON.parse(data);

        if (typeof data === 'object' && data !== null) {
            let newFeature = createFeature(data.type, event.latlng, data);
            let map = this._instance;
            if (newFeature instanceof L.Layer) {
                newFeature._map = map;
                newFeature._showContextMenu(event, 'onDrop');
                map.once('contextmenu.hide', e => newFeature._map = undefined);
            }
        }
    }
}


MapSet.prototype.options = {
    drawControl:      true,

    contextmenu:      true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text:     'Center map here',
        iconCls:  'fa fa-dot-circle-o',
        callback: function centerMap(event) {
            this.panTo(event.latlng);
        }
    }, '-', {
        text:     'Zoom in',
        iconCls:  'fa fa-search-plus',
        callback: function zoomIn(event) {
            this.zoomIn();
        }
    }, {
        text:     'Zoom out',
        iconCls:  'fa fa-search-minus',
        callback: function zoomOut(event) {
            this.zoomOut();
        }
    }]
};
