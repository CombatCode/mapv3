import L from 'leaflet';
import 'leaflet.markercluster';


// ToDo: We should extend L.MarkerCluster and L.MarkerClusterGroup rather then overriding them.
// ToDo: The problem is L.MarkerClusterGroup creates instances of L.MarkerCluster automatically.

L.MarkerCluster.include({
    _onClick() {
        // no 'singleclick' event like in ol3 :(
        this._singleClickTimeout = setTimeout(() => this.spiderfy(), 250);
    },

    _onDblClick() {
        clearTimeout(this._singleClickTimeout);
        delete this._singleClickTimeout;
        console.warn('dblclick');
        this.unspiderfy();
        this.zoomToBounds();
    }
});


L.MarkerCluster.addInitHook(function() {
    this.on('click', this._onClick, this);
    this.on('dblclick', this._onDblClick, this);
});


L.MarkerCluster.mergeOptions({
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


L.MarkerClusterGroup.mergeOptions({
    // we already changed default behavior
    // (singleclick - spiderify, dblclick - zoomToBounds)
    zoomToBoundsOnClick: false
});
