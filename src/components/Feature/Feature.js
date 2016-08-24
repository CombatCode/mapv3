import L from 'leaflet';


/**
 * Class representing Features a.k.a. Markers
 * @module components/Feature/Feature
 * @augments L.Marker
 */
export default class Feature extends L.Marker {
    static defaults = Object.assign(Object.create(L.Marker.prototype.options), {
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
    })

    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#marker} for more details.
     * @param {object} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        super(latlng, options);
    }

    /**
     * Extends method from Leaflet.contextmenu plugin.
     * @param {Event} event DOM event
     * @param {string} [menuType] Uses different contextmenu, all options params must be defined with type prefix.
     * @private
     */
    _showContextMenu(event, menuType) {
        if (menuType) {
            const items = this.options.contextmenuItems;
            const ownItems = Object.hasOwnProperty(this.options, 'contextmenuItems');
            const inherit = this.options.contextmenuInheritItems;
            const ownInherit = Object.hasOwnProperty(this.options, 'contextmenuInheritItems');

            this._map.once('contextmenu.hide', function revertChanges() {
                ownItems ? (this.options.contextmenuItems = items) :
                    (delete this.options.contextmenuItems);
                ownInherit ? (this.options.contextmenuInheritItems = inherit) :
                    (delete this.options.contextmenuInheritItems);
            }, this);
            this.options.contextmenuItems = this.options[`${menuType}ContextmenuItems`];
            this.options.contextmenuInheritItems = this.options[`${menuType}ContextmenuInheritItems`];
        }

        super._showContextMenu(event);
    }

    /**
     * Adapts tooltip offset's X axis when it's set to "auto" positioning.
     * @param {L.Tooltip} tooltip
     * @private
     */
    _fixTooltipOffset(tooltip) {
        const offset = tooltip.options.offset;
        let direction = tooltip.options.direction;

        if (direction === 'auto') {
            direction = L.DomUtil.hasClass(tooltip._container, 'leaflet-tooltip-left')? 'left' : 'right';
            if ((direction === 'left' && offset.x > 0) || (direction === 'right' && offset.x < 0)) {
                offset.x = -offset.x;
                tooltip.update();
            }
        }
    }


    /**
     * Additional condition regulates when rotating handler can start rotation.
     * No alt, ctrl, or shift pressed; not when hovering another selectable marker.
     * @param {Event} event
     * @returns {boolean}
     */
    static rotateCondition(event) {
        const oEvent = event.originalEvent || event;
        if (!oEvent.altKey && !oEvent.ctrlKey && !oEvent.shiftKey) {
            return false;
        }
        let targetEl = oEvent.target, mapContainerEl = event.target.getContainer();
        while (targetEl !== mapContainerEl) {
            if (L.DomUtil.hasClass(targetEl, 'leaflet-marker-selectable')) {
                return false;
            }
            targetEl = targetEl.parentNode;
        }
        return true;
    }
}

Feature.include({options: Feature.defaults});
