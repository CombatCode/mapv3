import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';

import './handlers/selection/Marker.Select';
import './handlers/selection/Map.ClickDeselect';
import './handlers/selection/Map.BoxSelect';
import './handlers/rotation/Marker.Rotate';

import './components/Control/Control.Rotate';
import Storage from './core/Storage';
import MapSetComponent from './components/MapSet/MapSetComponent';
import { applyComponent } from './core/Component';


(function() {
    // Mock up request user
    (new Storage(localStorage, 'auth')).setItem('username', 'guest');

    // Initialize mapset component
    applyComponent('#mapsetsList', new MapSetComponent());
})();
