import L from 'leaflet';


export default class FigureIcon extends L.Icon {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#icon} for more details.
     * @param {object} [options]
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Overwrite inherited createIcon method to return figure type node
     * @param oldIcon
     * @returns {Element}
     */
    createIcon(oldIcon) {
        let figure = document.createElement('figure');
        let {title, id, status} = this.options;
        let imgWrapper = document.createElement('div');
        let imgFaker = document.createElement('i');

        imgFaker.className = 'icon';
        imgWrapper.className = 'wrapper leaflet-rotatable';

        imgWrapper.appendChild(imgFaker);
        figure.appendChild(imgWrapper);

        if (id) {
            figure.setAttribute("data-id", id);
        }

        if (status) {
            figure.setAttribute("data-status", status);
        }

        if (title) {
            let figCaption = document.createElement('figcaption');
            let titleNode  = document.createTextNode(title);
            figCaption.appendChild(titleNode);
            figure.appendChild(figCaption);
        }

        this._setIconStyles(figure, 'icon');
        return figure;
    }

    /**
     * Disable inherited createShadow method for FigureIcon's
     * @returns {null}
     */
    static createShadow() {
        return null;
    }

    /**
     * @inheritDoc
     * @private
     */
    _setIconStyles(img, name) {
        super._setIconStyles(img, name);
        img.firstChild.style[`${ L.DomUtil.TRANSFORM }Origin`] = this.options.origin;
    }
}


/** Inherit options from L.Icon (don't mutate L.Icon defaults) */
FigureIcon.prototype.options = Object.create(L.Marker.prototype.options);

FigureIcon.mergeOptions({
    origin: '50% 50%'
});

