import L from 'leaflet';
import 'leaflet.markercluster';


/**
 * Class representing clustered features
 * @extends L.MarkerCluster
 */
export default class FeatureCluster extends L.MarkerCluster {
    initialize() {
        super.initialize.apply(this, arguments);
        this.on('click', this._onClick, this);
        this.on('dblclick', this._onDblClick, this);
    }

    _onClick(event) {
        // no 'singleclick' event like in ol3 :(
        this._singleClickTimeout = this._singleClickTimeout || setTimeout(() => {
            delete this._singleClickTimeout;
            this.spiderfy();
        }, 300);
    }

    _onDblClick(event) {
        clearTimeout(this._singleClickTimeout);
        delete this._singleClickTimeout;
        this.zoomToBounds();
    }
}


FeatureCluster.include({
    options: Object.create(L.MarkerCluster.prototype.options)
});

FeatureCluster.mergeOptions({
    selectable: false,

    contextmenu: true,
    contextmenuItems: [{
        text:      'Group',
        disabled:  true,
        index:     0
    }, {
        separator: true,
        index:     1
    }],
});
