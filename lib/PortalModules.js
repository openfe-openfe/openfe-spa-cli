const { resolve } = require('../helper')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BaseModules = require('./BaseModules') 
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoInjectJS = require('../plugins/autoInjectJS')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = new class {
	constructor(){
		this.portalConfig = require(resolve(BaseModules.appConf.portalModules, 'conf.js'))
		this.portalWebpackConf = this._createPortalWebpackConf()
	}

	joinPath (...args) {
		let paths = []
		args.forEach((arg, index) => {
			let argsrc = arg
			if(index != 0){
				argsrc = arg.replace(/^([\/\\])/, '')
			}
			paths.push(argsrc.replace(/([\/\\])$/, ''))
		})
		return paths.join('/')
	}

	_initializeImports (imports) {
		//引入模块地址
		let envInfo = BaseModules.userEnvConf || {}
		let noModuleRegExp = /[\/\\]/

		return _.map(imports, (importModule) => {

			if(!noModuleRegExp.test(importModule)){
				//内部模块 需要通过环境设置的部署path而变化
				let publicPath = (envInfo[importModule] || {}).PUBLIC_PATH
				importModule = publicPath ? JSON.parse(publicPath) : `/${importModule}/`
			}

			//拼接加载模块地址
			return this.joinPath(importModule, 'main.js')
		})
	}

	_initializeEnv (moduleConfig, moduleName, defaultPublic) {
		let publicPath = moduleConfig.publicPath || defaultPublic
		let envConfig = moduleConfig.envConfig || {}
		let envInfo = BaseModules.userEnvConf || {}
		let moduleEnvInfo = envInfo[moduleName] || {}
		const { env } = BaseModules.command

		//环境path
		let envPublicPath = moduleEnvInfo.PUBLIC_PATH || envConfig.PUBLIC_PATH

		//根据环境信息配置
		publicPath = envPublicPath ? JSON.parse(envPublicPath) : publicPath
		//覆盖原理
		envConfig = Object.assign({}, envConfig, moduleEnvInfo)

		//开发环境使用默认路径
		if(env == 'dev'){
			publicPath = defaultPublic
		}

		return {publicPath, envConfig}
	}

	_createPortalWebpackConf(){
		const { env } = BaseModules.command
		const { output, template, shareLib = null, externals = {} } = BaseModules.appConf
		const minify = env === 'dev' ? Object.create(null) : {
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			minifyJS: true, minifyCSS: true
		}
		const {plugins, ...other} = BaseModules.baseWebackConf
		//自动导入模块
		const imports = this._initializeImports(this.portalConfig.imports)

		//环境信息
		const {publicPath, envConfig} = this._initializeEnv(this.portalConfig, 'portal', '/')
		const rules = BaseModules._createLoaders(this.portalConfig.cssLoaderOptions || {})
		const pluginOptions = this.portalConfig.pluginOptions || {}
		const alias = this.portalConfig.alias || {}
		const webpackLib = []

		//支持公共库抽离 优化构建
		if(shareLib){
			//自动公共vue
			imports.unshift(this.joinPath(publicPath, 'shareLib.js'))
			webpackLib.push(merge(
				{},
				other,
				{
					entry: { 'shareLib': resolve(shareLib) },
					output: {
						path: resolve(output, publicPath),
						publicPath: publicPath,
						filename: '[name].js',
						chunkFilename: '[name].js'
					},
					module:{ rules: rules },
					plugins: [
						...plugins
					]
				}
			))
		}
		
		return [
			...webpackLib,
			merge(
				{},
				other,
				{
					externals: externals,
					entry: {
						'main': resolve(BaseModules.appConf.portalModules, 'main')
					},
					output: {
						path: resolve(output, publicPath),
						publicPath: publicPath,
						filename: 'js/[name].[hash:8].js',
						chunkFilename: 'js/[name].[chunkhash:8].js'
					},
					module:{ rules: rules },
					resolve: {
						alias: {
							'@m': resolve(BaseModules.appConf.portalModules),
							...alias
						}
					},
					plugins: [
						...plugins,
						new webpack.DefinePlugin({
							'process.env.MODULE_NAME': JSON.stringify('_PORTAL_'),
							...envConfig
						}),
						new HtmlWebpackPlugin({
							minify, chunks: ['main'],
							chunksSortMode: 'manual', template: resolve(BaseModules.appConf.portalModules, template),
							filename: `index.html`
						}),
						new autoInjectJS(imports),
						...(pluginOptions.copy ? [new CopyWebpackPlugin(pluginOptions.copy || [])] : [])
					]
				}
			)
		]
	}

}



