# bower-path-data

Get information on bower related paths and directory names.

## Installation

```
npm install bower-path-data
```

## Usage

```javascript
// C:\code\my-project\path\to\app\.bowerrc
{
  "directory": "../../../.tmp/assets/bower_stuff"
}
```

```javascript
// C:\code\my-project\index.js
const bowerPathData = require('bower-path-data');

var pathInfo =  bowerPathData.sync('path/to/app/assets');
// pathInfo => {
//   componentsDir: 'C:\code\my-project\.tmp\assets\bower_stuff',
//   jsonFile: 'C:\code\my-project\path\to\app\assets\bower.json'
// }
```

## About Bower Configurations

Bower is configured in a couple of ways.

### Project Configuration

> `bower.json` is used for configuring packages that can be used as a dependency of another package. This is similar to Node’s `package.json` or Ruby’s `Gemfile`.
> 
> _Source: [Bower Spec: JSON](https://github.com/bower/spec/blob/master/json.md)_

### Runtime Configuration

> The config is obtained by merging multiple configurations by this order of importance:
> 
> 1. CLI arguments via `--config`
> 2. Environment variables
> 3. Environment variables with [`config`](https://docs.npmjs.com/files/package.json#config) key of package.json
> 4. Local .bowerrc located in the current working directory
> 5. All .bowerrc files upwards the directory tree
> 6. `.bowerrc` file located in user’s home folder (~)
> 7. `.bowerrc` file located in the global folder (/)
> 
> _Source: [Bower Spec: CONFIG](https://github.com/bower/spec/blob/master/config.md)_

Returning a path to a single `.bowerrc` file would not be useful as the path to a single file does not tell the complete runtime configuration story. What _is_ important is the content of the runtime configuration itself. Providing the full configuration is out of scope for `bower-path-data`, but fortunately a module already exists to make getting the configuration easily. Check out [**bower-config**](https://github.com/bower/bower/tree/master/packages/bower-config).

```javascript
const bowerConfig = require('bower-config');
const path = require('path');

var jsonPath = path.dirname(path.resolve('www/assets/bower.json'));
// => C:\code\my-project\www\assets

var runtimeConfig = bowerConfig.read(jsonPath);
```

## API

The main method and the `sync` method follow the same steps, but differ in how you receive the results or errors.

> Checks if a `bower.json` exists, falling back to `component.json` (deprecated) and `.bower.json`
>
> _Source: [`find` and `findSync` methods](https://github.com/bower/bower/tree/master/packages/bower-json#findfolder-callback)_ in the **bower-json** module

If a JSON file is found, the runtime configuration is retrieved using [**bower-config**](https://github.com/bower/bower/tree/master/packages/bower-config). The absolute path to the JSON file (including the filename) is returned as `jsonFile` in the data object.

The JSON file's absolute path and the value of `directory` from the runtime configuration are resolved using node's [**path.resolve**](https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_resolve_paths) and the result is returned as `componentsDir` in the data object.

### bowerPathData(startPath, callback)

#### startPath

Type: `String`

A path to the directory to look in for the Bower project configuration JSON file.

If the startPath argument is not a string, a `TypeError` will be passed to the callback function.

#### callback(err, pathData)

Type: `Function`

The callback function will receive 2 arguments.

If the callback argument is not a function a `TypeError` is thrown.

1.  **err**: `null` if there were no problems, otherwise it will contain an error object. 
    The exact type of the error object will depend on the nature of the error and what module it occured in
2.  **pathData**: an `Object` containing bower path information
    -   **componentsDir**: a `String` containing the absolute file system path to where Bower components are located
    -   **jsonFile**:  a `String` containing the absolute file system path to the project configuration file

### bowerPathData.sync(startPath)

Returns: an `Object` containing bower path information. 

-   **componentsDir**: a `String` containing the absolute file system path to where Bower components are located
-   **jsonFile**:  a `String` containing the absolute file system path to the project configuration file

#### startPath

Type: `String`

A path to the directory to look in for the Bower project configuration JSON file.

If a JSON file can't be found in `startPath` an error is thrown.
