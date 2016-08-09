import L from 'leaflet';

// @section Marker options
L.Marker.mergeOptions({
    // @option selectable: Boolean = true
    // Whether the marker can be rotated using mouse/touch events or not.
    rotatable: false,
});

L.Handler.RotateMarker = L.Handler.extend({
    initialize(marker) {
        this._marker = marker;
    },

    addHooks() {
        this._marker.on({
            add:    this._onAdd,
            remove: this._onRemove
        }, this);
        if (this._marker._map) {
            this._onAdd();
        }
    },

    removeHooks() {
        this._marker.off({
            add:    this._onAdd,
            remove: this._onRemove
        }, this);
        if (this._marker._map) {
            this._onRemove();
        }
    },

    _onAdd() {
        if (this._marker._map) {
            this._marker._map.on({
                mousedown: this._onMapMouseDown,
                mouseup:   this._onMapMouseUp,
            }, this);
        }
    },

    _onRemove() {
        if (this._marker._map) {
            this._marker._map.off({
                mousedown:  this._onMapMouseDown,
                mouseup:    this._onMapMouseUp,
                mousemove:  this._onMapMouseMove,
            }, this);
        }
    },

    _onMapMouseDown(event) {
        var map = event.target, marker = this._marker, mPoint = map.latLngToContainerPoint(marker.getLatLng()),
            cPoint = event.containerPoint, angle = Math.atan2(cPoint.x - mPoint.x, mPoint.y - cPoint.y);
        angle = angle / Math.PI * 180;

        this._startAngle = marker.options.angle;
        if (map.dragging.enabled()) {
            this._reenableMapDragging = true;
            map.dragging.disable();
        }
        map.on('mousemove', this._onMapMouseMove, this);
        L.DomUtil.addClass(map.getContainer(), 'leaflet-crosshair');

        marker.options.angle = angle;
        marker.update();
        marker.fireEvent('rotatestart', {angle: angle, startAngle: this._startAngle});
    },

    _onMapMouseUp(event) {
        var map = event.target, marker = this._marker, angle = marker.options.angle;

        delete this._startAngle;
        if (this._reenableMapDragging) {
            delete this._reenableMapDragging;
            map.dragging.enable();
        }
        map.off('mousemove', this._onMapMouseMove, this);
        L.DomUtil.removeClass(map.getContainer(), 'leaflet-crosshair');

        marker.fireEvent('rotateend', {angle: angle, startAngle: this._startAngle});
    },

    _onMapMouseMove(event) {
        var map = event.target, marker = this._marker, mPoint = map.latLngToContainerPoint(marker.getLatLng()),
            cPoint = event.containerPoint, angle = Math.atan2(cPoint.x - mPoint.x, mPoint.y - cPoint.y);
        angle = angle / Math.PI * 180;

        marker.options.angle = angle;
        marker.update();
        marker.fireEvent('rotate', {angle: angle, startAngle: this._startAngle});
    }
});

// Add init hook for MarkerSelect handler
L.Marker.addInitHook(function() {
    if (L.Handler.RotateMarker) {
        this.rotating = new L.Handler.RotateMarker(this);

        if (this.options.rotatable) {
            this.rotating.enable();
        }
    }
});


function setPos(pos) {
    setPos.base.call(this, pos);

    if (this.options.angle) {
        const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');
        let isNestedIcon = this._icon.hasChildNodes(), rotatableElement = this._icon;

        if (isNestedIcon) {
            rotatableElement = this._icon.getElementsByClassName('leaflet-rotatable')[0] || rotatableElement;
        }
        if (oldIE || isNestedIcon) {
            rotatableElement.style[L.DomUtil.TRANSFORM] = `rotate(${ this.options.angle }deg)`;
        } else {
            // Use 3D accelerated version for the modern browsers
            rotatableElement.style[L.DomUtil.TRANSFORM] += ` rotate(${ this.options.angle }deg)`;
        }
    }
}

setPos.base = L.Marker.prototype._setPos;
L.Marker.prototype._setPos = setPos;
