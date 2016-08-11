import L from 'leaflet';


/**
 * Handler providing rotation for L.Marker instance. Disabled by default.
 * @class L.Handler.MarkerRotate
 * @extends L.Handler
 */
L.Handler.MarkerRotate = class MarkerRotate extends L.Handler {
    initialize(marker) {
        this._marker = marker;
    }

    addHooks() {
        this._marker.on({
            'add': this._onAdd,
            'remove': this._onRemove
        }, this);
        if (this._marker._map) {
            this._onAdd();
        }
    }

    removeHooks() {
        this._marker.off({
            'add': this._onAdd,
            'remove': this._onRemove
        }, this);
        if (this._marker._map) {
            this._onRemove();
        }
    }

    _onAdd() {
        if (this._marker._map) {
            this._marker._map.on({
                'mousedown': this._onMapMouseDown,
                'mouseup': this._onMapMouseUp
            }, this);
        }
    }

    _onRemove() {
        if (this._marker._map) {
            this._marker._map.off({
                'mousedown': this._onMapMouseDown,
                'mouseup': this._onMapMouseUp,
                'mousemove': this._onMapMouseMove
            }, this);
        }
    }

    _onMapMouseDown(event) {
        const map = event.target, marker = this._marker;
        if (marker.options.rotateCondition && !marker.options.rotateCondition(event)) {
            return;
        }

        this._rotating = true;
        this._startAngle = marker.options.angle;
        if (map.dragging.enabled()) {
            this._reenableMapDragging = true;
            map.dragging.disable();
        }
        map.on('mousemove', this._onMapMouseMove, this);
        L.DomUtil.addClass(map.getContainer(), 'leaflet-crosshair');

        this._onMapMouseMove(event, true);
        marker.fireEvent('rotatestart', {angle: marker.options.angle, startAngle: this._startAngle});
    }

    _onMapMouseUp(event) {
        if (!this._rotating) {return;}
        const map = event.target, marker = this._marker;

        delete this._rotating;
        delete this._startAngle;
        if (this._reenableMapDragging) {
            delete this._reenableMapDragging;
            map.dragging.enable();
        }
        map.off('mousemove', this._onMapMouseMove, this);
        L.DomUtil.removeClass(map.getContainer(), 'leaflet-crosshair');

        this._onMapMouseMove(event, true);
        marker.fireEvent('rotateend', {angle: marker.options.angle, startAngle: this._startAngle});
    }

    _onMapMouseMove(event, skipFire) {
        const map = event.target, marker = this._marker;
        const mPoint = map.latLngToContainerPoint(marker.getLatLng()), cPoint = event.containerPoint;
        let angle = Math.atan2(cPoint.x - mPoint.x, mPoint.y - cPoint.y);
        angle = angle / Math.PI * 180; // Rad --> Degrees

        marker.options.angle = angle;
        marker.update();
        skipFire || marker.fireEvent('rotate', {angle: angle, startAngle: this._startAngle});
    }
};

// @namespace L.Marker
// @section Options
L.Marker.mergeOptions({
    // Whether the marker can be rotated using mouse/touch events or not.
    // @type {boolean}
    rotatable: false,
    // Condition to start rotation
    // @type {Function(Event):boolean=}
    rotateCondition: undefined
});


// Add init hook for MarkerSelect handler
L.Marker.addInitHook(function() {
    if (L.Handler.MarkerRotate) {
        this.rotating = new L.Handler.MarkerRotate(this);

        if (this.options.rotatable) {
            this.rotating.enable();
        }
    }
});

// Overwrites L.Marker _setPos method.
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
