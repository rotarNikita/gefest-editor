import flatHTML from '../../aside/forms/flat.html';
import modalHTML from '../../aside/forms/flat-modal.html';
import canvasDraw, { CanvasDraw } from './canvasDraw';
import canvasSave from "./canvasSave";
import mainImage from './mainImage';
import $ from 'jquery';
import Point from './Point';

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
        $(`#flat_modal${this.id}`).modal({
            dismissible: false
        });

        this.block.querySelector('.flat_code').addEventListener('click', this.codeEditorOpen.bind(this));
        modal.querySelector('.modal-footer-agree').addEventListener('click', this.codeEditorAgree.bind(this));
        modal.querySelector('.modal-footer-cancel').addEventListener('click', this.codeEditorCancel.bind(this));

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
        block.addEventListener('click', this.addSelected.bind(this), true);
    }

    codeEditorOpen () {
        this.stringifyCode();
        $(`#flat_modal${this.id}`).modal('open');
        canvasDraw.addProtection();
    }

    codeEditorAgree (event) {
        event.preventDefault();
        this.parseCode();
        $(`#flat_modal${this.id}`).modal('close');
        canvasDraw.delProtection();
    }

    codeEditorCancel () {
        event.preventDefault();
        $(`#flat_modal${this.id}`).modal('close');
        canvasDraw.delProtection();
    }

    stringifyCode () {
        this.textAreaCode.value = '';

        if (canvasDraw.points.length) {
            let path = `M${canvasDraw.points[0].x / mainImage.size.width * mainImage.size.naturalWidth} ${canvasDraw.points[0].y / mainImage.size.height * mainImage.size.naturalHeight} `;
            for (let i = 1; i < canvasDraw.points.length; i++)
                path += `L${canvasDraw.points[i].x / mainImage.size.width * mainImage.size.naturalWidth} ${canvasDraw.points[i].y / mainImage.size.height * mainImage.size.naturalHeight} `;
            path += 'Z';

            this.textAreaCode.value = `<path class="section_choose_path" d="${path}" fill="${canvasDraw.options.fillStyle}" />`;
        }

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
        // reset
        this.color = '#fff';
        this.points = [];
        this.label = {
            title: '',
            description: '',
            descriptionOffset: undefined,
            sale: false,
            position: {
                x: 0,
                y: canvasDraw.fontSize
            }
        };

        // points
        try {
            const d = this.textAreaCode.value.match(/d="[^"]+"/i)[0].replace(/[^\d\s.]/g, '').trim().split(' ');

            for (let i = 0; i < d.length; i += 2) {
                let x = +d[i] / mainImage.size.naturalWidth * mainImage.size.width;
                let y = +d[i + 1] / mainImage.size.naturalHeight * mainImage.size.height;

                this.points.push(new Point(x, y))
            }
        } catch (e) {}

        // color
        try {
            const fill = this.textAreaCode.value.match(/<path.+?fill="[^"]+".+?\/>/i)[0].replace(/(<path.+?fill="|".+?\/>)/g, '').trim();
            this.color = CanvasDraw.rgbaToHex(fill);
            this.block.children[0].style.background = this.color;
        } catch (e) {}

        // text position
        let textPosition = undefined;

        try {
            textPosition = this.textAreaCode.value.match(/transform="translate\(\d+\.?\d+? \d+\.?\d+?\)"/i)[0].replace(/[^\d\s.]/g, '').trim().split(' ');
            this.label.position.x = textPosition[0] / mainImage.size.naturalWidth * mainImage.size.width;
            this.label.position.y = textPosition[1] / mainImage.size.naturalHeight * mainImage.size.height;
        } catch (e) {}

        // sale
        if (textPosition) {
            this.label.sale =  /Продано/i.test(this.textAreaCode.value);

            if (!this.label.sale) {
                // title
                try {
                    this.label.title = this.textAreaCode.value.match(/<tspan x="0">.+?<\/tspan>/)[0].replace('<tspan x="0">', '').replace('</tspan>', '');
                } catch (e) {}

                // description
                try {
                    const description = this.textAreaCode.value.match(/<tspan x="\d+\.?\d+?" dy="1.2em">.+?<\/tspan>/)[0];

                    const offset = description.match(/x="\d+\.?\d+?"/)[0].replace(/(x=|")/g, '');
                    const text = description.replace(/(<tspan x="\d+\.?\d+?" dy="1.2em">|<\/tspan>)/g, '');

                    this.label.description = text;
                    this.label.descriptionOffset = offset / mainImage.size.naturalWidth * mainImage.size.width;
                } catch (e) {}
            }
        }

        // inputs and styles
        this.cardTitle.value = this.label.title;
        this.cardDescription.value = this.label.description;
        this.label.sale = !!this.cardSale.children[0].checked;
        this.block.children[0].style.background = this.color;

        this.addSelected();
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