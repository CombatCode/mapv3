import L from 'leaflet';
import 'leaflet.markercluster';

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
