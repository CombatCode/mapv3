import L from 'leaflet';
import './leaflet-draw/leaflet.draw';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';

import './handlers/selection/Marker.Select';
import './handlers/selection/Map.ClickDeselect';
import './handlers/selection/Map.BoxSelect';
import './handlers/rotation/Marker.Rotate';

import { applyComponent } from './core/Component';
import MapSetComponent from './components/MapSet/MapSetComponent';
import './components/Control/Control.Rotate';


(function() {
    applyComponent('#mapsetsList', new MapSetComponent());
})();
