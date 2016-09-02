import L from 'leaflet';


/**
 * L.Handler.BoxSelect is used to add ctrl-drag select interaction to the map
 * (select markers/paths to a selected bounding box), enabled by default.
 * @class L.Map.BoxSelect
 * @extends L.Map.BoxZoom
 */
L.Map.BoxSelect = class BoxSelect extends L.Handler {

    addHooks() {
        this._map.on('mousedown', this._onMouseDown, this);
    }

    removeHooks() {
        this.abort();
        this._map.off('mousedown', this._onMouseDown, this);
    }

    start(point) {
        this._addSelectionHooks();
        this._moved = false;
        this._startPoint = point;
        this._bounds = new L.Bounds(point, point);
    }

    next(point) {
        this._bounds = new L.Bounds(point, this._startPoint);

        if (!this._moved) {
            this._moved = true;

            this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._map.getContainer());
            L.DomUtil.addClass(this._map.getContainer(), 'leaflet-crosshair');

            this._map.fire('boxselectstart', {bounds: this._bounds})
        }
        const size = this._bounds.getSize();
        L.DomUtil.setPosition(this._box, this._bounds.min);
        this._box.style.width  = size.x + 'px';
        this._box.style.height = size.y + 'px';
    }

    end(point = undefined) {
        if (point) {
            this.next(point);
        }
        this._removeSelectionHooks();
        if (this._moved) {
            this._moved = false;

            L.DomUtil.remove(this._box);
            L.DomUtil.removeClass(this._map.getContainer(), 'leaflet-crosshair');

            const latLngBounds = new L.LatLngBounds(
                this._map.containerPointToLatLng(this._bounds.min),
                this._map.containerPointToLatLng(this._bounds.max));

            this._select(latLngBounds);
            this._map.fire('boxselectend', {bounds: this._bounds});
        }
    }

    abort() {
        this._removeSelectionHooks();
        if (this._moved) {
            this._moved = false;

            L.DomUtil.remove(this._box);
            L.DomUtil.removeClass(this._map.getContainer(), 'leaflet-crosshair');

            this._map.fire('boxselectabort', {bounds: this._bounds});
        }
    }

    /**
     * @param {L.LatLngBounds} bounds
     * @private
     */
    _select(bounds) {
        this._map.eachLayer(function(layer) {
            if (layer.selecting && layer.selecting.enabled()) {
                if (BoxSelect.layerInBounds(layer, bounds)) {
                    layer.selecting.select();
                }
            }
        }, this);
    }

    _addSelectionHooks() {
        L.DomUtil.disableTextSelection();
        L.DomUtil.disableImageDrag();
        if (this._map.dragging.enabled()) {
            this._reenableMapDragging = true;
            this._map.dragging.disable();
        }
        L.DomEvent.on(document, {
            contextmenu: L.DomEvent.stop,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
        }, this);
    }

    _removeSelectionHooks() {
        L.DomUtil.enableTextSelection();
        L.DomUtil.enableImageDrag();
        if (this._reenableMapDragging) {
            delete this._reenableMapDragging;
            this._map.dragging.enable();
        }
        L.DomEvent.off(document, {
            contextmenu: L.DomEvent.stop,
            mousemove:   this._onMouseMove,
            mouseup:     this._onMouseUp,
            keydown:     this._onKeyDown
        }, this);
    }

    /**
     * @param {MouseEvent} event Leaflet-wrapped DOM event
     * @private
     */
    _onMouseDown(event) {
        if (this._map.options.boxSelectStartCondition(event)) {
            this.start(event.containerPoint);
        }
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseMove(event) {
        event = BoxSelect._toMapEvent(event, this._map);
        this.next(event.containerPoint);
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseUp(event) {
        event = BoxSelect._toMapEvent(event, this._map);
        if (this._map.options.boxSelectEndCondition(event)) {
            this.end(event.containerPoint);
        }
    }

    /**
     * @param {KeyboardEvent} event DOM event
     * @private
     */
    _onKeyDown(event) {
        event = BoxSelect._toMapEvent(event, this._map);
        if (this._map.options.boxSelectAbortCondition(event)) {
            this.abort();
        }
    }

    /**
     * @param {L.Layer} layer
     * @param {L.LatLngBounds} bounds
     * @returns {boolean}
     */
    static layerInBounds(layer, bounds) {
        if (layer.getBounds) {
            return layer.getBounds().isValid() && bounds.intersects(layer.getBounds());
        } else if (layer.getLatLng) {
            return bounds.contains(layer.getLatLng());
        }
        return false;
    }

    /**
     * @param {MouseEvent|KeyboardEvent} event DOM Event
     * @returns {MouseEvent|KeyboardEvent} Leaflet wrapped Event
     * @private
     */
    static _toMapEvent(event, map) {
        return Object.assign({
            type: event.type,
            target: map,
            originalEvent: event
        }, event instanceof MouseEvent ? {
            latlng: map.mouseEventToLatLng(event),
            containerPoint: map.mouseEventToContainerPoint(event),
            layerPoint: map.mouseEventToLayerPoint(event),
        } : null);
    }

    /**
     * @param {Event} e
     * @returns {boolean}
     */
    static defaultStartCondition(e) {
        return e.originalEvent.ctrlKey && ((e.originalEvent.which === 1) || (e.originalEvent.button === 1));
    }

    /**
     * @param {Event} e
     * @returns {boolean}
     */
    static defaultEndCondition(e) {
        return (e.originalEvent.which === 1) || (e.originalEvent.button === 1);
    }

    /**
     * @param {Event} e
     * @returns {boolean}
     */
    static defaultAbortCondition(e) {
        return e.originalEvent.keyCode === 27;
    }
};

L.Map.addInitHook('addHandler', 'boxSelect', L.Map.BoxSelect);

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
    // Whether markers/paths on map can be selected using a rectangular box.
    // @type {boolean}
    boxSelect: true,
    // Selection start condition. Checked on "mousedown" events. Defaults to primary button + ctrl key.
    // @type {function(L.MouseEvent):boolean}
    boxSelectStartCondition: L.Map.BoxSelect.defaultStartCondition,
    // Selection start condition. Checked on "mouseup" events. Defaults to primary button
    // @type {function(L.MouseEvent):boolean}
    boxSelectEndCondition: L.Map.BoxSelect.defaultEndCondition,
    // Selection abort condition. Checked on "keydown" events. Defaults to ESC key.
    // @type {function(L.MouseEvent):boolean}
    boxSelectAbortCondition: L.Map.BoxSelect.defaultAbortCondition
});
