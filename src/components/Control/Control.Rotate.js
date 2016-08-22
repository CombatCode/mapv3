import L from 'leaflet';


/**
 * A one button control to activate rotate handler on selected Markers
 * @extends L.Control
 */
export default class ControlRotate extends L.Control {
    /**
     * Auto. called when L.Control is added to L.Map
     * @param {L.Map} map
     * @returns {Element} Control's DOM element
     */
    onAdd(map) {
        let container = L.DomUtil.create('div', `${ControlRotate.className} leaflet-bar`);

        this._button = this._createButton(`${ControlRotate.className}-btn`, {title: this.options.title}, this._onPress,
            this.options.content, container);

        L.DomEvent.on(container, 'mouseup mousedown click dblclick', L.DomEvent.stopPropagation);

        if (this._active) {
            this._active = false;
            this.activate();
        }
        return container;
    }

    /**
     * Auto. called when L.Control is removed from Map
     * @param {L.Map} map
     */
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
                this._map.eachLayer((layer) => {
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

    /** @param {L.Layer} layer */
    addLayer(layer) {
        if (this._active && layer.rotating && !layer.rotating.enabled()) {
            layer.rotating.enable();
        }
    }

    /** @param {L.Layer} layer */
    removeLayer(layer) {
        if (layer.rotating && layer.rotating.enabled()) {
            layer.rotating.disable();
        }
    }

    /** @param {Event} event */
    _onPress(event) {
        this._active? this.deactivate() : this.activate();
    }

    /** @param {Event} event */
    _onLayerAddOrSelect(event) {
        if (event.layer.options.selected && this.options.filter(event.layer)) {
            this.addLayer(event.layer)
        }
    }

    /** @param {Event} event */
    _onLayerRemoveOrDeselect(event) {
        if (this.options.filter(event.layer)) {
            this.removeLayer(event.layer)
        }
    }

    /**
     * @param {string} className
     * @param {Object} [attributes]
     * @param {Function} handler
     * @param {string|Node} [content]
     * @param {Element} [container]
     * @returns {Element}
     * @private
     */
    _createButton(className, attributes, handler, content, container) {
        let link = L.DomUtil.create('a', className, container);
        link.href = '#';
        if (typeof attributes === 'object') {
            for (let name in attributes) {
                link.setAttribute(name, attributes[name]);
            }
        }

        if (content instanceof Node) {
            link.appendChild(content);
        } else if (typeof content === 'string') {
            content.trimLeft().charAt(0) === '<'? (link.innerHTML = content) : (link.textContent = content);
        }

        L.DomEvent
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, 'click', handler, this)
            .on(link, 'click', this._refocusOnMap, this);
        return link;
    }
};


ControlRotate.className = 'leaflet-control-rotate';


ControlRotate.mergeOptions({
    position: 'topleft',
    // The text/content of the button.
    // @type {string|Node}
    content: 'R',
    // The default title attribute of the button.
    // @type {string}
    title: 'Rotate',
    // Layers filter function.
    // @type {function(L.layer):boolean}
    filter: function(layer) {
        return layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)
    }
});
