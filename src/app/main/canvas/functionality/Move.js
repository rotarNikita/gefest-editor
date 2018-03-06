export default class Move {
    constructor () {
        this._move = {
            pointsOld: []
        };
    }

    drawStartMove () {
        const { points, _move } = this;

        _move.pointsOld = [];

        points.forEach((point, i) => {
            _move.pointsOld[i] = Object.assign({}, point);
        });

        this.drawStartTextPosition();
    }



    drawMove () {
        const { cursor, points, _move } = this;

        points.forEach((point, i) => {
            point.x = _move.pointsOld[i].x + cursor.x - cursor.startX;
            point.y = _move.pointsOld[i].y + cursor.y - cursor.startY;
        });

        this.drawTextPosition();
    }

    drawEndMove () {
        this._move.pointsOld = [];
        this.drawEndTextPosition();
    }

    _moveByKey (event) {
        const { cursor } = this;

        cursor.startX = 0;
        cursor.startY = 0;

        switch (event.key) {
            case 'ArrowUp':
                cursor.x = 0;
                cursor.y = -1;
                break;
            case 'ArrowDown':
                cursor.x = 0;
                cursor.y = 1;
                break;
            case 'ArrowLeft':
                cursor.x = -1;
                cursor.y = 0;
                break;
            case 'ArrowRight':
                cursor.x = 1;
                cursor.y = 0;
                break;
            default:
                cursor.x = 0;
                cursor.y = 0;
        }

        this.drawStartMove();
        this.clearCanvas();
        this.drawMove();
        this.paintAndConnectPoints();
        this.drawEndMove();
    }
}