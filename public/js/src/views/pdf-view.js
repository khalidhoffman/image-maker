import PDF from 'pdfjs-dist';
import View from './view';

class ImageView extends View {
	constructor() {
		// eslint-disable-next-line prefer-rest-params
		super(...arguments);
		this.pdfReader = window.PDFJS || PDF || false;
	}

	render() {
		var canvasId = `canvas-${this.props.id}`;

		this.$view.html(`<canvas id='${canvasId}'/>`);
		this.$canvas = this.$view.find(`#${canvasId}`);

		if (this.props.css) {
			this.$view.css(this.props.css);
		}

		return this.pdfReader.getDocument(this.props.src)
			.then((pdf) => pdf.getPage(1))
			.then((page) => {
				console.log('rendering pdf');
				var baseViewport = page.getViewport(1);
				var scale = this.props.scale || (this.props.width / baseViewport.width);
				var viewport = page.getViewport(scale);
				var canvas = this.$canvas[0];
				var context = canvas.getContext('2d');


				canvas.height = viewport.height;
				canvas.width = viewport.width;


				return page.render({
					canvasContext: context,
					viewport: viewport
				});
			});
	}
}

module.exports = ImageView;
