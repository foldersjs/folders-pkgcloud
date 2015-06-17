// Folders connector to pkgcloud abstraction library
var pkgcloud = require('pkgcloud');
var Provider = require('./providers/provider');


var FoldersPkgcloud = function (prefix, options) {

    this.configure(options);
    this.prefix = prefix || "/http_window.io_0:pkgcloud/";

    console.log("inin foldersAws,", this.container || 'All container');

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
        self.allProvider = true;
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


FoldersPkgcloud.prototype.write = function (path, data, cb) {

    var self = this,
        container, pathPrefix;
    var arr = getProviderRegionPath(self, path);

    self.options.provider = arr[0];
    self.options.region = arr[1];
    pathPrefix = arr[2];
    this.providerObj = getProviderObject(self.options, {
        container: self.options.container
    });
    self.providerObj.write(pathPrefix, data, cb);

};


FoldersPkgcloud.prototype.cat = function (path, cb) {

    var self = this,
        container, pathPrefix;
    var arr = getProviderRegionPath(self, path);

    self.options.provider = arr[0];
    self.options.region = arr[1];
    pathPrefix = arr[2];
    this.providerObj = getProviderObject(self.options, {
        container: self.options.container
    });
    self.providerObj.cat(pathPrefix, cb);

}




FoldersPkgcloud.prototype.ls = function (path, cb) {
    var self = this,
        container, pathPrefix;
    var arr = getProviderRegionPath(self, path);

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

        if (path[0] == '/') {
            path = path.replace('/', '');
        }
        var parts = path.split('/');
        provider = parts[0];
		if (!(self.provider.indexOf(provider) > -1)) {
            console.log('This provider not configured in your list ');
            return;

        }
        path = parts.slice(1, parts.length).join('/');

    } else if (self.singleProvider) {

        provider = self.provider;

    } else if (self.allProvider) {


        if (path[0] == '/') {
            path = path.replace('/', '');
        }
        var parts = path.split('/');
        provider = parts[0];
        path = parts.slice(1, parts.length).join('/');
    }


    if (self.multipleRegion) {

        if (path[0] == '/') {
            path = path.replace('/', '');
        }
        var parts = path.split('/');
        region = parts[0];
		if (!(self.region.indexOf(region) > -1)) {
            console.log('This region not configured in your list ');
            return;

        }
        path = parts.slice(1, parts.length).join('/');

    } else if (self.singleRegion) {

        region = self.region;

    } else if (self.allRegion) {


        if (path[0] == '/') {
            path = path.replace('/', '');
        }
        var parts = path.split('/');
        region = parts[0];
        path = parts.slice(1, parts.length).join('/');
    }

    return [provider, region, path];
}

var getProviderObject = function (options, container) {

    var client = require('pkgcloud').storage.createClient(options);
    return new Provider(client, container);
};