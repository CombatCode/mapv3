import L from 'leaflet'
import Feature from './Feature';
import FigureIcon from './../FigureIcon';


/**
 * Class representing Camera Feature
 * @module components/Feature/FeatureCamera
 * @extends Feature
 */
export default class FeatureCamera extends Feature {
    /**
     * Feature of the camera marker.
     * @param {L.LatLng} latlng - geographical point [latitude, longitude]
     * @param {object} [options]
     */
    constructor(latlng, options = {}) {
        if (!options.icon) {
            /** we must instantiate icons (because e.g. titles differs between Features) */
            options.icon = new FigureIcon({
                className: 'FeatureCamera',
                iconSize: [56, 50],
                id: options.id,
                status: options.status || 'unknown',
                title: options.title || ''
            });
        }
        super(latlng, options);

        this.bindTooltip(this.options.title, {
            offset: new L.Point(10, -15),
            permanent: false
        });
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

        let content = [];

        content.push(`<h4>${this.options.title}</h4>`);

        content.push(`<table class="ui very basic table"><tbody>`,
            '<tr><td class="collapsing">State:</td>',
            `<td class="collapsing"><i class="${stateIco}"></i></td>`,
            `<td class="collapsing">${stateTxt}</td><tr>`,

            '<tr><td class="collapsing">Telemetry status:</td>',
            `<td class="collapsing"><i class="${videoStatusIco}"></i></td>`,
            `<td class="collapsing">${videoStatusTxt}</td><tr>`,

            '<tr><td class="collapsing">Video status:</td>',
            `<td class="collapsing"><i class="${telemetryStatusIco}"></i></td>`,
            `<td class="collapsing">${telemetryStatusTxt}</td><tr>`,
            `</tbody></table>`);

        content.push('<div><img src="/assets/noise.gif"></div>');

        event.tooltip.setContent(content.join(''));
    }
}


FeatureCamera.include({
    /** Inherit options */
    options: Object.create(Feature.prototype.options)
});


FeatureCamera.mergeOptions({
    // Leaflet.contextmenu options
    contextmenuItems: [{
        text: 'Camera',
        icon: 'assets/feature-camera-inuse.png',
        disabled: true,
        index: 0

    }, {
        separator: true,
        index: 1
    }],
});
