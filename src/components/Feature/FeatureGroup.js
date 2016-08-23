import 'leaflet.markercluster';
import FeatureCluster from '../Feature/FeatureCluster';
import './../Feature/FeatureCamera';


/**
 * Represents a group of Features
 * Nothing here yet
 **/
export default class FeatureGroup extends L.MarkerClusterGroup {
    initialize(options) {
        super.initialize(options);
        // this forces L.markercluster plugin to use our own class for clusters
        this._markerCluster = FeatureCluster;
    }
}
