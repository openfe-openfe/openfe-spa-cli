const { resolve, command } = require('../helper')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const _ = require('lodash')
const fs = require('fs')


module.exports = new class {
	constructor(){
		//命令行内的用户参数
		this.command = command()
		//项目配置文件
		this.appConf = require('./AppConfig')
		//项目环境文件, dev, prod, sit, uat
		this.userEnvConf = this._createUserEnvConf()
		//脚手架内基础配置 dev, prod
		this.baseWebackConf = this._createWebpackBaseConf()
	}
	// 拿到项目跟目录config配置信息
	_createUserEnvConf(){
		const { env } = this.command
		const { envConf } = this.appConf
		let envFile = resolve(envConf,`${env}.env.js`)
		return fs.existsSync(envFile) ? require(envFile) : {}
	}

	_createWebpackBaseConf(){
		const { platform, debug, mock } = this.command
		const webpackEnvConf = require(`../webpackConf/webpack.${this.command.env == 'dev' ? 'dev' : 'prod'}`)
		return merge(
			{},
			webpackEnvConf,
			{
				module:{ noParse: [/\.min\.js$/] },
				plugins: [
					new webpack.DefinePlugin({
						'process.env.PLATFORM': JSON.stringify(platform),
						'process.env.DEBUG': JSON.stringify(!!debug),
						'process.env.MOCK': JSON.stringify(!!mock)
					})
				]
			}
		)
	}

	_createLoaders(cssLoaderOptions = {}){
		const { babelrc, postcssrc, src } = this.appConf
		const { babel = {} } = this.appConf
		const jsLoader = merge({
			test: /\.js$/,
			use: [{loader: 'babel-loader?cacheDirectory',
			options: require(resolve(babelrc)) }],
			exclude: /\.min\.js$/,
			include: [resolve(src), resolve('npm_modules'), resolve('node_modules/@ynet')]
		}, babel || {})
		const cssLoader = [
			{ loader: 'css-loader', options: { sourceMap: false } },
			{ loader: 'postcss-loader', options: require(resolve(postcssrc))}
		]
		const generateSassResourceLoader = () => {
			const use = [
				...cssLoader,
				'sass-loader'
			]

			const sassOptions = cssLoaderOptions['scss'] || cssLoaderOptions['sass']
			if(sassOptions){
				use.push({
					loader: 'sass-resources-loader',
					options: sassOptions
				})
			}

			return [{loader:'vue-style-loader',options:{singleton:true}}].concat(use)
		}
		const generateLoaders = (() => {

			const loaders = loader => {
				const use = [...cssLoader]
				if(loader){
					use.push({
						loader: loader + '-loader',
						options: merge({sourceMap: false}, cssLoaderOptions[loader] || {})
					})
				}
				return [{loader:'vue-style-loader',options:{singleton:true}}].concat(use)
			}

			return {
				css: loaders(),
				less: loaders('less'),
				sass: generateSassResourceLoader(),
				scss: generateSassResourceLoader(),
				styl: loaders('stylus'),
				stylus: loaders('stylus')
			}

		})()
		const output = [
			{ test: /\.vue$/, use: [{loader: 'vue-loader' }] },
			{
				test: /\.(png|jpe?g|gif)$/,
				use({resourceQuery}){
					return resourceQuery === '?base64' ? 
					{loader:'url-loader',options:{limit:100000}} : 
					{loader: 'file-loader',options: {name: 'img/[name].[contenthash:7].[ext]'}}
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: [{loader:'file-loader',options:{name: 'font/[name].[contenthash:7].[ext]'}}]
			},
			{
				test: /\.(svg)(\?.*)?$/,
				use: [{loader:'file-loader',options:{name: 'svg/[name].[contenthash:7].[ext]'}}]
			}
		]
		for(let extension in generateLoaders){
			const use = generateLoaders[extension]
			output.push({
				test: new RegExp('\\.' + extension + '$'),
				use
			})
		}
		return [jsLoader, ...output]
	}

}



