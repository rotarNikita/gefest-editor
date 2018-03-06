import toolbarHTML from './toolbar.html';
import canvasDraw from '../../main/canvas/canvasDraw';

class Toolbar {
    constructor () {
        document.getElementById('header').innerHTML = toolbarHTML;

        this.toolbarDOM = document.getElementById('toolbar');
        this.toolsDOM = this.toolbarDOM.querySelectorAll('.toolbar_item');

        const self = this;
        Array.prototype.forEach.call(this.toolsDOM, function (item) {
            item.addEventListener('click', self.changeTool.bind(self, item))
        });

        setTimeout(function () {
            self.toolsDOM[0].click();
        })
    }

    changeTool (item) {
        const tool = item.dataset.tool;

        Array.prototype.forEach.call(this.toolsDOM, function (item) {
            item.classList.remove('active')
        });
        item.classList.add('active');

        canvasDraw.syncTool(tool);
    }

    delProtection () {
        this.protection = false;
        this.toolbarDOM.classList.remove('protection');
    }

    addProtection () {
        this.protection = true;
        this.toolbarDOM.classList.add('protection');
    }
}

const toolbar = new Toolbar();

export default toolbar;