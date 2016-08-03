import L from 'leaflet';


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
    constructor(id = NaN, name = '', options = {}){
        // Parameters in class body
        this.id = id;
        this.name = name;
        this.options = options;

        // Non optional settings
        this.options.drawControl = true;

        // Static settings
        this._containerId = 'mapv3';
        this._instance = L.Map;
    }

    /**
     * Lazy initialize of L.Map instance
     * @returns {L.Map|*}
     */
    initialize() {
        this._instance = new L.Map(this._containerId, this.options);
        return this._instance;
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
