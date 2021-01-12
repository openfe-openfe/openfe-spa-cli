const path = require('path')


module.exports = {

	src: 'src',

	css: {},

	template: 'template.html',

	postcssrc: path.join(__dirname,'postcss.config.js'),

	babel: null,

	babelrc: path.join(__dirname,'babel.config.js'),

	envConf: 'config',

	portalModules: 'src/portal',

	output: 'dist',

	webport: 13000,

	configBundleWebpack: null,

	configPortalWebpack: null,

	shareLib: null,
	
	externals: null,
	
	devServer: {
		stats: {
			source: false,
			entrypoints: true,
			children: true,
			assets: false,
			colors: true,
			chunks: false,
			hash: true,
			modules: false,
			errors: true,
			errorDetails: true,
			warnings: true,
			moduleTrace: true,
			publicPath: true
		},
		host: '0.0.0.0',
		port: 3000,
		publicPath: '/',
		hot: true,
		disableHostCheck: true,
		historyApiFallback: false,
		noInfo: false,
		overlay: true,
		open: false
	}
}

