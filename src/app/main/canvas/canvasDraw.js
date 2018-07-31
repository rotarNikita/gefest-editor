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
        this.fontSize2 = 12;
        this.fontSize3 = 10;

        this.label = {
            title: '',
            description: '',
            descriptionOffset: '',
            sale: false,
            section: false,
            sectionBorder: [],
            position: {
                x: 0,
                y: this.fontSize
            }
        };

        this.SECTION_LABEL = {
            width: 130,
            height: 20,
            triangle: 7,
            paddingLeft: 10,
            paddingTop: 20
        };
    }

    changeLabel (label) {
        this.label.title = label.title;
        this.label.description = label.description;
        this.label.sale = label.sale;
        this.label.section = label.section;
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
        this.fontSize2 = 12 / size.naturalWidth * size.width;
        this.fontSize3 = 10 / size.naturalWidth * size.width;

        this.SECTION_LABEL = {
            width: 130 / size.naturalWidth * size.width,
            height: 20 / size.naturalWidth * size.width,
            triangle: 7 / size.naturalWidth * size.width,
            paddingLeft: 10 / size.naturalWidth * size.width,
            paddingTop: 20 / size.naturalWidth * size.width,
        };

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

        ctx.closePath();
        ctx.beginPath();

        const { label, fontSize, fontSize2, fontSize3 } = this;

        if (label.section && label.title) {
            this.drawSectionLabel();
            
            ctx.font = `700 ${fontSize2}px Arial`;
            ctx.fillStyle = '#000000';
            ctx.fillText(label.title, label.position.x, label.position.y);
            
            ctx.font = `${fontSize3}px Arial`;
            ctx.fillText('планировки', label.position.x, label.position.y + fontSize3 * 1.1);
            ctx.fillText('типового этажа', label.position.x, label.position.y + fontSize3 * 2.2);
        } else if (!label.sale) {
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
                    label.position.y + (titleWidth ? fontSize * 1.1 : 0));
            }
        } else {
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = 'red';
            ctx.fillText('продано', label.position.x, label.position.y);
        }
    }
    
    drawSectionLabel () {
        const { ctx, label, SECTION_LABEL } = this;
        const { x, y } = label.position;

        label.sectionBorder = [];
        label.sectionBorder.push(new Point(x - SECTION_LABEL.paddingLeft, y - SECTION_LABEL.paddingTop));
        label.sectionBorder.push(new Point(label.sectionBorder[0].x + SECTION_LABEL.width, label.sectionBorder[0].y));
        label.sectionBorder.push(new Point(label.sectionBorder[1].x, label.sectionBorder[1].y + SECTION_LABEL.height));
        label.sectionBorder.push(new Point(label.sectionBorder[2].x + SECTION_LABEL.triangle, label.sectionBorder[2].y + SECTION_LABEL.triangle));
        label.sectionBorder.push(new Point(label.sectionBorder[3].x - SECTION_LABEL.triangle, label.sectionBorder[3].y + SECTION_LABEL.triangle));
        label.sectionBorder.push(new Point(label.sectionBorder[4].x, label.sectionBorder[4].y + SECTION_LABEL.height));
        label.sectionBorder.push(new Point(label.sectionBorder[5].x - SECTION_LABEL.width, label.sectionBorder[5].y));

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