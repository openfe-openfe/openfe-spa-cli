const { table, getBorderCharacters } = require('table')
const { errHandle } = require('../helper')
const chalk = require('chalk')

module.exports = class {
	constructor(stats){
		this._table(stats)
	}

	_table(stats){
		const data = this._createBundleInfo(stats)
		const _table = table(data, {columnDefault: {width:16}, border: getBorderCharacters('ramac')})
		console.log(chalk.gray.bold('  Webpack Version: ^4.32.2; author: cheetah@belink.com\n'))
		console.log(chalk.cyan.bold(_table))
	}

	_createBundleState(item){
		let size = 0
		const { stats, bundleName } = item
		for(let i in stats.compilation.assets){
			size += stats.compilation.assets[i].size()
		}
		return [bundleName, 'success', stats.endTime - stats.startTime, (size/1024).toFixed(2)]
	}

	_createBundleInfo(stats){
		const _stats = [['bundle', 'state', 'runtime(ms)','size(kb)']]
		stats.forEach(item => {
			if(errHandle(item.err, item.stats, false)){
				_stats.push([item.bundleName, 'fail', '-', '-'])
			}else{
				_stats.push(this._createBundleState(item))
			}
		})

		return _stats
	}
}