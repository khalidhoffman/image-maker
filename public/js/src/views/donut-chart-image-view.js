import React from 'react';
import {PieChart} from 'react-d3-basic';
import _ from 'lodash';

class PieImageView extends React.Component {

	render(){
		const imageProps = this.props;
		const width = .75 * _.get(this.props, 'image.css.width', 128);
		const height = .75 * _.get(this.props, 'image.css.height', 128);
		const radius = Math.min(width, height) / 2;
		const labelKey = imageProps.labelKey;
		const valueKey = imageProps.valueKey;

		const chartProps = _.defaultsDeep({}, imageProps.chartProps, {
			width,
			height,
			name: dataCategory => dataCategory[labelKey],
			value: dataCategory => dataCategory[valueKey],
			innerRadius: .5 * radius,
			chartSeries : imageProps.chartProps.data.map(dataCategory => {
				return {
					field: dataCategory[labelKey],
					name: dataCategory[labelKey]
				}
			})
		});

		return (
			<div id={this.props.image.id} className={this.props.className} style={this.props.style}>
				<PieChart {...chartProps} />
			</div>);
	}
}

module.exports = PieImageView;
