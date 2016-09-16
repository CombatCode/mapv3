import L from 'leaflet'
import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Link Feature
 * @module components/Feature/FeatureLink
 * @extends Feature
 */
export default class FeatureLink extends Feature {
    static defaults = Object.assign(Object.create(Feature.defaults), {
        // Leaflet.contextmenu options
        contextmenuItems: [{
            text: 'External Link',
            iconCls: 'icon svmx feature link',
            disabled: true,
            index: 0

        }],

        onDropContextmenuItems: [{
            text: 'add as a External Link',
            iconCls: 'icon svmx feature link',
            callback: function(e) { e.relatedTarget.addTo(this.features); }
        }]
    });

    /**
     * Feature of the camera marker.
     * @param {L.LatLng} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        if (!('name' in options) && 'id' in options) {
            options.name = `Link ${options.id}`
        }
        if (!('icon' in options)) {
            options.icon = new FigureIcon({
                className: 'FeatureLink',
                iconSize: [28, 28],
                id: options.id,
                title: options.name
            });
        }
        super(latlng, options);
        this.href = options.href;

        this.on('dblclick', this.openLink);
    }

    /**
     * Open href argument in the new window tab
     * @method openLink
     */
    openLink() {
        window.open(this.href, '_blank');
    }

}

FeatureLink.include({options: FeatureLink.defaults});