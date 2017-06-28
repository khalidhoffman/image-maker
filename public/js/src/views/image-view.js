import View from './view';

class ImageView extends View {
	render() {
		this.$view.css(this.props.css);
	}
}

module.exports = ImageView;