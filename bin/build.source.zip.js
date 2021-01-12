#!/usr/bin/env node

const { resolve } = require('../helper')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const rm = require('rimraf')
const archiver = require('archiver')
const BaseModules = require('../lib/BaseModules')
const input = resolve(BaseModules.appConf.src, 'modules')
const output = resolve(BaseModules.appConf.output, '_sourceZip')

function mkdirsSync(dirname){
	if(fs.existsSync(dirname)){
		return true
	}else{
		if(mkdirsSync(path.dirname(dirname))){
			fs.mkdirSync(dirname)
			return true
		}
	}
}


rm(output, err => {
	mkdirsSync(output)
	fs.readdirSync(input).forEach(bundleName => {
		const arch = archiver('zip')
		const stream = fs.createWriteStream(`${output}/${bundleName}.zip`)
		stream.on('close', () => {
			let size =  arch.pointer() / 1024
			size = size > 1024 ? (size  / 1024).toFixed(2) + 'MB' : size.toFixed(2) + 'KB'
			console.log(chalk.yellow.bold(`${bundleName}.zip => ${size}`))
		})
		arch.pipe(stream)
		arch.directory(`${input}/${bundleName}`, `${bundleName}`)
		arch.finalize()
	})
})
