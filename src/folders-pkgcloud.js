// Folders connector to pkgcloud abstraction library
var pkgcloud = require('pkgcloud');


var baseurl;
//TODO we may want to pass the host, port, username as the param of inin
var FoldersPkgcloud = function(prefix, options) {
        this.prefix = prefix;

        baseurl = options.baseurl;
        if (baseurl.length && baseurl.substr(-1) != "/")
                baseurl = baseurl + "/";
        this.username = options.username;
        console.log("inin foldersPkgcloud,", baseurl, this.username);
};


// Seems like they only support walk semantics, not ls.

var client = pkgcloud.providers.amazon.storage.createClient({});
client.getFiles(container, {limit: 100}, function(err, files) {

});

