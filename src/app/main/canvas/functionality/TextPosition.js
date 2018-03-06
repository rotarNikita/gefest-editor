export default class TextPosition {
    constructor () {
        this._textPosition = {
            x: undefined,
            y: undefined
        }
    }

    drawStartTextPosition () {
        const { label, _textPosition } = this;

        if (label.title || label.sale || label.description) {
            _textPosition.x = label.position.x;
            _textPosition.y = label.position.y;
        }
    }

    drawTextPosition () {
        const { cursor, label, _textPosition } = this;

        if (_textPosition.x !== undefined && _textPosition.y !== undefined) {
            label.position.x = _textPosition.x + cursor.x - cursor.startX;
            label.position.y = _textPosition.y + cursor.y - cursor.startY;
        }
    }

    drawEndTextPosition () {
        this._textPosition.x = undefined;
        this._textPosition.y = undefined;
    }
}