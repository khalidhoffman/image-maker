import View from './view';

class HTMLView extends View {
	render() {
		if (this.props.css) {
			this.$view.css(this.props.css);
		}
		this.$view.html(this.props.html);
	}
}

module.exports = HTMLView;
