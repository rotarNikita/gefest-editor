import Flat from './Flat';
import canvasSave from './canvasSave';
import Functionality from './functionality';
import Point from './Point';
import toolbar from '../../header/toolbar/toolbar';

export class CanvasDraw extends Functionality {
    constructor () {
        super();

        this.canvas = document.getElementById('canvas-draw');
        this.ctx = this.canvas.getContext('2d');

        this.options = {
            draw: false,
            protection: true,
            fillStyle: '#000',
            strokeStyle: '#000',
            lineWidth: 3
        };

        this.position = {
            x: this.canvas.parentNode.offsetLeft,
            y: this.canvas.parentNode.offsetTop
        };

        this.cursor = {
            startX: undefined,
            startY: undefined,
            x: undefined,
            y: undefined
        };

        window.addEventListener('mousedown', this.drawStart.bind(this));
        window.addEventListener('mousemove', this.drawing.bind(this));
        window.addEventListener('mouseup', this.drawEnd.bind(this));
        window.addEventListener('contextmenu', (event) => event.preventDefault());

        this.points = [];

        this.fontSize = 22;

        this.label = {
            title: undefined,
            description: undefined,
            descriptionOffset: undefined,
            sale: false,
            position: {
                x: 0,
                y: this.fontSize
            }
        }
    }

    changeLabel (label) {
        this.label.title = label.title;
        this.label.description = label.description;
        this.paintAndConnectPoints();
    }

    addProtection () {
        this.options.protection = true;
        toolbar.addProtection();
    }

    delProtection () {
        this.options.protection = false;
        toolbar.delProtection();
    }

    resize (size) {
        this.clearCanvas();

        this.canvas.width = size.width;
        this.canvas.height = size.height;

        this.fontSize = 22 / size.naturalWidth * size.width;

        canvasSave.resize(size.width, size.height);
    }

    drawing (event) {
        if (this.options.draw) {
            this.cursorPosition(event);

            this.f_draw(event);

            this.paintAndConnectPoints();
        }
    }

    static hexToRgbA (hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');

            if (c.length === 3) {
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }

            c = '0x' + c.join('');

            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
        }
        throw new Error('Bad Hex');
    }

    static rgbaToHex (rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    cursorPosition (event) {
        const { cursor, position } = this;

        cursor.x = event.pageX - position.x;
        cursor.y = event.pageY - position.y;
    }

    clearCanvas () {
        const { canvas, ctx } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    paintAndConnectPoints () {
        const { ctx, points, options} = this;

        this.clearCanvas();
        ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            points[i].paint(ctx);
            ctx.fillStyle = options.strokeStyle;
            ctx.fill();
        }

        try {
            ctx.moveTo(points[0].x, points[0].y);
        } catch (e) {}

        for (let i = 0; i < points.length; i++) {
            let nextPoint = points[i + 1] || points[0];
            Point.connectTo(ctx, nextPoint);
            ctx.strokeStyle = options.strokeStyle;
            ctx.lineWidth = options.lineWidth;
            // ctx.stroke();
        }

        ctx.fillStyle = options.fillStyle;
        ctx.fill();

        const { label, fontSize } = this;

        if (!label.sale) {
            let titleWidth = null;

            if (label.title) {
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = '#000000';
                ctx.fillText(label.title, label.position.x, label.position.y);
                titleWidth = ctx.measureText(label.title).width;
            }

            if (label.description) {
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = '#000000';

                label.descriptionOffset = titleWidth ? (titleWidth - ctx.measureText(label.description).width) / 2 : 0;

                ctx.fillText(label.description,
                    label.position.x + label.descriptionOffset,
                    label.position.y + (titleWidth ? fontSize : 0));
            }
        } else {
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = 'red';
            ctx.fillText('продано', label.position.x, label.position.y);
        }
    }

    drawStart (event) {
        if (!this.options.protection) {
            const { cursor, options, canvas, position } = this;

            cursor.startX = event.pageX - position.x;
            cursor.startY = event.pageY - position.y;

            if (cursor.startX >= 0 &&
                cursor.startX <= canvas.offsetWidth &&
                cursor.startY >= 0 &&
                cursor.startY <= canvas.offsetWidth) {
                options.draw = true;
                this.f_drawStart(event);
            }
        }
    }

    drawEnd (event) {
        if (this.options.draw) {
            this.f_drawEnd(event);

            this.options.draw = false;
            Flat.selected.points = this.points;
            Flat.selected.label = this.label;
        }
    }
}

const canvasDraw = new CanvasDraw();

export default canvasDraw;