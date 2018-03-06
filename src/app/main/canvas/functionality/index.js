import Square from './Square';
import ControlPoint from './ControlPoint';
import Move from './Move';
import TextPosition from './TextPosition'

export default class Functionality {
    constructor () {
        this._mergeClass(Square);
        this._mergeClass(ControlPoint);
        this._mergeClass(Move);
        this._mergeClass(TextPosition);

        window.addEventListener('keydown', this._moveByKey.bind(this));
    }

    syncTool (tool) {
        switch (tool) {
            case 'square':
                this.f_drawStart = this.drawStartSquare;
                this.f_drawEnd = this.drawEndSquare;
                this.f_draw = this.drawSquare;
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'control-point':
                this.f_drawStart = this.drawStartControlPoint;
                this.f_drawEnd = this.drawEndControlPoint;
                this.f_draw = this.drawControlPoint;
                this.canvas.style.cursor = 'pointer';
                break;
            case 'relocate':
                this.f_drawStart = this.drawStartMove;
                this.f_drawEnd = this.drawEndMove;
                this.f_draw = this.drawMove;
                this.canvas.style.cursor = 'move';
                break;
            case 'text-position':
                this.f_drawStart = this.drawStartTextPosition;
                this.f_drawEnd = this.drawEndTextPosition;
                this.f_draw = this.drawTextPosition;
                this.canvas.style.cursor = 'move';
                break;
            default:
                this.f_drawStart = () => {};
                this.f_drawEnd = () => {};
                this.f_draw = () => {};
                this.canvas.style.cursor = 'default';
        }
    }

    _mergeClass (className) {
        const prototype = className.prototype;
        const exemplar = new className();
        const srcPrototypeArray = Object.getOwnPropertyNames(prototype);
        const destPrototypeArray = Object.getOwnPropertyNames(Functionality.prototype);

        Object.assign(this, exemplar);

        for (let i = 0; i < srcPrototypeArray.length; i++) {
            let canMerge = true;

            for (let j = 0; j < destPrototypeArray.length; j++) {
                if (srcPrototypeArray[i] === destPrototypeArray[j]) canMerge = false;
            }

            if (canMerge) {
                Functionality.prototype[srcPrototypeArray[i]] = prototype[srcPrototypeArray[i]];
            }
        }
    }
}