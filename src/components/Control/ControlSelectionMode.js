import L from 'leaflet';


/**
 * A one button control to activate rotate handler on selected Markers
 * @extends L.Control
 * @module components/Control/Control.Rotate
 */
export default class ControlSelectionMode extends L.Control {

    static defaults = Object.assign(Object.create(L.Control.prototype.options), {
        position: 'topleft',
        // The text/content of the "box" selection button.
        // @type {string|Node}
        contentBox: 'B',
        // The text/content of the "lasso" selection button.
        // @type {string|Node}
        contentLasso: 'L',
        // The default title attribute of the "box" selection button.
        // @type {string}
        titleBox: 'Select "box" selection mode',
        // The default title attribute of the "lasso" selection button.
        // @type {string}
        titleLasso: 'Select "lasso" selection mode',
        // CSS class name for control
        // @type {string}
        className: 'leaflet-control-selection',
        // Activating one selection mode deactivates other
        // @type {boolean}
        exclusive: true,
        // Selection mode cannot be deactivated.
        // @type {boolean}
        requied: true
    })

    /**
     * Auto. called when L.Control is added to L.Map
     * @param {L.Map} map
     * @returns {Element} Control's DOM element
     */
    onAdd(map) {
        const container = L.DomUtil.create('div', `${this.options.className} leaflet-bar`);

        this._boxButton = this._createButton(`${this.options.className}-btn`,
            {title: this.options.titleBox}, this._onBoxButtonPress, this.options.contentBox, container);

        this._lassoButton = this._createButton(`${this.options.className}-btn`,
            {title: this.options.titleLasso}, this._onLassoButtonPress, this.options.contentLasso, container);

        L.DomEvent.on(container, 'mouseup mousedown click dblclick', L.DomEvent.stopPropagation);

        //synchronizes button states
        this._onBoxStateChanged();
        this._onLassoStateChanged();

        return container;
    }

    /**
     * Auto. called when L.Control is removed from Map
     * @param {L.Map} map
     */
    onRemove(map) {
        //synchronizes button states
        this._onBoxStateChanged();
        this._onLassoStateChanged();
    }

    activateBox() {
        this._map.boxSelect.enable();
        this._onBoxStateChanged();
        if (this.options.exclusive) {
            this.deactivateLasso();
        }
    }

    deactivateBox() {
        if (this.options.requied && !this.isLassoActive()) {
            return;
        }
        this._map.boxSelect.disable();
        this._onBoxStateChanged();
    }

    isBoxActive() {
        return this._map.boxSelect.enabled();
    }

    _onBoxStateChanged() {
        (this.isBoxActive() ? L.DomUtil.addClass : L.DomUtil.removeClass)(this._boxButton, 'active');
    }

    /** @param {Event} event */
    _onBoxButtonPress(event) {
        this.isBoxActive() ? this.deactivateBox() : this.activateBox();
    }

    activateLasso() {
        this._map.lassoSelect.enable();
        this._onLassoStateChanged();
        if (this.options.exclusive) {
            this.deactivateBox();
        }
    }

    deactivateLasso() {
        if (this.options.requied && !this.isBoxActive()) {
            return;
        }
        this._map.lassoSelect.disable();
        this._onLassoStateChanged();
    }

    isLassoActive() {
        return this._map.lassoSelect.enabled();
    }

    _onLassoStateChanged() {
        (this.isLassoActive() ? L.DomUtil.addClass : L.DomUtil.removeClass)(this._lassoButton, 'active');
    }

    /** @param {Event} event */
    _onLassoButtonPress(event) {
        this.isLassoActive() ? this.deactivateLasso() : this.activateLasso();
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

ControlSelectionMode.include({options: ControlSelectionMode.defaults});
