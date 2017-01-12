#!/usr/bin/env node

const buildDependencies = require('.')


buildDependencies(require('./package.json'), process.argv[2], process.exit)
