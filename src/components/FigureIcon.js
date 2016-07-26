import L from 'leaflet';

export default class FigureIcon extends L.Icon {
    /**
     * See {@link http://leafletjs.com/reference-1.0.0.html#icon} for more details.
     * @param {object} [options]
     */
    constructor(options = {}){
        super(options);
    }

    createIcon(oldIcon) {
        let figure = document.createElement('figure');
        let { title, iconUrl } = this.options;

        if (iconUrl) {
            figure.appendChild(this._createImg(iconUrl, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null));
        }

        if (title) {
            let figCaption = document.createElement('figcaption');
            let titleNode = document.createTextNode(title);
            figCaption.appendChild(titleNode);
            figure.appendChild(figCaption);
        }

        this._setIconStyles(figure, 'icon');
        return figure;
    }

    static createShadow() {
        return null;
    }
}
