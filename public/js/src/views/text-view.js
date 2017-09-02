import View from './view';

class TextView extends View {

	getStyleValue() {
		return window.getComputedStyle(this.$text[0]).getPropertyValue('font-size');
	}

	getNumericValue(val) {
		return parseFloat(val.replace(/[^0-9\.]/g, ''));
	}

	render() {
		const content = this.props.text || this.props.content;

		// timeout before abandoning attempt to resize text
		if (!this.props.timeout) {
			this.props.timeout = 10 * 1000;
		}

		if (this.props.css) {
			this.$view.css(this.props.css);
		}

		this.$view.html(`<div class='text'>${content}</div>`);
		this.$text = this.$view.find('.text');

		if (!this.props.maxWidth) {
			return Promise.resolve();
		}

		if (this.props.resizeMinCharCount && content.length < this.props.resizeMinCharCount) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {

			const timeoutId = setTimeout(() => {
				clearInterval(intervalId);
				this.$text.css({'font-size': ''}); // reset font-size
				resolve();
			}, this.props.timeout);

			const intervalId = setInterval(() => {
				const fontSizeVal = this.getNumericValue(this.getStyleValue('font-size'));
				const textWidth = this.$text.width();

				if (!fontSizeVal) {
					// wait to we have a font-size to work with
					return;
				}

				if (textWidth && textWidth > this.props.maxWidth) {
					this.$text.css({'font-size': fontSizeVal - 5});
					return;
				}

				clearTimeout(timeoutId);
				clearInterval(intervalId);

				resolve();
			}, 100);

		})
	}
}

module.exports = TextView;
