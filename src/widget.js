import L from 'leaflet';
import './leaflet-draw/leaflet.draw';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';

import './handlers/selection/Marker.Select';
import './handlers/selection/Map.ClickDeselect';
import './handlers/rotation/Marker.Rotate';

import './components/Control/Control.Rotate';
import Storage from './core/Storage';
import MapSetComponent from './components/MapSet/MapSetComponent';
import { applyComponent } from './core/Component';


const Widget = requirejs('widget');


export default class MapWidget extends Widget {

    static html = `
<div class="mapV3-container">
    <div class="mapV3-map">
        <div class="mapV3-loader">
            <i class="circle notched icon"></i>
            <span>Loading Features...</span>
        </div>
        
    </div>
    <p class="mapV3-intro"><i class="folder open icon"></i> Please select a Map</p>
    
    <div class="mapV3-mapsetsContainer" style="border-left: 1px solid #dedede;">
        <h2>Mapsets</h2>
        <section class="mapV3-mapsetsList"></section>
    </div>
</div>`;

    /**
     * @param {Element|JQuery} root
     * @param {string} type
     * @param {*} params
     */
    constructor(root, type, ...params) {
        super(root, type, ...params);
        this.root.removeClass('client-spinner');
        this.root.append(MapWidget.html);

        // Mock up request user
        (new Storage(localStorage, 'auth')).setItem('username', 'guest');

        this.mapSetComponent = new MapSetComponent();

        // Initialize mapset component
        applyComponent('.mapV3-mapsetsList', this.mapSetComponent);
    }

    // Called on widget resize
    resize() {
        const mapSet = this.mapSetComponent.mapSet;
        mapSet.instance && mapSet.instance.invalidateSize();
    }

    getMapSet() {
        return this.map;
    }
}
