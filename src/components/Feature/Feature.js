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
    constructor(latlng, options = {}) {
        super(latlng, options);
    }

    /** @param {L.Tooltip} tooltip */
    _fixTooltipOffset(tooltip) {
        let offset = tooltip.options.offset, direction = tooltip.options.direction;

        if (direction === 'auto') {
            direction = L.DomUtil.hasClass(tooltip._container, 'leaflet-tooltip-left')? 'left' : 'right';
            if ((direction === 'left' && offset.x > 0) || (direction === 'right' && offset.x < 0)) {
                offset.x = -offset.x;
                tooltip.update();
            }
        }
    }

    // no alt, ctrl, or shift pressed; not over another selectable marker
    static rotateCondition(event) {
        const oEvent = event.originalEvent;
        if (!oEvent.altKey && !oEvent.ctrlKey && !oEvent.shiftKey) {
            let targetEl = oEvent.target, mapContainerEl = event.target.getContainer();
            while (targetEl !== mapContainerEl) {
                if (L.DomUtil.hasClass(targetEl, 'leaflet-marker-selectable')) {
                    return false;
                }
                targetEl = targetEl.parentNode;
            }
            return true
        }
        return false;
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

    rotateCondition: Feature.rotateCondition
});
