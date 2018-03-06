import flatHTML from '../../aside/forms/flat.html';
import modalHTML from '../../aside/forms/flat-modal.html';
import canvasDraw, { CanvasDraw } from './canvasDraw';
import canvasSave from "./canvasSave";
import mainImage from './mainImage';
import $ from 'jquery';

export default class Flat {
    constructor (parent) {
        canvasDraw.delProtection();

        if (!Flat.flats) Flat.flats = {};
        this.id = Flat.generateKey();
        Flat.flats[this.id] = this;

        const block = document.createElement('div');
        block.id = `flat${this.id}`;
        block.className = 'flat selected';
        block.innerHTML = flatHTML;
        parent.appendChild(block);
        this.block = block;

        this.block.querySelector('.flat_delete').addEventListener('click', this.delete.bind(this));
        this.block.querySelector('.flat_color').addEventListener('input', this.updateColor.bind(this));

        this.cardSale = this.block.querySelector('.card-sale');
        this.cardSale.children[0].setAttribute('id', `card-sale${this.id}`);
        this.cardSale.children[1].setAttribute('for', `card-sale${this.id}`);
        this.cardSale.children[0].addEventListener('change', this.checkboxChange.bind(this));

        this.cardTitle = this.block.querySelector('.card-title');
        this.cardTitle.addEventListener('input', this.changeTitle.bind(this));

        this.cardDescription = this.block.querySelector('.card-description');
        this.cardDescription.addEventListener('input', this.changeDescription.bind(this));

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('id', `flat_modal${this.id}`);
        modal.innerHTML = modalHTML;
        this.block.appendChild(modal);
        this.textAreaCode = modal.querySelector('.flat_textarea');
        $(`#flat_modal${this.id}`).modal();

        this.block.querySelector('.flat_code').addEventListener('click', this.codeEditorOpen.bind(this));
        modal.querySelector('.modal-close').addEventListener('click', this.codeEditorClose.bind(this));

        this.color = '#fff';
        this.points = [];
        this.label = {
            title: undefined,
            description: undefined,
            descriptionOffset: undefined,
            sale: false,
            position: {
                x: 0,
                y: canvasDraw.fontSize
            }
        };

        this.addSelected();
        block.addEventListener('click', this.addSelected.bind(this));
    }

    codeEditorOpen () {
        this.stringifyCode();
        $(`#flat_modal${this.id}`).modal('open');
        canvasDraw.addProtection();
    }

    codeEditorClose (event) {
        event.preventDefault();
        this.parseCode();
        $(`#flat_modal${this.id}`).modal('close');
        canvasDraw.delProtection();
    }

    stringifyCode () {
        let path = `M${canvasDraw.points[0].x / mainImage.size.width * mainImage.size.naturalWidth} ${canvasDraw.points[0].y / mainImage.size.height * mainImage.size.naturalHeight} `;
        for (let i = 1; i < canvasDraw.points.length; i++)
            path += `L${canvasDraw.points[i].x / mainImage.size.width * mainImage.size.naturalWidth} ${canvasDraw.points[i].y / mainImage.size.height * mainImage.size.naturalHeight} `;
        path += 'Z';

        this.textAreaCode.value = `<path class="section_choose_path" d="${path}" fill="${canvasDraw.options.fillStyle}" />`;

        if (canvasDraw.label.sale || canvasDraw.label.title || canvasDraw.label.description) {
            this.textAreaCode.value += `<text class="section_choose_description" transform="translate(${canvasDraw.label.position.x / mainImage.size.width * mainImage.size.naturalWidth} ${canvasDraw.label.position.y / mainImage.size.height * mainImage.size.naturalHeight})" x="0" y="0">`;

            if (canvasDraw.label.sale) {
                this.textAreaCode.value += '<tspan x="0" fill="red">продано</tspan>';
            } else {
                if (canvasDraw.label.title) {
                    this.textAreaCode.value += `<tspan x="0">${canvasDraw.label.title}</tspan>`;

                    if (canvasDraw.label.description) {
                        this.textAreaCode.value += `<tspan x="${canvasDraw.label.descriptionOffset / mainImage.size.width * mainImage.size.naturalWidth}" dy="1.2em">${canvasDraw.label.description}</tspan>`;
                    }
                } else if (canvasDraw.label.description) {
                    this.textAreaCode.value += `<tspan x="0">${canvasDraw.label.description}</tspan>`;
                }
            }

            this.textAreaCode.value += '</text>';
        }
    }

    parseCode () {

    }

    checkboxChange () {
        this.label.sale = !!this.cardSale.children[0].checked;

        canvasDraw.changeLabel(this.label);
    }

    static generateKey () {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    changeDescription () {
        this.label.description = this.cardDescription.value;

        canvasDraw.changeLabel(this.label);
    }

    changeTitle () {
        this.label.title = this.cardTitle.value;

        canvasDraw.changeLabel(this.label);
    }

    delete (event) {
        event.stopPropagation();

        this.block.remove();
        delete Flat.flats[this.id];
        delete this;

        canvasDraw.clearCanvas();
        canvasDraw.addProtection();

        for (let key in Flat.flats) {
            Flat.flats[key].addSelected();
            canvasDraw.delProtection();
            break;
        }
    }

    updateColor (event) {
        this.color = event.target.value;

        this.block.children[0].style.background = this.color;

        canvasDraw.options.strokeStyle = this.color;
        canvasDraw.options.fillStyle = CanvasDraw.hexToRgbA(this.color);
        canvasDraw.paintAndConnectPoints();
    }

    addSelected () {
        Flat.selected = this;

        for (let key in Flat.flats) {
            Flat.flats[key].block.classList.remove('selected');
        }
        this.block.classList.add('selected');

        canvasDraw.label = this.label;
        canvasDraw.points = this.points;
        canvasDraw.options.strokeStyle = this.color;
        canvasDraw.options.fillStyle = CanvasDraw.hexToRgbA(this.color);
        canvasDraw.paintAndConnectPoints();
        canvasSave.save();
    }
}