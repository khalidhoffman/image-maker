import HTML from 'chart.js';
import View from './view';

class HTMLView extends View {
	render(){
		this.$view.css(this.props.css);
                this.$view.html(this.props.html);
	}
}

module.exports = HTMLView;
