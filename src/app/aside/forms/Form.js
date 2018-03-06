export default class Form {
    constructor () {
        this.wrapper = document.getElementById('aside').querySelector('.aside_inner');
    }

    setHTML (HTML) {
        this.wrapper.innerHTML = HTML;
    }

    changeFormTo (nextForm) {
        const { wrapper } = this;

        new Promise(resolve => {
            wrapper.style.opacity = 0;

            setTimeout(function () {
                wrapper.innerHTML = '';
                resolve();
            }, 300)
        }).then(() => {
            wrapper.style.opacity = 1;
            new nextForm();
        })
    }
}