#!/usr/bin/env node

const chalk = require('chalk')
const bundleModules = require('../lib/BundleModules')
const Task = require('../lib/Task')
const Stats = require('../lib/Stats')
const { configBundleWebpack = null } = require('../lib/AppConfig')
configBundleWebpack && configBundleWebpack(bundleModules.bundleWebpackConf)
const _Task = new Task(bundleModules.bundleWebpackConf)

_Task.compile().then(res => {
	if(res){
		new Stats(res)
	}

	console.log(chalk.cyan.bold('  bundle build complete.\n'))
	console.log(chalk.yellow.bold(
		'  Tip: built files are meant to be served over an HTTP server.\n' +
		'  Opening index.html over file:// won\'t work.\n'
	))

})

