import L from 'leaflet'
import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Camera Feature
 * @module components/Feature/FeatureCamera
 * @extends Feature
 */
export default class FeatureCamera extends Feature {

    static defaults = Object.assign(Object.create(Feature.defaults), {
        // Only need single, reusable tooltip instance since we change popup content on open
        tooltip: new L.tooltip({
            offset: new L.Point(10, -15)
        }),

        // Leaflet.contextmenu options
        contextmenuItems: [{
            text: 'Camera',
            iconCls: 'icon svmx feature camera',
            disabled: true,
            index: 0

        }, {
            separator: true,
            index: 1
        }],

        onDropContextmenuItems: [{
            text: 'locate',
            iconCls: 'fa fa-compass',
            callback: function(e) { alert('NOT IMPLEMENTED'); }
        }, '-', {
            text: 'add as Camera',
            iconCls: 'icon svmx feature camera',
            callback: function(e) { e.relatedTarget.addTo(this.features); }
        }]
    });

    /**
     * Feature of the camera marker.
     * @param {L.LatLng} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        if (!('name' in options) && 'id' in options) {
            options.name = `Camera ${options.id}`
        }
        if (!('icon' in options)) {
            /** we must instantiate icons (because e.g. titles differs between Features) */
            options.icon = new FigureIcon({
                className: 'FeatureCamera',
                iconSize: [56, 50],
                id: options.id,
                status: options.status || 'unknown',
                title: options.name
            });
        }
        super(latlng, options);

        this.bindTooltip(this.options.tooltip);
        this.on('tooltipopen', FeatureCamera._onTooltipOpen, this);
    }

    static _onTooltipOpen(event) {
        this._fixTooltipOffset(event.tooltip);

        let stateTxt = 'No communication';
        let stateIco = 'icon svmx status nocommunication';
        let videoStatusTxt = 'Unknown status';
        let videoStatusIco = 'icon svmx status unknown';
        let telemetryStatusTxt = 'Unknown status';
        let telemetryStatusIco = 'icon svmx status unknown';

        let content = `
            <h4>${this.options.name}</h4>
            <table class="ui very basic table"><tbody>
            <tr><td class="collapsing">State:</td>
            <td class="collapsing"><i class="${stateIco}"></i></td>
            <td class="collapsing">${stateTxt}</td><tr>

            <tr><td class="collapsing">Telemetry status:</td>
            <td class="collapsing"><i class="${videoStatusIco}"></i></td>
            <td class="collapsing">${videoStatusTxt}</td><tr>

            <tr><td class="collapsing">Video status:</td>
            <td class="collapsing"><i class="${telemetryStatusIco}"></i></td>
            <td class="collapsing">${telemetryStatusTxt}</td><tr>
            </tbody></table>
            <div><img src="/assets/noise.gif"></div>
        `;

        event.tooltip.setContent(content);
    }
}

FeatureCamera.include({options: FeatureCamera.defaults});
