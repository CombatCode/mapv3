import Feature from '../Feature';


const L = L || window.L;


export default class CameraFeature extends Feature {
    constructor(latlng, options = {}){
        options.icon = L.icon({
            iconUrl: 'http://127.0.0.1:8000/common/images/gis/feature-camera-inuse.png',
            iconSize: [26, 26]
        });
        super(latlng, options);
    }
}
