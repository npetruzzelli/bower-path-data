const path = require('path')
const bowerConfig = require('bower-config')
const bowerJson = require('bower-json')

const PACKAGE_NAME = 'bower-path-data'

function bowerPathData(startPath, callback) {
  const METHOD_NAME = 'bowerPathData'
  var argError
  if (typeof callback !== 'function') {
    argError = new TypeError(
      PACKAGE_NAME +
        ': (' +
        METHOD_NAME +
        ') the "callback" argument must be a function.'
    )
    throw argError
  }
  if (typeof startPath !== 'string') {
    argError = new TypeError(
      PACKAGE_NAME +
        ': (' +
        METHOD_NAME +
        ') the "startPath" argument must be a string.'
    )
    callback(argError)
    return
  }
  bowerJson.find(startPath, function bowerJsonFindCallback(
    findError,
    filename
  ) {
    var componentsPath
    var config
    var jsonDirectory
    var jsonPath
    if (findError) {
      // if (findError.code === 'ENOENT') {
      //   // 'No JSON file was found in: ' + startPath
      // } else {
      //   // Some other error.
      // }
      callback(findError)
      return
    }

    jsonDirectory = path.dirname(jsonPath)

    try {
      config = bowerConfig.read(jsonDirectory)
    } catch (readError) {
      callback(readError)
      return
    }

    componentsPath = path.resolve(jsonDirectory, config.directory)

    callback(null, {
      componentsDir: componentsPath,
      jsonFile: jsonPath
    })
  })
}

bowerPathData.sync = function bowerPathDataSync(startPath) {
  var componentsPath
  var config
  var jsonDirectory
  var jsonPath

  try {
    jsonPath = bowerJson.findSync(startPath)
  } catch (err) {
    // if (err.code === 'ENOENT') {
    //   // 'No JSON file was found in: ' + startPath
    // } else {
    //   // Some other error.
    // }
    throw err
  }

  jsonDirectory = path.dirname(jsonPath)

  try {
    config = bowerConfig.read(jsonDirectory)
  } catch (err) {
    throw err
  }

  componentsPath = path.resolve(jsonDirectory, config.directory)

  return {
    componentsDir: componentsPath,
    jsonFile: jsonPath,

    // Deprecated properties are listed below
    componentsDirName: path.basename(componentsPath),
    jsonDir: jsonDirectory,
    rcDir: null // Breaking change. `rcDir` is no longer supported.
  }
}

module.exports = bowerPathData
