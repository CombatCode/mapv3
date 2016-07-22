const L = L || window.L;


export default class Map extends L.TileLayer {
    constructor(url, options){
        super(url, options);
    }
}
