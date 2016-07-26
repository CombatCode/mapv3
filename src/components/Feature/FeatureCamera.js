import L from 'leaflet';
import Feature from './Feature';
import FigureIcon from './../FigureIcon';

/**
 * Class representing Camera Feature
 * @module components/Feature/FeatureCamera
 * @augments Feature
 */
export default class FeatureCamera extends Feature {
    /**
     * Feature of the camera marker.
     * @param {object} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}){
        options.icon = new FigureIcon({
            className: 'FeatureCamera',
            iconUrl: 'assets/feature-camera-inuse.png',
            iconSize: [56, 50],
            title: options.title || ''
        });
        super(latlng, options);
    }
}
