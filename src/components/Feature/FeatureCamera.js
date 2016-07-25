import Feature from './Feature';

/**
 * Class representing Camera Feature
 * @module components/Feature/FeatureCamera
 * @augments Feature
 */
export default class FeatureCamera extends Feature {
    /**
     * Feature of the camera marker.
     * @param {array} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}){
        options.icon = L.icon({
            iconUrl: 'assets/feature-camera-inuse.png',
            iconSize: [26, 26]
        });
        super(latlng, options);
    }
}
