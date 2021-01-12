#!/usr/bin/env node

const { resolve } = require('../helper')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const rm = require('rimraf')
const archiver = require('archiver')
const BaseModules = require('../lib/BaseModules')
const input = resolve(BaseModules.appConf.output)
const output = resolve(BaseModules.appConf.output, '_zips')

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
	const bundle = fs.readdirSync(input)
	mkdirsSync(output)
	bundle.forEach(item => {
		if(/^\./.test(item) || /^\_/.test(item)){ return true }
		//生成_archive对象，打包类型为zip
		const arch = archiver('zip')
		//创建一最终打包文件的输出流
		const stream = fs.createWriteStream(`${output}/${item}.zip`)

		stream.on('close', () => {
			let size =  arch.pointer() / 1024
			size = size > 1024 ? (size  / 1024).toFixed(2) + 'MB' : size.toFixed(2) + 'KB'
			console.log(chalk.yellow.bold(`${item}.zip => ${size}`))
		})
		// //将打包对象与输出流关联
		arch.pipe(stream)
		arch.directory(`${input}/${item}/`, `${item}`)
		arch.finalize()
	})
})
