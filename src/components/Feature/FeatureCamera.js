import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Camera Feature
 * @module components/Feature/FeatureCamera
 * @extends Feature
 */
export default class FeatureCamera extends Feature {
    /**
     * Feature of the camera marker.
     * @param {L.LatLng} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        if (!options.icon) {
            /** we must instantiate icons (because e.g. titles differs between Features) */
            options.icon = new FigureIcon({
                className: 'FeatureCamera',
                iconUrl: 'assets/feature-camera-inuse.png',
                iconSize: [56, 50],
                title: options.title || ''
            });
        }
        super(latlng, options);
    }
}

/** Inherit options */
FeatureCamera.prototype.options = Object.create(Feature.prototype.options);

FeatureCamera.mergeOptions({
    contextmenuItems: [{
        text:     'Camera',
        icon:     'assets/feature-camera-inuse.png',
        disabled: true,
        index:    0

    }, {
        separator: true,
        index:     1
    }],
});
