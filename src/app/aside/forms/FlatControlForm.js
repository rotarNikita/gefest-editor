import Form from './Form';
import flatControlFormHTML from './flatControlForm.html';
import ImageLoadingForm from './ImageLoadingForm';
import Flat from '../../main/canvas/Flat';
import canvasDraw from '../../main/canvas/canvasDraw';
import canvasSave from '../../main/canvas/canvasSave';

export default class FlatControlForm extends Form {
    constructor () {
        super();

        this.setHTML(flatControlFormHTML);

        this.buttonAddFlat = document.getElementById('add-flat');
        this.buttonBack = document.getElementById('flat-control-back');
        this.flatWrapper = document.getElementById('flats');

        this.buttonBack.addEventListener('click', this.back.bind(this));
        this.buttonAddFlat.addEventListener('click', this.addFlat.bind(this));
    }

    back (event) {
        event.preventDefault();
        Flat.flats = [];
        this.changeFormTo(ImageLoadingForm);
        canvasDraw.clearCanvas();
        canvasDraw.addProtection();
        canvasSave.clearCanvas();
    }

    addFlat (event) {
        event.preventDefault();

        new Flat(this.flatWrapper);
    }
}