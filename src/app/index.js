import imageLoadingForm from './aside/forms/ImageLoadingForm';
import mainLoader from './loader/mainLoader';
import canvasDraw from './main/canvas/canvasDraw';

export default function appLoad () {
    new imageLoadingForm();
    canvasDraw.addProtection();
    mainLoader.close();
}