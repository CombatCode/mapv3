import L from "leaflet";
import "leaflet.markercluster";


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
    constructor(latlng, options = {}) {
        super(latlng, options);
    }
}

/** Inherit options (don't mutate L.Marker defaults) */
Feature.prototype.options = Object.create(L.Marker.prototype.options);

Feature.mergeOptions({
    contextmenu: true,
    contextmenuItems: [{
        text: 'Unknown feature',
        disabled: true,
        index: 0
    }, {
        separator: true,
        index: 1
    }],

    // no alt, ctrl, or shift pressed; not over another marker
    rotateCondition: function(event) {
        const targetEl = event.originalEvent.target, oEvent = event.originalEvent;
        return !oEvent.altKey && !oEvent.shiftKey && !oEvent.shiftKey && !(
            L.DomUtil.hasClass(targetEl, 'leaflet-marker-selectable') ||
            L.DomUtil.hasClass(targetEl.parentNode, 'leaflet-marker-selectable'));
    }
});


L.MarkerCluster && L.MarkerCluster.mergeOptions({
    contextmenu: true,
    contextmenuItems: [{
        text: 'Group',
        disabled: true,
        index: 0
    }, {
        separator: true,
        index: 1
    }]
});
