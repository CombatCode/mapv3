const L = L || window.L;


export default class Feature extends L.Marker {
    constructor(latlng, options = {}){
        super(latlng, options);
        this.origin = options.origin || '50% 50%';
        this.angle = options.angle || 0;
    }

    _setPos(pos) {
        super._setPos(pos);

        if(this.angle) {
            const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');
            this._icon.style[`${ L.DomUtil.TRANSFORM }Origin`] = this.origin;
            console.log('oldIE', oldIE, this._icon.style[L.DomUtil.TRANSFORM]);
            if(oldIE) {
                this._icon.style[L.DomUtil.TRANSFORM] = `rotate(${ this.angle }deg)`;
            } else {
                // Use 3D accelerated version for the modern browsers
                this._icon.style[L.DomUtil.TRANSFORM] += ` rotate(${ this.angle }deg)`;
            }
            console.log(this._icon.style[L.DomUtil.TRANSFORM]);
        }
    }
}
