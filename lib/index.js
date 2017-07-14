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

bowerPathData.promise = function bowerPathDataPromise(startPath) {
  /*
   * For now, let error handling be done in the main `bowerPathData` method.
   */
  // const METHOD_NAME = 'bowerPathData.promise'
  // var argError
  // if (typeof startPath !== 'string') {
  //   argError = new TypeError(
  //     PACKAGE_NAME +
  //       ': (' +
  //       METHOD_NAME +
  //       ') the "startPath" argument must be a string.'
  //   )
  //   return Promise.reject(argError)
  // }
  function bowerPathDataPromiseExecutor(resolve, reject) {
    /*
     * based on `Q.defer.makeNodeResolver`
     * https://github.com/kriskowal/q/blob/9175f60da197b2edf23dfc55fb7343502216ebd9/q.js#L670-L686
     */
    function bowerPathDataPromiseCallback(bowerPathDataError, data) {
      var args
      if (bowerPathDataError) {
        reject(bowerPathDataError)
      } else if (arguments.length > 2) {
        /*
         * An optimization safe way of converting an arguments object into an
         * a true array
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments#Description
         */
        args =
          arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        resolve.apply(null, args.slice(1))
      } else {
        resolve(data)
      }
    }
    bowerPathData(startPath, bowerPathDataPromiseCallback)
  }
  return new Promise(bowerPathDataPromiseExecutor)
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
