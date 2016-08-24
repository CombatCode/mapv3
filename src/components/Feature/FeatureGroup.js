import L from 'leaflet';
import 'leaflet.markercluster';
import FeatureCluster from './FeatureCluster';


/**
 * Represents a group of Features. Nothing here yet.
 * @module components/Feature/FeatureGroup
 * @extends L.MarkerClusterGroup
 **/
export default class FeatureGroup extends L.MarkerClusterGroup {
    initialize(options) {
        super.initialize(options);
        // this forces L.markercluster plugin to use our own class for clusters
        this._markerCluster = FeatureCluster;
    }
}
