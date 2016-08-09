import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.markercluster';

import './handlers/selection/Marker.Select';

import { applyComponent } from './core/Component';
import MapSetComponent from './components/MapSet/MapSetComponent';


(function() {
    applyComponent('#mapsetsList', new MapSetComponent());
})();
