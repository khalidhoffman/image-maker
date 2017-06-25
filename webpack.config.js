const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './public/js/src/render',
	output: {
		filename: 'render.js',
		path: path.resolve(process.cwd(), './public/js/')
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2017', 'es2015', 'react']
					}
				},
			}
		]
	},
	resolve: {
		modules: [__dirname, './lib', './node_modules/', './public/js/src'],
		alias: {
			image: path.join(__dirname, './lib/image.js')
		},
		extensions: ['.js', '.json', '.jsx']
	},
	plugins: [
		new webpack.ProvidePlugin({React: 'react'}),
		new webpack.DefinePlugin({"global.GENTLY": false})
	]
};