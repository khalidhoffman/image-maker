require('es6-shim');
import $ from 'jquery';
import ChartView from './views/chart-view';
import HTMLView from './views/html-view';
import ImageView from './views/image-view';
import PDFView from './views/pdf-view';
import TextView from './views/text-view';

console.log('loaded');

window.$ = $;

/**
 * taken from https://stackoverflow.com/a/901144
 * @param {String} name - url query param name
 * @param {String} url - the full url
 * @returns {String} - the query param value
 */
var getParameterByName = function (name, url) {
	var fullUrl = url || window.location.href;
	var queryParamName = name.replace(/[\[\]]/g, '\\$&');
	var queryValueRegex = new RegExp('[?&]' + queryParamName + '(=([^&#]*)|&|#|$)');
	var results = queryValueRegex.exec(fullUrl);

	if (!results) {
		return null;
	}

	if (!results[2]) {
		return '';
	}

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

$(document).ready(function () {
	const rootEle = document.getElementById('root');
	const $root = $(rootEle);
	const imageData = JSON.parse(getParameterByName('data') || decodeURIComponent($root.data('render')));
	const imagesCount = imageData.images.length;
	let renderedCount = 0;

	console.log('ready');

	window.Chart.defaults.global.animation.duration = 0;

	// fix for zooming content to size of pdf
	$('body').width(imageData.width);

	console.log(`rendering ${imagesCount} images`);

	imageData.images.forEach((imageData, imageIndex) => {
		const imgType = imageData.type || imageData.format;
		let image;

		switch (imgType) {
			case 'bar':
			case 'horizontalBar':
			case 'pie':
			case 'doughnut':
				image = new ChartView(imageData);
				break;
			case 'pdf':
				image = new PDFView(imageData);
				break;
			case 'text':
				image = new TextView(imageData);
				break;
			case 'html':
				image = new HTMLView(imageData);
				break;
			default:
				image = new ImageView(imageData);
		}

		Promise.resolve(image.render())
			.then(() => {
				renderedCount++;
				console.log(`rendered '${image.props.id}' (${imageIndex + 1}/${imagesCount})`);
				if (renderedCount >= imagesCount) {
					console.log('all images rendered');
					$root.addClass('rendered-all');
				}
			});

		return image;
	});
});

