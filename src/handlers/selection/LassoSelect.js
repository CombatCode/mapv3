import L from 'leaflet';


L.Map.LassoSelect = class LassoSelect extends L.Handler {

    addHooks() {
        this._map.on({
            'mousedown': this._onStartEvent,
        }, this);
    }

    removeHooks() {
        // todo: disable() called in the middle of drawing?
        this._map.off({
            'mousedown': this._onStartEvent,
            'mousemove': this._onNextEvent,
            'mouseup': this._onEndEvent
        }, this);
    }

    start(latLng) {
        this._polygon = new L.Polygon([latLng]);

        this._polygon.addTo(this._map);

        this._map.on({
            'mousemove': this._onNextEvent,
            'mouseup': this._onEndEvent
        }, this);

        // Leaflet using lowercase name for 'latlng'?
        this._map.fire('lassoselectstart', {latLngs: this._polygon.getLatLngs()});
    }

    end(latLng = undefined) {
        const latLngs = this._polygon.getLatLngs().slice(-1)[0], lastLatLng = latLngs.slice(-1)[0];
        if (latLng) {
            this._polygon.addLatLng(latLng);
        }

        this.select();
        this._map.fire('lassoselectend', {latLngs: this._polygon.getLatLngs()});
        this._polygon.remove();
    }

    addPoint(latLng) {
        this._polygon.addLatLng(latLng);
    }

    select() {
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
     * @param {MouseEvent} event
     * @private
     */
    _onStartEvent(event) {
        if (!(this._map.options.lassoSelectStartCondition || LassoSelect.defaultStartCondition)(event)) {
            return;
        }
        L.DomUtil.disableTextSelection();
        L.DomUtil.disableImageDrag();
        if (!event.originalEvent.shiftKey && this._map.dragging.enabled()) {
            this._reenableMapDragging = true;
            this._map.dragging.disable();
        }
        this.start(event.latlng);
    }

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onNextEvent(event) {
        this.addPoint(event.latlng);
    }

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onEndEvent(event) {
        L.DomUtil.enableTextSelection();
        L.DomUtil.enableImageDrag();
        if (this._reenableMapDragging) {
            delete this._reenableMapDragging;
            this._map.dragging.enable();
        }
        this.end(event.latlng);
    }

    static defaultStartCondition(event) {
        return event.originalEvent.ctrlKey;
    }
};

L.Map.addInitHook('addHandler', 'lassoSelect', L.Map.LassoSelect);

