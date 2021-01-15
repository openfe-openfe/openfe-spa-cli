const merge = require('webpack-merge')
const webpackBaseConf = require('./webpack.base')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
module.exports = merge(webpackBaseConf, {
	mode: 'production',
	output: {
		filename: '[name].js',
		publicPath: '../'
	},
	plugins: [	
		new FileManagerPlugin({
            events:{
                onEnd: {
                    　　 delete: [
                       　　  './dist/innermanage.zip',
                   　　  ],
                    　　 archive: [
                      　　   {source: './dist', destination: './dist/innermanage.zip'},
                     　　]
                　　 }
            }　　   
        }),
		new OptimizeCSSPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: {
				safe: true,
				discardComments: { removeAll: true }
			},
			canPrint: true
		})
	]
})