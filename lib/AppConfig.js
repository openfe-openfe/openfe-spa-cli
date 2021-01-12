const { resolve, command } = require('../helper')
const merge = require('webpack-merge')

module.exports = new class {
	constructor(){
		const c = command()
		const DefaultAppConf = require('../app.config')
		try{
			const appConf = require(resolve(c.appConfig || 'app.config'))
			return merge({}, DefaultAppConf, appConf)
		}catch(e){
			return DefaultAppConf
		}
	}
}