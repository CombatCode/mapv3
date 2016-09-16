import L from 'leaflet';


/**
 * A one button control to activate rotate handler on selected Markers
 * @extends L.Control
 * @module components/Control/Control.Rotate
 */
export default class Loader extends L.Control {

    static defaults = Object.assign(Object.create(L.Control.prototype.options), {
        position: 'topleft',
        // CSS class name for control
        // @type {string}
        className: 'leaflet-ui-loader',
        // Don't show loading indicator for requests below ms
        // @type {number}
        delay: 500,
        // Dimmer block access to other controls?
        // @type {boolean}
        blockUi: true
    })

    /**
     * Auto. called when L.Control is added to L.Map
     * @param {L.Map} map
     * @returns {Element} Control's DOM element
     */
    onAdd(map) {
        this.dimmer = L.DomUtil.create('div',  this.options.className);
        //L.DomUtil.create('div', 'ui loader', this.dimmer);
        setTimeout(() => {
            const target = this.dimmer.parentNode.parentNode;
            target.insertBefore(this.dimmer, this.options.blockUi ? null : target.firstChild);
        }, 0);

        map.on({
            'loading': this._onLoading,
            'loaded': this._onLoaded
        }, this);

        return this.dimmer;
    }

    /**
     * Auto. called when L.Control is removed from Map
     * @param {L.Map} map
     */
    onRemove(map) {
        this.hide();
        map.off({
            'loading': this._onLoading,
            'loaded': this._onLoaded
        }, this);
    }

    show(delay = 0) {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            delete this._timeoutId;
        }
        if (delay > 0) {
            this._timeoutId = setTimeout(() => this.show(0), delay)
        } else {
            L.DomUtil.addClass(this.dimmer, 'active');
        }
    }

    hide() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            delete this._timeoutId;
        }
        L.DomUtil.removeClass(this.dimmer, 'active');
    }

    _onLoading(event) {
        this.show(this.options.delay);
    }

    _onLoaded(event) {
        this.hide();
    }
}

Loader.include({options: Loader.defaults});
