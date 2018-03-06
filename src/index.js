import 'jquery';
import 'materialize-css/dist/js/materialize.min';

import './index.scss';
import appLoad from './app';

import mainLoader from './app/loader/mainLoader';

mainLoader.open();
window.addEventListener('load', appLoad);