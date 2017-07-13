const path = require('path')
const bowerConfig = require('bower-config')
const bowerJson = require('bower-json')

function bowerPathData(/* startPath */) {
  // The `bower-config` module does not have an asynchronous option. Though the
  // `find-up` module does. In the future, this portion of the code could be
  // done asynchronously using promises.
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
