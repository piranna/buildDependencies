const spawn = require('child_process').spawn


function depVer(dependency)
{
  return dependency+'@'+this[dependency]
}


function buildDependencies(PKG, dependenciesField, callback)
{
  // Adjust the arguments
  if(dependenciesField instanceof Function)
  {
    callback = dependenciesField
    dependenciesField = null
  }

  dependenciesField = dependenciesField || 'buildDependencies'

  // Get the build dependencies list
  var buildDependencies = PKG[dependenciesField] || []
  const devDependencies = PKG.devDependencies    || {}

  if(!buildDependencies.length || !Object.keys(devDependencies).length)
    return callback()

  buildDependencies = buildDependencies.map(depVer, devDependencies)

  // Install the build dependencies
  var finished = false

  function errorOrExit(errCode, signal)
  {
    if(finished) return
    finished = true

    callback(errCode || signal)
  }

  buildDependencies.unshift('install')

  spawn('npm', buildDependencies, {stdio: 'inherit'})
  .on('error', errorOrExit)
  .on('exit', errorOrExit)
}


module.exports = buildDependencies
