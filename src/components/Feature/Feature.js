import L from 'leaflet';

/**
 * Class representing Features a.k.a. Markers
 * @module components/Feature/Feature
 * @augments L.Marker
 */
export default class Feature extends L.Marker {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#marker} for more details.
     * @param {object} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}){
        super(latlng, options);
        this.origin = options.origin || '50% 50%';
        this.angle = options.angle || 0;
    }

    /**
     * Additional support of the rotation.
     * Apply rotation on the icon node or child img element.
     * @param pos
     * @private
     */
    _setPos(pos) {
        super._setPos(pos);

        if(this.angle) {
            const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');
            let isNestedIcon = this._icon.hasChildNodes();
            let iconElement;

            if (isNestedIcon) {
                iconElement = this._icon.getElementsByTagName('img')[0];
            } else {
                iconElement = this._icon;
            }

            iconElement.style[`${ L.DomUtil.TRANSFORM }Origin`] = this.origin;

            if(oldIE || isNestedIcon) {
                iconElement.style[L.DomUtil.TRANSFORM] = `rotate(${ this.angle }deg)`;
            } else {
                // Use 3D accelerated version for the modern browsers
                iconElement.style[L.DomUtil.TRANSFORM] += ` rotate(${ this.angle }deg)`;
            }
        }
    }
}
