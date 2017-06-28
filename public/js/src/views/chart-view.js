import Chart from 'chart.js';
import View from './view';

class ChartView extends View {
	render(){
		this.$view.css(this.props.css);
                this.$canvas = this.$view.html('<canvas />').find('canvas');
		this.chart = new Chart(this.$canvas[0], this.props);
	}
}

module.exports = ChartView;
