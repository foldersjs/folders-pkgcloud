// Folders connector to pkgcloud abstraction library
var pkgcloud = require('pkgcloud');
var stream = require('stream');

var client;
var FoldersPkgcloud = function (prefix, options) {
    this.prefix = prefix;
    this.configure(options);
    console.log("inin foldersPkgcloud");
};


FoldersPkgcloud.prototype.configure = function (options) {

    if (options) {
        client = pkgcloud.storage.createClient(options);
    }
};



// This function will fail if bucket lies in any region other then 
// what is defined when instantiating this class
// currently no semantic in pkgcloud to get and set  container location 
// at runtime  
FoldersPkgcloud.prototype.write = function (filename, data, cb) {

    // hard coded container/bucket here .
    // need to fix it .may be provided in 
    // container/filename or as container argument
    var writeStream = client.upload({
        container: 'mybucket.test.com',
        remote: filename
    });

    writeStream.on('error', function (err) {
        // handle your error case

        if (err) {

            console.log("error in folders-pkgcloud write() ", err);
            return cb(err, null);
        }

    });

    writeStream.on('success', function (file) {
        // success, file will be a File model
        //console.log(file)
        cb(null, "write uri success");
    });


    if (typeof data == 'string') {

        var s = new stream.Readable();
        s.push(data);
        s.push(null);
        data = s;
    }

    if (data instanceof stream) {

        data.pipe(writeStream);
    }

};

FoldersPkgcloud.prototype.cat = function (filename, cb) {

	var stream = client.download({



	});
	
	

};

FoldersPkgcloud.prototype.listAllContainers = function () {


};

/*
 * @params
 * containers : string,array
 * cb : Function
 *  more of a 'walk' then 'ls' 
 */
// This function will fail if bucket lies in any region other then 
// what is defined when instantiating this class
// currently no semantic in pkgcloud to get and set  container location 
// at runtime  
FoldersPkgcloud.prototype.ls = function (containers, cb) {

    if (!(containers instanceof Array)) {
        containers = new Array(containers);
	}
    var tasksToGo = containers.length, result = [];

    for (var i = 0; i < containers.length; ++i) {

        ls(containers[i], function(err, data) {

            if (err) {

                console.log("error in folders-pkgcloud ls() ", err);
                return cb(err, null);
            }

            result = result.concat(data);

            if (--tasksToGo == 0)
                return cb(null, result);

        });

    }

};

var ls = function(container, cb) {
    var result = [];

    //extra check for input argument 
    if (!(container && (typeof container == 'string'))) {

        return cb('not valid ionput', null);

    }

    client.getFiles(container, function(err, files) {

        if (err) {
            console.log("error in folders-pkgcloud ls() ", err);
            return cb(err, null);

        }

        for (var i = 0; i < files.length; ++i) {

            result[i] = container + '/' + files[i].name;

        }

        cb(null, result);

    });


}


// Seems like they only support walk semantics, not ls.

/*
var client = pkgcloud.providers.amazon.storage.createClient({});
client.getFiles(container, {limit: 100}, function(err, files) {

});
*/



/*
client.getContainers(function (err, containers) {

console.log(containers)

	})
	*/
module.exports = FoldersPkgcloud;	