import L from 'leaflet';

L.Map.ClickDeselect = class ClickDeselect extends L.Handler {
    addHooks() {
        this._map.on({
            'click':     this._onClick,
            'mousedown': this._onMouseDown
        }, this);
    }

    removeHooks() {
        this._map.off({
            'click':     this._onClick,
            'mousedown': this._onMouseDown
        }, this);
    }

    _onClick(event) {
        const map = event.target,
              clickDist = this._mdContainerPoint? this._mdContainerPoint.distanceTo(event.containerPoint) : 0;

        if (clickDist <= L.Map.ClickDeselect.maxDistance) {
            map.eachLayer(layer => {
                if (layer.selecting && layer.selecting.enabled()) {
                    layer.selecting.deselect();
                }
            }, this)
        }
    }

    _onMouseDown(event) {
        this._mdContainerPoint = event.containerPoint;
    }
}

L.Map.ClickDeselect.maxDistance = 10; // px

L.Map.mergeOptions({
    clickDeselect: true
});

L.Map.addInitHook('addHandler', 'clickDeselect', L.Map.ClickDeselect);
