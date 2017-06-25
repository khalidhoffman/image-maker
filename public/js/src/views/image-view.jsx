import React from 'react';
import Image from 'image';
import PieChartImageView from './donut-chart-image-view';
import BarChartImageView from './bar-chart-image-view';
import {PieChart} from 'react-d3-basic';
import _ from 'lodash';

class ImageView extends React.Component {
	constructor(props) {
		super(props);
		this.image = props.image || new Image(props);
		this.images = props.images || props.children || [];
		this.styles = props.styles || [];

		if (props.id) {
			this.image.id = props.id;
		}

		$('head').append(this.styles.map(styleProps => {
			return $('<link rel="stylesheet"/>').attr('href', styleProps.href);
		}))
	}

	render() {
		const styles = _.defaults(this.image.css, {zIndex: this.props.root ? 0 : 1 + parseInt(this.props.index || 0)});
		let className = 'image';

		if (this.props.root) {
			className += ' root';
		}

		if (this.props.format === 'donut') {
			return <PieChartImageView {...this.props} className={className} image={this.image} style={styles}/>;
		}

		if (this.props.format === 'bar') {
			return <BarChartImageView {...this.props} className={className} image={this.image} style={styles}/>;
		}

		return (
			<div id={this.image.id} className={className} style={styles}>
				{this.images.map((childImageProps, idx) => {
					return <ImageView {...childImageProps} id={`${this.image.id}-${idx}`} index={idx} key={idx}/>
				})}
			</div>);
	}
}

module.exports = ImageView;
