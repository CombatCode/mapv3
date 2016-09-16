import L from 'leaflet'
import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Link Feature
 * @module components/Feature/FeatureMap
 * @extends Feature
 */
export default class FeatureMap extends Feature {
    static defaults = Object.assign(Object.create(Feature.defaults), {
        // Leaflet.contextmenu options
        contextmenuItems: [{
            text: 'Map Link',
            iconCls: 'icon svmx feature link',
            disabled: true,
            index: 0

        }],

        onDropContextmenuItems: [{
            text: 'add as a Map Link',
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
            options.name = `Map ${options.id}`
        }
        if (!('icon' in options)) {
            options.icon = new FigureIcon({
                className: 'FeatureMap',
                iconSize: [28, 28],
                id: options.id,
                title: options.name
            });
        }
        super(latlng, options);

        this.on('dblclick', this.openMap);
    }

    /**
     * Open href argument in the new window tab
     * @method openLink
     */
    openMap() {
        this._map._mapSet.compoennt.fetchMap(this.options.mapID, this.options.mapSetID);
    }

}

FeatureMap.include({options: FeatureMap.defaults});