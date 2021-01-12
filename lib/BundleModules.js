const { resolve } = require('../helper')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BaseModules = require('./BaseModules')
const _ = require('lodash')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = new class {
	constructor(){
		this.bundleMap = this._createBundleMap()
		this.bundleWebpackConf = this._createBundleWebpackConf()
	}

	_createBundleConf(){
		const glob = require('glob')
		const { modules } = BaseModules.command
		const { src } = BaseModules.appConf
		// 同步读取modules里面conf文件，拿到serverpath
		return modules.length <=0 ? 
		glob.sync(resolve(src, 'modules', '*', 'conf.js')) :
		modules.map(dir => resolve(src, 'modules', dir,'conf.js'))
	}

	_createBundleMap(){
		const bundleMap = this._createBundleConf().reduce((pre, cur) => {
			const { dir } = path.parse(cur)
			const bundleName = path.basename(dir)
			pre[bundleName] = require(cur)
			return pre
		}, {})
		BaseModules.command.modules = Object.keys(bundleMap)
		return bundleMap
	}

	_initializeEnv (moduleConfig, moduleName, defaultPublic) {
		let publicPath = moduleConfig.publicPath || defaultPublic
		let envConfig = moduleConfig.envConfig || {}
		let envInfo = BaseModules.userEnvConf || {}
		let moduleEnvInfo = envInfo[moduleName] || {}

		//环境path
		let envPublicPath = moduleEnvInfo.PUBLIC_PATH || envConfig.PUBLIC_PATH

		//根据环境信息配置
		publicPath = envPublicPath ? JSON.parse(envPublicPath) : publicPath
		//覆盖原理
		envConfig = Object.assign({}, envConfig, moduleEnvInfo)

		return {publicPath, envConfig}
	}

	_createBundleWebpackConf(){
		const { output, src, externals = {} } = BaseModules.appConf
		const {plugins, ...other} = BaseModules.baseWebackConf

		return _.transform(this.bundleMap, (result, value, key) => {

			//环境信息
			const {publicPath, envConfig} = this._initializeEnv(value, key, `/${key}/`)
			const rules = BaseModules._createLoaders(value.cssLoaderOptions || {})
			const pluginOptions = value.pluginOptions || {}
			const alias = value.alias || {}

			const conf = merge({},
				other,
				{
					externals: externals,
					entry: {
						'main': resolve(src, 'modules', key, 'main')
					},
					output: {
						path: resolve(output, publicPath),
						publicPath: publicPath,
						filename: '[name].js',
						chunkFilename: 'js/[name].[chunkhash:8].js',
						libraryExport: 'default',
						jsonpFunction: `webpackJsonp-${key}`
					},
					module:{ rules: rules },
					resolve: {
						alias: {
							'@m': resolve(src, 'modules', key),
							...alias
						}
					},
					plugins: [
						...plugins,
						new webpack.DefinePlugin({
							'process.env.MODULE_NAME': JSON.stringify(key),
							...envConfig
						}),
						...(pluginOptions.copy ? [new CopyWebpackPlugin(pluginOptions.copy || [])] : [])
					]
				}
			)

			result.push(conf)

		}, [])
	}


	
}