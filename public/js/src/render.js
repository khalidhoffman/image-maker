require('es6-shim');
import request from 'superagent';
import $ from 'jquery';
import ChartView from './views/chart-view';
import ImageView from './views/image-view';
import HTMLView from './views/html-view';

window.$ = $;


$(document).ready(function(){
	const rootEle = document.getElementById('root');
	const $root = $(rootEle);
	const imageId = $root.attr('data-image-id');

	window.Chart.defaults.global.animation.duration = 0;

	request.get(`/image/${imageId}/params`)
		.then((response) => {
			const images = response.body.images.forEach(imageData => {
				const imgType = imageData.type || imageData.format;
				let image;

				switch(imgType){
					case 'bar':
					case 'horizontalBar':
					case 'pie':
					case 'doughnut':
						image = new ChartView(imageData);
						break;
                                        case 'html':
                                                image = new HTMLView(imageData);
                                                break;
					default:
						image = new ImageView(imageData);
				}

				image.render();

				return image;
			});

			$root.data('image-maker', images);
		})
		.catch((err) => {
			console.error(err);
			$root.html(`Error: ${err.toString()}`)
		})
});

