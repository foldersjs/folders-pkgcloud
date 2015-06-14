var stream = require('stream');


var client;
var Provider = function (providerClient, options) {

    client = providerClient;
    this.configure(options);
    console.log("inin provider");
};


Provider.prototype.configure = function (options) {

    var self = this;

    if (typeof options.container == 'string') {
        self.singleContainer = true;
    } else if (options.container instanceof Array) {
        self.multipleContainer = true;
    } else if (!options.container) {
        self.allContainer = true;
    }

    self.container = options.container;


};


Provider.prototype.write = function (path, data, cb) {



    var self = this,
        container, pathPrefix, arr;
    arr = getContainerPathPrefix(self, path);
    container = arr[0];
    pathPrefix = arr[1];
    write(container, pathPrefix, data, cb);


};




var write = function (container, filename, data, cb) {


    var writeStream = client.upload({
        container: container,
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

Provider.prototype.cat = function (path, cb) {

    var self = this,
        container, pathPrefix, arr;
    arr = getContainerPathPrefix(self, path);
    container = arr[0];
    pathPrefix = arr[1];
    cat(container, pathPrefix, cb);

};


var cat = function (container, filename, cb) {

    var file = client.download({
        container: container,
        remote: filename
    });

    cb(null, {
        stream: file
    });


};


Provider.prototype.listAllContainers = function () {


};

/*
 * @params
 * containers : string,array
 * cb : Function
 *  more of a 'walk' then 'ls' 
 */

Provider.prototype.ls = function (path, cb) {

    var self = this,
        container, pathPrefix, arr;
    arr = getContainerPathPrefix(self, path);
    container = arr[0];
    pathPrefix = arr[1];
    lsContainer(container, pathPrefix, cb);
};


// this function will list all contents inside a container.
// no option for using prefix 

var lsContainer = function (container, pathPrefix, cb) {
    var result = [];

    client.getFiles(container, function (err, files) {

        if (err) {
            console.log("error in folders-pkgcloud ls() ", err);
            return cb(err, null);

        }

        for (var i = 0; i < files.length; ++i) {

            // result[i] = container + '/' + files[i].name;
            result[i] = files[i].name;

        }

        cb(null, result);

    });

}

var getContainerPathPrefix = function (self, path) {

    var container, pathPrefix;

    if (self.multipleContainer) {
        var parts = path.split('/');
        container = parts[0];
        if (!(self.container.indexOf(container) > -1)) {
            console.log('This container not configured in your list ');
            return;

        }
        pathPrefix = parts[1];


    } else if (self.singleContainer) {
        pathPrefix = path;
        container = self.container;

    } else if (self.allContainer) {
        var parts = path.split('/');
        container = parts[0];
        pathPrefix = parts[1];

    }

    return [container, pathPrefix];
}


/*
client.getContainers(function (err, containers) {

console.log(containers)

	})
	*/
module.exports = Provider;