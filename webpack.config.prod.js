const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		index: path.resolve(__dirname, 'src', 'js', 'index.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.glsl$/,
				use: {
					loader: 'webpack-glsl-minify',
					options: {
						output: 'source',
						esModule: true,
						preserveAll: true,
					},
				},
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.glsl', '.js', '.ts', '.tsx'],
	},
};
