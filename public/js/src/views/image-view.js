import View from './view';

class ImageView extends View {

	render() {
		this.$view.html(`<img src='${this.props.src}'/>`);
		this.$image = this.$view.find('img');

		if (this.props.css) {
			this.$view.css(this.props.css);
		}

		return new Promise((resolve) => {
			this.$image.on('load', () => {
				console.log(`image '${this.props.id}' loaded`);
				resolve();
			});
		})
	}
}

module.exports = ImageView;
