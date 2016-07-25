/**
 * Class representing OverLayers
 * @module components/OverLayer
 * @augments L.ImageOverlay
 */
export default class Overlay extends L.ImageOverlay {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#imageoverlay} for more details.
     * @param {string} imageUrl
     * @param {object} imageBounds
     */
    constructor(imageUrl, imageBounds){
        super(imageUrl, imageBounds)
    }
}
