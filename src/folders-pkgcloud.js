// Folders connector to pkgcloud abstraction library
var pkgcloud = require('pkgcloud');
var Provider = require('./providers/provider');


var FoldersPkgcloud = function (prefix, options) {

    this.configure(options);
    this.prefix = prefix || "/http_window.io_0:pkgcloud/";

    console.log("inin foldersAws,", this.container);

};


FoldersPkgcloud.prototype.features = FoldersPkgcloud.features = {

    cat: true,
    ls: true,
    write: true,
    server: false
};




FoldersPkgcloud.prototype.configure = function (options) {


    var self = this;

    if (typeof options.provider == 'string') {
        self.singleProvider = true;
        self.provider = options.provider;
    } else if (options.provider instanceof Array) {
        self.multipleProvider = true;
    } else if (!options.provider) {
        self.allService = true;
    }
  

    if (typeof options.region == 'string') {
        self.singleRegion = true;
        self.region = options.region;
    } else if (options.region instanceof Array) {
        self.multipleRegion = true;
    } else if (!options.region) {
        self.allRegion = true;
    }


    self.options = options;


};

module.exports = FoldersPkgcloud;


FoldersPkgcloud.prototype.write = function (filename, data, cb) {

    var self = this,
        container;
    var arr = getProviderRegion(self, path);
    this.providerObj = getServiceObject(arr[0], {
        container: self.container
    });
    self.providerObj.ls(path, cb);

};


FoldersPkgcloud.prototype.cat = function (filename, cb) {

    var self = this,
        container;
    var arr = getProviderRegion(self, path);
    this.providerObj = getServiceObject(arr[0], {
        container: self.container
    });
    self.providerObj.cat(path, cb);

}




FoldersPkgcloud.prototype.ls = function (path, cb) {
    var self = this,
        container, pathPrefix;
    var arr = getProviderRegionPath(self, path);
    console.log(arr);
    self.options.provider = arr[0];
    self.options.region = arr[1];
    pathPrefix = arr[2];
    this.providerObj = getProviderObject(self.options, {
        container: self.options.container
    });
    self.providerObj.ls(pathPrefix, cb);
}




var getProviderRegionPath = function (self, path) {

    var provider, region, path;

    if (self.multipleProvider) {

        var parts = path.split('/');
        provider = parts[0];
        path = parts.splice(0, 1).join('/');

    } else if (self.singleProvider) {

        provider = self.provider;

    } else if (self.allProvider) {
        //default provider
        provider = 'amazon';
    }




    if (self.multipleRegion) {

        var parts = path.split('/');
        region = parts[0];
        path = parts.splice(0, 1).join('/');

    } else if (self.singleRegion) {

        region = self.region;

    } else if (self.allRegion) {
        //default region
        region = 'us-west-2'
    }

    return [provider, region, path];
}

var getProviderObject = function (options, container) {

    var client = require('pkgcloud').storage.createClient(options);
    return new Provider(client, container);
};




FoldersPkgcloud.prototype.asFolders = function ( /*prefix,*/ pathPrefix, files) {
    var out = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var o = {
            name: file.Key
        };
        o.fullPath = pathPrefix + o.name;
        o.uri = "#" + this.prefix + o.fullPath;
        o.size = file.Size || 0;
        o.extension = path.extname(o.name).substr(1, path.extname(o.name).length - 1) || 'DIR';
        o.type = "text/plain";
        o.modificationTime = file.LastModified;
        out.push(o);


    }

    return out;

};