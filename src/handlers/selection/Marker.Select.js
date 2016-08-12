import L from 'leaflet';


L.Handler.MarkerSelect = class MarkerSelect extends L.Handler {
    initialize(marker) {
        this._marker = marker;
    }

    addHooks() {
        this._marker.on('click', this._onClick, this);
        if (this._marker._icon) {
            L.DomUtil.addClass(this._icon, MarkerSelect.selectableClassName);
        }
    }

    removeHooks() {
        this._marker.off('click', this._onClick, this);
        if (this._marker._icon) {
            L.DomUtil.removeClass(this._icon, MarkerSelect.selectableClassName);
        }
    }

    selected() {
        return !!this._marker.options.selected;
    }

    select() {
        const marker = this._marker;
        if (!marker.options.selected) {
            marker.options.selected = true;
            this._setIconStyles(true);
            marker.fire('select');
            marker._map.fire('layerselect', {layer: marker});
            console.log('Marker ' + marker._leaflet_id + ' selected');
        }
    }

    deselect() {
        const marker = this._marker;
        if (marker.options.selected) {
            marker.options.selected = false;
            this._setIconStyles(false);
            marker.fire('deselect');
            marker._map.fire('layerdeselect', {layer: marker});
            console.log('Marker ' + marker._leaflet_id + ' deselected');
        }
    }

    _onClick() {
        console.log('click!');
        if (this._marker.options.selected) {
            this.deselect()
        } else {
            this.select()
        }
    }

    _setIconStyles(highlight) {
        let icon = this._marker._icon, offset;
        if (icon) {
            if (highlight) {
                L.DomUtil.addClass(icon, MarkerSelect.selectedClassName);
                offset = -parseInt(window.getComputedStyle(icon)['border-top-width'], 10);
            } else {
                offset = parseInt(window.getComputedStyle(icon)['border-top-width'], 10);
                L.DomUtil.removeClass(icon, MarkerSelect.selectedClassName);
            }
            icon.style.marginTop = parseInt(icon.style.marginTop, 10) + offset + 'px';
            icon.style.marginLeft = parseInt(icon.style.marginLeft, 10) + offset + 'px';
        }
    }
};

L.Handler.MarkerSelect.selectableClassName = 'leaflet-marker-selectable';

L.Handler.MarkerSelect.selectedClassName = 'leaflet-marker-selected';


// @namespace Marker
// @section Marker options
L.Marker.mergeOptions({
    // @option selectable: Boolean = true
    // Whether the marker is selectable using mouse/touch events or not.
    selectable: true,
    // @option selected: Boolean = false
    // Whether the marker is selected or not.
    selected: false
});


// Add init hook for MarkerSelect handler
L.Marker.addInitHook(function() {
    if (L.Handler.MarkerSelect) {
        this.selecting = new L.Handler.MarkerSelect(this);

        if (this.options.selectable) {
            this.selecting.enable();
        }
    }
});


function initIcon() {
    initIcon.base.call(this);
    if (this.options.selectable) {
        L.DomUtil.addClass(this._icon, 'leaflet-marker-selectable');
        if (this.options.selected) {
            L.DomUtil.addClass(this._icon, 'leaflet-marker-selected');
        }
    }
}

initIcon.base = L.Marker.prototype._initIcon;
L.Marker.prototype._initIcon = initIcon;
