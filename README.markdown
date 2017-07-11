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
// C:\code\my-project\path\to\app\assets\bower.json
{
  // ...
  // JSON file contents don't matter, they are not checked. The existance of the
  // file is all that matters for the purposes of path data.
  // ...
}
```

```javascript
// C:\code\my-project\index.js
const bowerPathData = require('bower-path-data');

var pathInfo =  bowerPathData.sync('path/to/app/assets');
// pathInfo => {
//   componentsDir: 'C:\code\my-project\.tmp\assets\bower_stuff',
//   componentsDirName: 'bower_stuff',
//   jsonDir: 'C:\code\my-project\path\to\app\assets',
//   rcDir: 'C:\code\my-project\path\to\app'
// }
```

## API

### bowerPathData()

Does nothing / placeholder for an async method.

### bowerPathData.sync(startPath)

Returns an object containing bower path and directory name information, if available. Any values that could not be found will be returned with a value of `null`.


#### startPath

Type: `String`

A path to the directory to start looking for `bower.json` in.

If not found, ancestor directories will be searched until a match is found (using [**find-up**](https://github.com/sindresorhus/find-up)) or the volume root is reached. From `bower.json`'s location, `.bowerrc` will be searched for in the same way.

If `.bowerrc` is found, then [**bower-config**](https://github.com/bower/bower/tree/master/packages/bower-config) will be used to read the configuration. 

-   If the `directory` property is a string, then the component directory path will be the result of running the rc file's path and the directory property through node's [**path.join**](https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_join_paths) method.
-   Otherwise, the component directory path will be the result of running json file's path and the string `bower_components` through `path.join()`.

The component directory name will then be retrieved from the component directory path.
