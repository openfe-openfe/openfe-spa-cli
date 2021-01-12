const merge = require('webpack-merge')
const webpack = require('webpack')
const { resolve } = require('../helper')
const webpackBaseConf = require('./webpack.base')
const AppConf = require('../lib/AppConfig')

module.exports = merge(webpackBaseConf,{
	mode: 'development',
	devtool: false,
	output: {
		path: resolve(AppConf.src),
		filename: '[name].js',
		publicPath: '/',
		sourceMapFilename: '[name].js.map'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
})