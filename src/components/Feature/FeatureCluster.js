import L from 'leaflet';
import 'leaflet.markercluster';


/**
 * Class representing a cluster of Features on map
 * @module components/Feature/FeatureCluster
 * @extends L.MarkerCluster
 */
export default class FeatureCluster extends L.MarkerCluster {
    initialize(...params) {
        super.initialize(...params);
        this.on('mouseover', this._mouseOver, this);
        this.on('mouseout', this._mouseOut, this);
    }

    _mouseOver() {
        let listContent = '';
        for(let feature of this.getAllChildMarkers()) {
            listContent += `
                <li>${feature.options.name}</li>
            `;
        }

        let listBody = `
            <ul class="groupCluster">
                ${listContent}
            <ul>
        `;

        this.bindTooltip(listBody).openTooltip();
    }

    _mouseOut() {
        this.closeTooltip();
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
