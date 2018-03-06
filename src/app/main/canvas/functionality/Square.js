import Point from "../Point";

export default class Square {
    constructor () {
        this._square = {
            squareResizePointBy: null
        }
    }

    drawStartSquare () {
        const { cursor, _square } = this;

        this.points.forEach(point => {
            if (cursor.startX <= point.x + Point.radius &&
                cursor.startX >= point.x - Point.radius &&
                cursor.startY <= point.y + Point.radius &&
                cursor.startY >= point.y - Point.radius) {
                _square.squareResizePointBy = point;
            }
        })
    }

    _resizeSquareBy () {
        const { cursor, points, _square } = this;

        const pointIndex = points.indexOf(_square.squareResizePointBy);
        const nextPointIndex = pointIndex + 1 >= points.length ? 0 : pointIndex + 1;
        const prevPointIndex = pointIndex - 1 < 0 ? points.length - 1 : pointIndex - 1;
        const nextPoint = points[nextPointIndex];
        const prevPoint = points[prevPointIndex];

        points[pointIndex] = new Point(cursor.x, cursor.y);

        if (points.length === 4) {
            points[nextPointIndex] = pointIndex % 2 === 0 ? new Point(points[nextPointIndex].x, cursor.y) : new Point(cursor.x, points[nextPointIndex].y);
            points[prevPointIndex] = pointIndex % 2 === 0 ? new Point(cursor.x, points[prevPointIndex].y) : new Point(points[prevPointIndex].x, cursor.y);
        } else {
            if (Math.abs(nextPoint.x - cursor.x) > Math.abs(nextPoint.y - cursor.y)) nextPoint.y = cursor.y;
            else nextPoint.x = cursor.x;

            if (Math.abs(prevPoint.x - cursor.x) > Math.abs(prevPoint.y - cursor.y)) prevPoint.y = cursor.y;
            else prevPoint.x = cursor.x;
        }

        _square.squareResizePointBy = points[pointIndex];
    }

    drawSquare () {
        if (this._square.squareResizePointBy) this._resizeSquareBy();
        else this._drawSquare();
    }

    _drawSquare () {
        const { cursor } = this;

        this.points = [new Point(cursor.startX, cursor.startY),
            new Point(cursor.x, cursor.startY),
            new Point(cursor.x, cursor.y),
            new Point(cursor.startX, cursor.y)];
    }

    drawEndSquare () {
        this._square.squareResizePointBy = null;
    }
}