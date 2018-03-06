import mainImage from '../../main/canvas/mainImage';
import Form from './Form';
import imageLoadingFormHTML from './imageLoadingForm.html';
import FlatControlForm from './FlatControlForm';

export default class ImageLoadingForm extends Form {
    constructor () {
        super();

        this.setHTML(imageLoadingFormHTML);

        this.form = document.getElementById('choose-file');
        this.input = this.form.querySelector('.file-field input[type="file"]');

        this.form.addEventListener('submit', this.submit.bind(this));
        this.input.addEventListener('change', this.change.bind(this));
    }

    submit (event) {
        event.preventDefault();
        this.changeFormTo(FlatControlForm);
    }

    change () {
        const { input } = this;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.addEventListener('load', function (event) {
                mainImage.setImage(event.target.result);
            });

            reader.readAsDataURL(input.files[0]);
        }
    }
}