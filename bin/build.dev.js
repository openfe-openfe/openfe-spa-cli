#!/usr/bin/env node

const { getIPAdress } = require('../helper')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { devServer, configBundleWebpack = null, configPortalWebpack = null } = require('../lib/AppConfig')
const bundleModules = require('../lib/BundleModules')
const portalModules = require('../lib/PortalModules')
configBundleWebpack && configBundleWebpack(bundleModules.bundleWebpackConf)
configPortalWebpack && configPortalWebpack(portalModules.portalWebpackConf)

const compiler = webpack([
	...portalModules.portalWebpackConf,
	...bundleModules.bundleWebpackConf
])

const server = new WebpackDevServer(compiler, devServer)
console.log('\n'+chalk.bold.yellow('  Work address: ' + getIPAdress())+'\n')
server.listen(devServer.port, devServer.host)

