import L from 'leaflet';


L.Map.LassoSelect = class LassoSelect extends L.Handler {

    addHooks() {
        this._polygon = new L.Polygon([]);
        this._map.on('mousedown', this._onMouseDown, this);
    }

    removeHooks() {
        this._map.off('mousedown', this._onMouseDown, this);
        this.abort();
    }

    start(latLng) {
        this._addSelectionHooks();
        this._polygon = new L.Polygon([latLng]);
        this._polygon.addTo(this._map);
        this._map.fire('lassoselectstart', {latLngs: [latLng]});
    }

    next(latLng) {
        this._polygon.addLatLng(latLng);
    }

    end(latLng = undefined) {
        if (latLng) {
            this.next(latLng);
        }
        this._removeSelectionHooks();
        this._polygon.remove();
        this._select();
        this._map.fire('lassoselectend', {latLngs: this._polygon.getLatLngs()});
    }

    abort() {
        this._polygon.remove();
        this._removeSelectionHooks();
        this._map.fire('lassoselectabort', {latLngs: this._polygon.getLatLngs()});
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

    _select() {
        const bounds = this._polygon.getBounds();
        // pass as GeoJSON geometry so layerIntersectingPolygon doesn't need to call toGeoJSON() in a loop
        const polygon = this._polygon.toGeoJSON().geometry;

        this._map.eachLayer(layer => {
            if (layer.selecting && layer.selecting.enabled()) {
                if (LassoSelect.layerInBounds(layer, bounds)) {
                    if (LassoSelect.layerIntersectingPolygon(layer, polygon)) {
                        layer.selecting.select();
                    }
                }
            }
        });
    }

    /**
     * @param {MouseEvent} event Leaflet-wrapped DOM event
     * @private
     */
    _onMouseDown(event) {
        if (this._map.options.lassoSelectStartCondition(event)) {
            this.start(event.latlng);
        }
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseMove(event) {
        event = LassoSelect._toMapEvent(event, this._map);
        this.next(event.latlng);
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseUp(event) {
        event = LassoSelect._toMapEvent(event, this._map);
        if (this._map.options.lassoSelectEndCondition(event)) {
            this.end(event.latlng);
        }
    }

    /**
     * @param {KeyboardEvent} event DOM event
     * @private
     */
    _onKeyDown(event) {
        event = LassoSelect._toMapEvent(event, this._map);
        if (this._map.options.lassoSelectAbortCondition(event)) {
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
     * @param {L.Marker} marker Actually only L.Marker is supported right now
     * @param {L.Polygon} polygon L.Polygon
     * @returns {boolean}
     */
    static layerIntersectingPolygon(marker, polygon) {
        const gjGeom1 = marker.coordinates ? marker : marker.toGeoJSON().geometry;
        const gjGeom2 = polygon.coordinates ? polygon : polygon.toGeoJSON().geometry;
        if (gjGeom1.type === 'Point') {
            return LassoSelect.pointInPolygon(gjGeom1.coordinates, gjGeom2.coordinates);
        }
        return false; // else not supported right now..
    }

    /**
     * Supports flat Polygon or GeoJSON style (Multi)Polygon coordinates.
     * All coordinates in simple Array form.
     * @param {number[]} point
     * @param {number[][]|number[][][]|number[][][][]} coords
     * @returns {*}
     */
    static pointInPolygon = function pointInPolygon(point, coords) {
        const hasHoles = coords.length > 0 && coords[0].length > 0 && coords[0][0].length > 0;
        const isMulti = hasHoles && coords[0][0][0].length > 0;
        if (hasHoles) {
            if (isMulti) {
                // polygon = [[ring_coordinates], [hole_coordinates]]
                return coords.some(coords => pointInPolygon(point, coords));
            } else {
                // multiPolygon = [[polygon1], [polygon2], ..]
                return pointInPolygon(point, coords[0]) && (!coords[1] || pointInPolygon(point, coords[1]));
            }
        }

        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        let x = point[0], y = point[1], inside = false;

        for (let i = 0, j = coords.length - 1, xi, yi, xj, yj, intersect; i < coords.length; j = i++) {
            xi = coords[i][0];
            yi = coords[i][1];
            xj = coords[j][0];
            yj = coords[j][1];
            intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
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

L.Map.addInitHook('addHandler', 'lassoSelect', L.Map.LassoSelect);

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
    // Whether markers/paths on map can be selected using a free-drawn area.
    // @type {boolean}
    lassoSelect: false,
    // Selection start condition. Checked on "mousedown" events. Defaults to primary button + ctrl key.
    // @type {function(L.MouseEvent):boolean}
    lassoSelectStartCondition: L.Map.LassoSelect.defaultStartCondition,
    // Selection start condition. Checked on "mouseup" events. Defaults to primary button
    // @type {function(L.MouseEvent):boolean}
    lassoSelectEndCondition: L.Map.LassoSelect.defaultEndCondition,
    // Selection abort condition. Checked on "keydown" events. Defaults to ESC key.
    // @type {function(L.MouseEvent):boolean}
    lassoSelectAbortCondition: L.Map.LassoSelect.defaultAbortCondition
});
