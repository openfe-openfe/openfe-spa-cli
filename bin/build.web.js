#!/usr/bin/env node

let chalk = require('chalk')
let express = require('express')
let app = express()
let resolve = require('../helper').resolve
let AppConf = require('../lib/AppConfig')
let port = AppConf.webport

console.log('> Starting web server...')
app.use('/', express.static(resolve(AppConf.output)))
app.listen(port)
console.log('> Listening at http://localhost:' + port + '...\n')
console.log(chalk.green('  Done Listen successfully\n'))
