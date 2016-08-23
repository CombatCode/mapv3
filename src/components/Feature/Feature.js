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

    /**
     * Factory
     * @param {string} type
     * @param {*} params
     * @returns [Feature]
     */
    static createFeature(type, ...params) {
        const FeatureCtr = Feature.constructors[type];
        return FeatureCtr? new FeatureCtr(...params) : undefined;
    }

    // Show custom contextmenu when dropping Feature on map.
    _showContextMenu(event, menuType) {
        //if (event.originalEvent.type === 'drop' && this.options.onDropContextmenuItems) {
        if (menuType) {
            this._map.once('contextmenu.hide', (function(ownItems, items, ownInherit, inherit) {
                ownItems? (this.options.contextmenuItems = items) : (delete this.options.contextmenuItems);
                ownInherit? (this.options.contextmenuInheritItems = inherit) :
                    (delete this.options.contextmenuInheritItems);
            }).bind(
                this,
                Object.hasOwnProperty(this.options, 'contextmenuItems'),
                this.options.contextmenuItems,
                Object.hasOwnProperty(this.options, 'contextmenuInheritItems'),
                this.options.contextmenuInheritItems
            ));
            this.options.contextmenuItems = this.options[`${menuType}ContextmenuItems`];
            this.options.contextmenuInheritItems = this.options[`${menuType}ContextmenuInheritItems`];
        }

        super._showContextMenu(event);
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

// @namespace
Feature.constructors = {};

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
