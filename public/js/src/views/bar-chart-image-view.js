import React from 'react';
import {BarChart} from 'react-d3-basic';
import _ from 'lodash';

class PieImageView extends React.Component {

	render() {
		const imageProps = this.props;
		const width = .75 * _.get(this.props, 'image.css.width', 128);
		const height = .75 * _.get(this.props, 'image.css.height', 128);
		const labelKey = imageProps.labelKey;
		const valueKey = imageProps.valueKey;

		const chartProps = _.defaultsDeep({}, imageProps.chartProps, {
			width,
			height,
			x: dataCategory => dataCategory[labelKey],
			xScale: 'ordinal',
			yTicks: [10],
			chartSeries: imageProps.chartProps.data.map(dataCategory => {
				return {
					field: valueKey,
					name: dataCategory[labelKey]
				}
			}),
		});

		return (
			<div id={this.props.image.id} className={this.props.className} style={this.props.style}>
				<BarChart {...chartProps} />
			</div>);
	}
}

module.exports = PieImageView;
