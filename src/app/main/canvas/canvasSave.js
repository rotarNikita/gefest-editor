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

                ctx.closePath();
                ctx.beginPath();

                if (label.section && label.title) {
                    this.drawSectionLabel(label);

                    ctx.font = `700 ${canvasDraw.fontSize2}px Arial`;
                    ctx.fillStyle = '#000000';
                    ctx.fillText(label.title, label.position.x, label.position.y);

                    ctx.font = `${canvasDraw.fontSize3}px Arial`;
                    ctx.fillText('планировки', label.position.x, label.position.y + canvasDraw.fontSize3 * 1.1);
                    ctx.fillText('типового этажа', label.position.x, label.position.y + canvasDraw.fontSize3 * 2.2);
                } else if (!label.sale) {
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
                            label.position.y + (label.title ? canvasDraw.fontSize * 1.1 : 0));
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

    drawSectionLabel (label) {
        const { ctx } = this;

        try {
            ctx.moveTo(label.sectionBorder[0].x, label.sectionBorder[0].y);
        } catch (e) {}

        label.sectionBorder.forEach((point, i) => {
            let nextPoint = label.sectionBorder[i + 1] || label.sectionBorder[0];
            Point.connectTo(ctx, nextPoint);
        });

        ctx.strokeStyle = '#c4c4c4';
        ctx.fillStyle ='#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
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