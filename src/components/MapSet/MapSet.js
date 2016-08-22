import L from 'leaflet';
import '../../handlers/drop/Map.Drop';

import ControlRotate from './../Control/Control.Rotate';


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
        lmap.addControl(new ControlRotate({
            content: '<i class="icon repeat"></i>'
        }));

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
