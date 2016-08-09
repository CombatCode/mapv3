import L from 'leaflet';


/*
 * A one button control to activate rotate handler on selected Markers
 * @class L.Control.Rotate
 * @extends L.Control
 */
L.Control.Rotate = class Rotate extends L.Control {

    // initialize(options) {
    //     super.initialize(options);
    //     this._layers = {}
    // }

	onAdd(map) {
		let className = 'leaflet-control-rotate',
		    container = L.DomUtil.create('div', className + ' leaflet-bar'),
		    options = this.options;

		this._button = this._createButton(options.text, options.title, className + '-btn',  container, this._onPress);

		//this._updateDisabled();

        if (this._active) {
            this._active = false;
            this.activate();
        }
		return container;
	}

	onRemove(map) {
        this.deactivate();
	}

    activate() {
        if (!this._active) {
            this._active = true;
            L.DomUtil.addClass(this._button, 'active');

            if (this._map) {
                this._map.on({
                    layeradd:      this._onLayerAddOrSelect,
                    layerremove:   this._onLayerRemoveOrDeselect,
                    layerselect:   this._onLayerAddOrSelect,
                    layerdeselect: this._onLayerRemoveOrDeselect
                }, this);
                this._map.eachLayer(layer => {
                    if (layer.options.selected && this.options.filter(layer)) {
                        this.addLayer(layer);
                    }
                }, this);
            }
        }
    }

    deactivate() {
        if (this._active) {
            this._active = false;
            L.DomUtil.removeClass(this._button, 'active');

            if (this._map) {
                this._map.off({
                    layeradd:      this._onLayerAddOrSelect,
                    layerremove:   this._onLayerRemoveOrDeselect,
                    layerselect:   this._onLayerAddOrSelect,
                    layerdeselect: this._onLayerRemoveOrDeselect
                }, this);
                this._map.eachLayer(layer => {
                    if (layer.options.selected && this.options.filter(layer)) {
                        this.removeLayer(layer);
                    }
                }, this);
            }
        }
    }

    addLayer(layer) {
        if (this._active && layer.rotating && !layer.rotating.enabled()) {
            layer.rotating.enable();
        }
    }

    removeLayer(layer) {
        if (layer.rotating && layer.rotating.enabled()) {
            layer.rotating.disable();
        }
    }

    _onPress(event) {
        this._active? this.deactivate() : this.activate();
    }

    _onLayerAddOrSelect(event) {
        if (event.layer.options.selected && this.options.filter(event.layer)) {
            this.addLayer(event.layer)
        }
    }

    _onLayerRemoveOrDeselect(event) {
        if (this.options.filter(event.layer)) {
            this.removeLayer(event.layer)
        }
    }

	// disable() {
	// 	this._disabled = true;
	// 	this._updateDisabled();
	// 	return this;
	// }
    //
	// enable() {
	// 	this._disabled = false;
	// 	this._updateDisabled();
	// 	return this;
	// }

	_createButton(html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent
		    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
		    .on(link, 'click', L.DomEvent.stop)
		    .on(link, 'click', fn, this)
		    .on(link, 'click', this._refocusOnMap, this);

		return link;
	}

	_updateDisabled() {
		var map = this._map, className = 'leaflet-disabled';
        //
		// L.DomUtil.removeClass(this._button, className);
        //
		// if (this._disabled || map._zoom === map.getMinZoom()) {
		// 	L.DomUtil.addClass(this._zoomOutButton, className);
		// }
		// if (this._disabled || map._zoom === map.getMaxZoom()) {
		// 	L.DomUtil.addClass(this._zoomInButton, className);
		// }
	}
};


// @namespace Control.Rotate
// @section Options
L.Control.Rotate.mergeOptions({
    position: 'topleft',
    // @option text: String = 'R'
    // The text set on the button.
    text: 'R',
    // @option title: String = 'Rotate'
    // The default title attribute of the button.
    title: 'Rotate',
    // @option filter: Function
    // Layer filter function.
    filter: function(layer) {
        return layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)
    }
});


// @namespace Map
// @section Control options
L.Map.mergeOptions({
    // @option rotateControl: Boolean = true
    // Whether a rotate control is added to the map by default.
    rotateControl: true
});

L.Map.addInitHook(function () {
	if (this.options.rotateControl) {
		this.rotateControl = new L.Control.Rotate();
		this.addControl(this.rotateControl);
	}
});


/**
 * Do we actually need this factory? Is it some Leaflet legacy thingy?
 * @namespace Control.Rotate
 * @factory L.control.rotate(options: Control.Rotate options)
 */
L.control.rotate = function (options) {
	return new L.Control.Rotate(options);
};
