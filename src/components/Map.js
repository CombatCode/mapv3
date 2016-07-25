import L from 'leaflet';

/**
 * Class representing Maps
 * @module components/Map
 * @augments L.TileLayer
 */
export default class Map extends L.TileLayer {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#tilelayer} for more details.
     * @param {string} url
     * @param {object} [options]
     */
    constructor(url, options){
        super(url, options);
    }
}
