const _ = require('lodash')

module.exports = class {
	constructor(imports){
		this.imports = imports || []
	}

	apply(compiler){
		compiler.hooks.compilation.tap('my-compilation', compilation => {
			const version = new Date().getTime()
			compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('my-generation', (e, t) => {
				let imports = [].concat(this.imports) 
				_.forEach(imports.reverse(), (importFile) => {
					e.assets.js.unshift(`${importFile}?v=${version}`)
				})
				t(null, e)
			})
		})
	}
}