import mainLoader from '../../loader/mainLoader';
import canvasDraw from './canvasDraw';

class MainImage {
    constructor () {
        this.img = document.getElementById('main-image');
        this.size = {};

        this.img.addEventListener('load', this.load.bind(this))
    }

    setImage (src) {
        mainLoader.open();
        this.img.setAttribute('src', src);
    }

    load () {
        this.size = {
            naturalWidth: this.img.naturalWidth,
            naturalHeight: this.img.naturalHeight,
            width: this.img.offsetWidth,
            height: this.img.offsetHeight,
        };

        canvasDraw.resize(this.size);

        mainLoader.close();
    }
}


const mainImage = new MainImage();

export default mainImage;