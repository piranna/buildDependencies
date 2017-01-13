const spawn = require('child_process').spawn


function depVer(dependency)
{
  return dependency+'@'+this[dependency]
}


function buildDependencies(PKG, dependenciesField, argv, callback)
{
  // Adjust the arguments
  if(argv instanceof Array || argv instanceof Function)
  {
    callback = argv
    argv = dependenciesField
    dependenciesField = null
  }

  if(argv instanceof Function)
  {
    callback = argv
    argv = null
  }

  dependenciesField = dependenciesField || 'buildDependencies'
  argv = argv || []

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
  Array.prototype.push.apply(buildDependencies, argv)

  spawn('npm', buildDependencies, {stdio: 'inherit'})
  .on('error', errorOrExit)
  .on('exit', errorOrExit)
}


module.exports = buildDependencies
