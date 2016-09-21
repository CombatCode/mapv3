import L from 'leaflet';
import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Alarm Feature
 * @module components/Feature/FeatureAlarm
 * @extends Feature
 */
export default class FeatureAlarm extends Feature {
    static defaults = Object.assign(Object.create(Feature.defaults), {
        // Leaflet.contextmenu options
        contextmenuItems: [{
            text: 'Alarm',
            iconCls: 'icon svmx feature alarm',
            disabled: true,
            index: 0
        }],
        onDropContextmenuItems: [{
            text: 'add as an Alarm',
            iconCls: 'icon svmx feature alarm',
            callback: function(e) {
                e.relatedTarget.addTo(this.features);
            }
        }]
    });

    /**
     * Feature of the alarm marker.
     * @param {L.LatLng} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        if (!('name' in options) && 'id' in options) {
            options.name = 'Alarm ${options.id}'
        }
        if (!('icon' in options)) {
            options.icon = new FigureIcon({
                className: 'FeatureAlarm',
                iconSize: [28, 28],
                id: options.id,
                title: options.name
            });
        }
        super(latlng, options);
    }
}

FeatureAlarm.include({options: FeatureAlarm.defaults});
