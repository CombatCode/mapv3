import Feature from './Feature';


const L = L || window.L;


export default class FeatureCamera extends Feature {
    constructor(latlng, options = {}){
        options.icon = L.icon({
            iconUrl: 'assets/feature-camera-inuse.png',
            iconSize: [26, 26]
        });
        super(latlng, options);
    }
}
