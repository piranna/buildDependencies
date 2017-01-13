#!/usr/bin/env node

const resolve = require('path').resolve

const buildDependencies = require('.')


const PKG = require(resolve('package.json'))


buildDependencies(PKG, process.argv[2], process.argv.slice(3), process.exit)
