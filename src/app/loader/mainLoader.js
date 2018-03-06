import Loader from './Loader';

const mainLoader = new Loader('loader');
document.body.appendChild(mainLoader.element);

export default mainLoader;