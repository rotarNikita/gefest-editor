import Point from "../Point";

export default class ControlPoint {
    constructor () {
        this._controlPoint = null;
    }

    _controlPointAddOrResize () {
        const { cursor, points } = this;

        points.forEach(point => {
            if (cursor.startX <= point.x + Point.radius &&
                cursor.startX >= point.x - Point.radius &&
                cursor.startY <= point.y + Point.radius &&
                cursor.startY >= point.y - Point.radius) {
                this._controlPoint = point;
            }
        })
    }

    _controlPointAdd () {
        const { points, cursor } = this;

        this._controlPoint = new Point(cursor.startX, cursor.startY);

        if (points.length > 2) {
            let nearPoint = undefined;
            let minDistance = Infinity;

            const { _controlPoint } = this;

            points.forEach(function (point, i) {
                let distance = Math.sqrt(Math.pow(cursor.startX - point.x, 2) + Math.pow(cursor.startY - point.y, 2));
                let cross = false;

                points.forEach((point2, i2) => {
                    const nextPoint = i2 + 1 >= points.length ? 0 : i2 + 1;

                    if (i !== i2 && i !== nextPoint)
                        if (ControlPoint._crossRowCheck(point, _controlPoint, point2, points[nextPoint]))
                            cross = true;
                });

                if (minDistance > distance && !cross) {
                    minDistance = distance;
                    nearPoint = i;
                }
            });

            const nearPoint_left = nearPoint - 1 < 0 ? points.length - 1 : nearPoint - 1;
            const nearPoint_right = nearPoint + 1 >= points.length ? 0 : nearPoint + 1;

            const distance_left = Math.sqrt(Math.pow(cursor.startX - points[nearPoint_left].x, 2) + Math.pow(cursor.startY - points[nearPoint_left].y, 2));
            const distance_right = Math.sqrt(Math.pow(cursor.startX - points[nearPoint_right].x, 2) + Math.pow(cursor.startY - points[nearPoint_right].y, 2));

            if (distance_left < distance_right)
                if (ControlPoint._crossRowCheck(points[nearPoint], points[nearPoint_right],this._controlPoint, points[nearPoint_left]))
                    points.splice(nearPoint_right, 0, this._controlPoint);
                else points.splice(nearPoint, 0, this._controlPoint);
            else
                if (ControlPoint._crossRowCheck(points[nearPoint], points[nearPoint_left], this._controlPoint, points[nearPoint_right]))
                    points.splice(nearPoint, 0, this._controlPoint);
                else points.splice(nearPoint_right, 0, this._controlPoint);
        } else points.push(this._controlPoint);
    }

    static _crossRowCheck (pa1, pa2, pb1, pb2) {
        let ka = (pa2.y - pa1.y) / (pa2.x - pa1.x);
        let kb = (pb2.y - pb1.y) / (pb2.x - pb1.x);

        const ba = pa1.y - ka * pa1.x;
        const bb = pb1.y - kb * pb1.x;

        let x0 = Math.round((bb - ba) / (ka - kb));
        let y0 = Math.round(ka * x0 + ba);

        if (ka === Infinity || ka === -Infinity) {
            x0 = pa1.x;
            y0 = Math.round(kb * x0 + bb);
        }
        if (kb === Infinity || kb === -Infinity) {
            x0 = pb1.x;
            y0 = Math.round(ka * x0 + ba);
        }
        if (kb === 0 || kb === -0) y0 = pb2.y;
        if (ka === kb || ka === -kb) return false;

        return ((x0 <= pa1.x && x0 >= pa2.x) || (x0 <= pa2.x && x0 >= pa1.x)) &&
            ((x0 <= pb1.x && x0 >= pb2.x) || (x0 <= pb2.x && x0 >= pb1.x)) &&
            ((y0 <= pa1.y && y0 >= pa2.y) || (y0 <= pa2.y && y0 >= pa1.y)) &&
            ((y0 <= pb1.y && y0 >= pb2.y) || (y0 <= pb2.y && y0 >= pb1.y));
    }

    _controlPointDelete () {
        const { cursor, points } = this;

        for (let i = 0; i < points.length; i++)
            if (cursor.startX <= points[i].x + Point.radius &&
                cursor.startX >= points[i].x - Point.radius &&
                cursor.startY <= points[i].y + Point.radius &&
                cursor.startY >= points[i].y - Point.radius) {
                points.splice(i, 1);
                break;
            }
    }

    drawStartControlPoint (event) {
        if (event.button === 2) this._controlPointDelete();
        else {
            this._controlPointAddOrResize();
            if (!this._controlPoint) this._controlPointAdd();
        }

        this.paintAndConnectPoints();
    }

    drawControlPoint () {
        const { cursor, _controlPoint} = this;

        if (_controlPoint) {
            _controlPoint.x = cursor.x;
            _controlPoint.y = cursor.y;
        }
    }

    drawEndControlPoint () {
        this._controlPoint = null;
    }
}