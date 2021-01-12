#!/usr/bin/env node

const rm = require('rimraf')
const path = require('path')
const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')
const portalModules = require('../lib/PortalModules')
const { errHandle } = require('../helper')

const spinner = ora(chalk.cyan.bold(' portal build....')).start()
const { configPortalWebpack = null } = require('../lib/AppConfig')
configPortalWebpack && configPortalWebpack(portalModules.portalWebpackConf)

webpack(portalModules.portalWebpackConf, (err, stats) => {
	spinner.stop()
	if(!errHandle(err, stats)){
		console.log(chalk.bold.cyan('  portal build complete.\n'))
	}
})
