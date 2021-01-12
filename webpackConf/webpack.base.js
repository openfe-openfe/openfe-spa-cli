const VueLoaderPlugin = require('vue-loader/lib/plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { resolve } = require('../helper')
const AppConf = require('../lib/AppConfig')

module.exports = {
	optimization: {
		
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.scss', '.less', '.css', '.styl', '.stylus'],
		alias: {
			'@': resolve(AppConf.src),
			'vue$': 'vue/dist/vue.runtime.min.js'
		}
	},
	plugins: [
		new LodashModuleReplacementPlugin(),
		new VueLoaderPlugin()
	]
}