import loaderHTML from './loader.html';

export default class Loader {
    constructor (className) {
        const element = document.createElement('div');
        element.className = className;
        element.innerHTML = loaderHTML;

        this.element = element;
    }

    open () {
        const { element } = this;

        element.classList.add('open');
        element.style.display = 'block';

        setTimeout(function () {
            element.style.opacity = 1;
        })
    }

    close () {
        const { element } = this;

        element.classList.remove('open');
        element.style.opacity = 0;

        setTimeout(function () {
            element.style.display = 'none';
        }, 300)
    }

    toggle () {
        if (this.element.classList.contains('open')) this.close();
        else this.open();
    }
}