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

## API

### bowerPathData()

Does nothing / placeholder for an async method.

### bowerPathData.sync(startPath)

Returns: an `Object` containing bower path information. 

> Checks if a `bower.json` exists, falling back to `component.json` (deprecated) and `.bower.json`
>
> _Source: [find/findSync methods](https://github.com/bower/bower/tree/master/packages/bower-json#findfolder-callback)_ in the **bower-json** module

If a JSON file is found, the runtime configuration is retrieved using [**bower-config**](https://github.com/bower/bower/tree/master/packages/bower-config). The absolute path to the JSON file (including the filename) is returned as `jsonFile` in the returned object.

The JSON file's absolute path and the value of `directory` from the runtime configuration are resolved using node's [**path.resolve**](https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_resolve_paths) and the result is returned as `componentsDir` in the returned object.

#### startPath

Type: `String`

A path to the directory to look in for the bower project configuration JSON file.

If a JSON file can't be found in `startPath` an error is thrown.
