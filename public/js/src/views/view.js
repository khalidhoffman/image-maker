import $ from 'jquery';

class View {
	constructor(props) {
		this.$ = $;
		this.$root = $('#root');
		this.$view = $('<div></div>');
		this.props = props;

		this.$view.attr({'id': this.props.id});

		if (this.props.className) {
			this.$view.addClass(this.props.className);
		}

		this.$root.append(this.$view);
	}
}

module.exports = View;
