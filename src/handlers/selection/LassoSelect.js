import L from 'leaflet';


L.Map.LassoSelect = class LassoSelect extends L.Handler {

    addHooks() {
        this._map.on('mousedown', this._onMouseDown, this);
    }

    removeHooks() {
        this._map.off('mousedown', this._onMouseDown, this);
        this.abort();
    }

    start(latLng) {
        this._polygon = new L.Polygon([latLng]);
        this._polygon.addTo(this._map);
        this._setupEvents();
        this._map.fire('lassoselectstart', {latLng: latLng});
    }

    end(latLng = undefined) {
        if (latLng) {
            this._polygon.addLatLng(latLng);
        }
        this._polygon.remove();
        this._setupEvents(true);
        this._select();
        this._map.fire('lassoselectend', {latLngs: this._polygon.getLatLngs()});
    }

    abort() {
        this._polygon.remove();
        this._setupEvents(true);
        this._map.fire('lassoselectabort', {latLngs: this._polygon.getLatLngs()});
    }

    next(latLng) {
        this._polygon.addLatLng(latLng);
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

    _setupEvents(restoreState = false) {
        if (!restoreState) {
            L.DomUtil.enableTextSelection();
            L.DomUtil.enableImageDrag();
            if (this._reenableMapDragging) {
                delete this._reenableMapDragging;
                this._map.dragging.enable();
            }
            L.DomEvent.off(document, {
                contextmenu: L.DomEvent.stop,
                mousemove: this._onMouseMove,
                mouseup: this._onMouseUp,
                keydown: this._onKeyDown
            }, this);
        } else {
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
    }

    static layerInBounds(layer, bounds) {
        if (layer.getBounds) {
            return layer.getBounds().isValid() && bounds.intersects(layer.getBounds());
        } else if (layer.getLatLng) {
            return bounds.contains(layer.getLatLng());
        }
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
     * @param {MouseEvent} event Leaflet wrapped event
     * @private
     */
    _onMouseDown(event) {
        if (!(this._map.options.lassoSelectStartCondition || LassoSelect.defaultStartCondition)(event)) {
            return;
        }

        this.start(event.latlng);
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseMove(event) {
        this.next(this._map.mouseEventToLatLng(event));
    }

    /**
     * @param {MouseEvent} event DOM event
     * @private
     */
    _onMouseUp(event) {
        L.DomUtil.enableTextSelection();
        L.DomUtil.enableImageDrag();
        if (this._reenableMapDragging) {
            delete this._reenableMapDragging;
            this._map.dragging.enable();
        }
        L.DomEvent.off(document, {
            contextmenu: L.DomEvent.stop,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
        }, this);

        const latlng =  this._map.mouseEventToLatLng(event);
        this.end(latlng);
    }

    /**
     * @param {KeyboardEvent} event DOM event
     * @private
     */
    _onKeyDown(event) {
        event = {type: event.type, target: this._map, originalEvent: event}; //wrap in Leaflet-like event
        if (!(this._map.options.lassoSelectAbortCondition || LassoSelect.defaultAbortCondition)(event)) {
            this.abort();
        }
    }

    static defaultStartCondition(event) {
        return event.originalEvent.ctrlKey;
    }

    static defaultAbortCondition(event) {
        return event.originalEvent.keyCode === 27;
    }
};

L.Map.addInitHook('addHandler', 'lassoSelect', L.Map.LassoSelect);

