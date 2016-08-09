import L from 'leaflet';


/**
 * L.Handler.BoxSelect is used to add ctrl-drag select interaction to the map
 * (select markers/paths to a selected bounding box), enabled by default.
 * @class L.Map.BoxSelect
 * @extends L.Map.BoxZoom
 */
L.Map.BoxSelect = class BoxSelect extends L.Map.BoxZoom {
    _doSelection(bounds) {
        this._map.eachLayer(function(layer) {
            if (layer.selecting && layer.selecting.enabled()) {
                if (layer instanceof L.Marker) {
                    if (bounds.contains(layer.getLatLng())) {
                        layer.selecting.select();
                    }
                } else if (layer instanceof L.Polyline) {
                    if (layer.getLatLngs().some(bounds.contains, bounds)) {
                        layer.selecting.select();
                    }
                } else if (layer instanceof L.Circle) {
                    // todo
                }
            }
        }, this);
    }

    _preventMapDrag(e) {
        if (this._map.dragging.enabled()) {
            this._map.dragging._draggable.disable();
            this._map.dragging._draggable.enable();
            //this._map.dragging.disable();
            //this._map.dragging.enable();
        }
    }

    _onMouseDown(e) {
        /** BoxSelect: key changed to CTRL **/
        if (!e.ctrlKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

        this._preventMapDrag(e);
        this._resetState(); /** BoxSelect: line added **/

        L.DomUtil.disableTextSelection();
        L.DomUtil.disableImageDrag();

        this._startPoint = this._map.mouseEventToContainerPoint(e);

        L.DomEvent.on(document, {
            contextmenu: L.DomEvent.stop,
            mousemove:   this._onMouseMove,
            mouseup:     this._onMouseUp,
            keydown:     this._onKeyDown
        }, this);
    }

    _onMouseMove(e) {
        if (!this._moved) {
            this._moved = true;

            this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);
            L.DomUtil.addClass(this._container, 'leaflet-crosshair');

            this._map.fire('boxselectstart'); /** BoxSelect: event name changed **/
        }

        this._point = this._map.mouseEventToContainerPoint(e);

        let bounds = new L.Bounds(this._point, this._startPoint),
            size = bounds.getSize();

        L.DomUtil.setPosition(this._box, bounds.min);

        this._box.style.width  = size.x + 'px';
        this._box.style.height = size.y + 'px';
    }

    _onMouseUp(e) {
        if ((e.which !== 1) && (e.button !== 1)) { return; }

        this._finish();

        if (!this._moved) { return; }
        // Postpone to next JS tick so internal click event handling
        // still see it as "moved".
        setTimeout(L.bind(this._resetState, this), 0);

        let bounds = new L.LatLngBounds(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point));

        /** BoxSelect: changed **/
        this._map.fire('boxselectend', {bounds: bounds});
        this._doSelection(bounds);
    }
};

L.Map.addInitHook('addHandler', 'boxSelect', L.Map.BoxSelect);

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
    // @option boxSelect: Boolean = true
    // Whether markers/paths on map can be selected using a rectangular area specified by
    // dragging the mouse while pressing the ctrl key.
    boxSelect: true
});
