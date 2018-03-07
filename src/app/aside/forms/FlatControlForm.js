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

        // demo
        const s = new Flat(this.flatWrapper);
        s.textAreaCode.value = '<path class="section_choose_path" d="M70.3961937716263 70.455 L132.25951557093427 96.075 L132.25951557093427 151.585 L70.3961937716263 181.475 L12.799307958477508 151.585 L68.26297577854672 123.83 L10.666089965397925 100.34500000000001 L10.666089965397925 44.835 L72.52941176470588 10.675 L138.659169550173 44.835 Z" fill="rgba(6,57,111,0.4)" />';
        s.parseCode();
        const w = new Flat(this.flatWrapper);
        w.textAreaCode.value = '<path class="section_choose_path" d="M149.32525951557093 19.215 L194.12283737024222 19.215 L232.52076124567475 96.075 L258.11937716262975 36.295 L285.85121107266434 93.94 L330.64878892733566 21.35 L373.3131487889273 21.35 L285.85121107266434 172.935 L260.25259515570934 130.235 L234.65397923875432 175.07 Z" fill="rgba(242,103,104,0.4)" />';
        w.parseCode();
        new Flat(this.flatWrapper);
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