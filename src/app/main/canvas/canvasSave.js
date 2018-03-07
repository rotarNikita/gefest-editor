import Flat from './Flat';
import Point from './Point';
import canvasDraw, { CanvasDraw } from './canvasDraw';

class CanvasSave {
    constructor () {
        this.canvas = document.getElementById('canvas-save');
        this.ctx = this.canvas.getContext('2d');
    }

    save () {
        const { canvas, ctx } = this;
        const { flats } = Flat;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let key in flats) {
            if (flats[key] !== Flat.selected) {
                const { points, color, label } = flats[key];

                ctx.beginPath();

                try {
                    ctx.moveTo(points[0].x, points[0].y)
                } catch (e) {}

                for (let i = 0; i < points.length; i++) {
                    let nextPoint = points[i + 1] || points[0];

                    Point.connectTo(ctx, nextPoint);
                }

                ctx.fillStyle = CanvasDraw.hexToRgbA(color);
                ctx.fill();

                if (!label.sale) {
                    if (label.title) {
                        ctx.font = `${canvasDraw.fontSize}px Arial`;
                        ctx.fillStyle = '#000000';
                        ctx.fillText(label.title, label.position.x, label.position.y);
                    }

                    if (label.description) {
                        ctx.font = `${canvasDraw.fontSize}px Arial`;
                        ctx.fillStyle = '#000000';
                        ctx.fillText(label.description,
                            label.position.x + label.descriptionOffset,
                            label.position.y + (label.title ? canvasDraw.fontSize : 0));
                    }
                } else {
                    ctx.font = `${canvasDraw.fontSize}px Arial`;
                    ctx.fillStyle = 'red';
                    ctx.fillText('продано', label.position.x, label.position.y);
                }

                ctx.closePath();
            }
        }
    }

    clearCanvas () {
        const { canvas, ctx } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    resize (width, height) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvas.width = width;
        this.canvas.height = height;
    }
}

const canvasSave = new CanvasSave();

export default canvasSave;