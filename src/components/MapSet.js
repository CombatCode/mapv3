

/**
 * Class representing MapSets
 * @module components/MapSet
 * @augments L.Map
 */
export default class MapSet extends L.Map {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#map-example} for more details.
     * @param {string} id - ID of the DOM element representing map container
     * @param {object} [options]
     */
    constructor(id, options){
        super(id, options);
    }
}
