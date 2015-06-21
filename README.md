Folders
=============

This node.js package implements the folders.io synthetic file system.

This Folders Module is based on a cloud storage,
Module can be installed via "npm install folders-pkgcloud".

Example:

Installation (use --save to save to package.json)

```sh
npm install folders-pkgcloud
```

Basic Usage

### Constructor

Provider constructor, could pass the special option/param in the config param.

```js
var FoldersPkgcloud = require('folders-pkgcloud');

var config = {
           keyId: : "Access Id" ,
           key : "Access key" ,
		   provider : ['amazon','rackspace'],
		   region: ['us-west-2','us-east-1'],
		   container : ['mybucket1','mybucket2']
};

var pkgcloud = new FoldersPkgcloud("localhost-pkgcloud", config);
```

###ls

```js
/**
 * @param uri, the uri to ls
 * @param cb, callback function. 
 * ls(uri,cb)
 */
 
pkgcloud.ls('amazon/us-west-2/mybcuket1/', function(err,data) {
        console.log("Folder listing", data);
});
```

###cat


```js

/**
 * @param uri, the file uri to cat 
 * @param cb, callback function.
 * cat(uri,cb) 
 */

pkgcloud.cat('amazon/us-west-2/mybcuket1/video/movie.wmv', function(err,result) {
        console.log("Read Stream ", result.stream);
});
```

### write

```js

/**
 * @param path, string, the path 
 * @param data, the input data, 'stream.Readable' or 'Buffer'
 * @param cb, the callback function
 * write(path,data,cb)
 */

var writeData = getWriteStreamSomeHow('some_movie.mp4');
 
pkgcloud.write('amazon/us-west-2/mybcuket1/video/some_movie.mp4',writeData, function(err,result) {
        console.log("Write status ", result);
});

```

'provider' , 'region' and 'container' attributes  in 'config' can be 'String' or 'Array' or 'Optional (undefined)'. 
In case of 'provider' or 'region' or 'container' attributes of type 'String' , we can safely remove them from 'path' argument
which is passed to 'ls' , 'cat' and 'write' methods . 

```js
var FoldersPkgcloud = require('folders-pkgcloud');

var config = {
           keyId: : "Access Id" ,
           key : "Access key" ,
		   provider : 'amazon',
		   region: 'us-west-2',
		   container : 'mybucket1'
};

var pkgcloud = new FoldersPkgcloud("localhost-pkgcloud", config);
```

###ls

```js

pkgcloud.ls('', function(err,data) {
        console.log("Folder listing", data);
});
```
###cat

```js
pkgcloud.cat('video/movie.wmv', function(err,result) {
        console.log("Read Stream ", result.stream);
});
```
###write

```js
var writeData = getWriteStreamSomeHow('some_movie.mp4');

pkgcloud.write('video/some_movie.mp4',writeData, function(err,result) {
        console.log("Write status ", result);
});

```
