const L = L || window.L;


export default class OverLayer extends L.ImageOverlay {
    constructor(imageUrl, imageBounds){
        super(imageUrl, imageBounds)
    }
}
