const path = require('path')
const bowerConfig = require('bower-config')
const findUp = require('find-up')

function bowerPathData(/* startPath */) {
  // The `bower-config` module does not have an asynchronous option. Though the
  // `find-up` module does. In the future, this portion of the code could be
  // done asynchronously using promises.
}

/**
 * TODO:
 * Q: What happens when a `.bowerrc` file exists, but a `bower.json` file could
 *    not be found?
 * A: `rcDir` could be available. If the `directory` property is in the
 *    configuration file, then the components information could be resolvable as
 *    well.
 */
bowerPathData.sync = function bowerPathDataSync(startPath) {
  var bowerData = {
    componentsDir: null,
    componentsDirName: null,
    jsonDir: null,
    rcDir: null
  }
  var bowerJsonFilePath
  var bowerrcFilePath

  bowerJsonFilePath = findUp.sync('bower.json', { cwd: startPath })
  if (bowerJsonFilePath !== null) {
    bowerData.jsonDir = path.dirname(bowerJsonFilePath)
    bowerrcFilePath = findUp.sync('.bowerrc', { cwd: bowerData.jsonDir })
    if (bowerrcFilePath !== null) {
      bowerData.rcDir = path.dirname(bowerrcFilePath)
      var fullBowerrcPath = path.resolve(bowerData.rcDir)
      var bowerrc = bowerConfig.read(fullBowerrcPath)
      if (typeof bowerrc.directory === 'string') {
        bowerData.componentsDir = path.join(fullBowerrcPath, bowerrc.directory)
      }
    }
    if (bowerData.componentsDir == null) {
      bowerData.componentsDir = path.join(bowerData.jsonDir, 'bower_components')
    }
    bowerData.componentsDirName = path.basename(bowerData.componentsDir)
  }
  return bowerData
}

module.exports = bowerPathData
