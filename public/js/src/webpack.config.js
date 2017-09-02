const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: path.join(__dirname, './render'),
	output: {
		filename: 'render.js',
		path: path.resolve(__dirname, '../')
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {presets: ['es2017', 'es2015']}
				}
			}
		]
	},
	resolve: {
		modules: [__dirname, path.join(process.cwd(), './node_modules'), path.join(process.cwd(), './lib')],
		alias: {image: path.join(process.cwd(), './lib/image.js')},
		extensions: ['.js', '.json']
	}
};
