import L from 'leaflet';


/**
 * Adds 'dragenter", "dragover", "dragleave" and "drop" events to L.Map
 * Can be enbled/disabled like all handlers.
 * @class L.Map.Drop
 * @extends L.Handler
 */
L.Map.Drop = class Drop extends L.Handler {
    addHooks() {
        L.DomEvent.on(this._map.getContainer(), {
            'dragenter': this._map._handleDOMEvent,
            'dragover':  this._onDragOver,
            'dragleave': this._map._handleDOMEvent,
            'drop':      this._map._handleDOMEvent
        }, this._map);
    }

    removeHooks() {
        L.DomEvent.off(this._map.getContainer(), {
            'dragenter': this._map._handleDOMEvent,
            'dragover':  this._onDragOver,
            'dragleave': this._map._handleDOMEvent,
            'drop':      this._map._handleDOMEvent
        }, this._map);
    }

    _onDragOver(event) {
        event.preventDefault();
        this._handleDOMEvent(event);
    }
};

L.Map.addInitHook('addHandler', 'dropping', L.Map.Drop);


// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
    // @type {boolean}
    dropping: true
});
