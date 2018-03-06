import Form from './Form';
import flatControlFormHTML from './flatControlForm.html';
import ImageLoadingForm from './ImageLoadingForm';
import Flat from '../../main/canvas/Flat';

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
        this.changeFormTo(ImageLoadingForm)
    }

    addFlat (event) {
        event.preventDefault();

        new Flat(this.flatWrapper);
    }
}