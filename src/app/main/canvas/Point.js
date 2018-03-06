export default class Point {
    constructor (x, y) {
        Point.radius = 5;

        this.x = x;
        this.y = y;
    }

    paint (ctx) {
        const { x, y } = this;

        ctx.moveTo(x, y);
        ctx.arc(x, y, Point.radius, 0, 2 * Math.PI);
    }

    static connectTo (ctx, point) {
        ctx.lineTo(point.x, point.y);
    }
}