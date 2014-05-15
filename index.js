'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

var phantomExpress = require("phantom-express");

/**
 * Main application file
 */

// Default node environment to development

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
//var i = Date.now();
var db = mongoose.connect(config.mongo.uri, config.mongo.options);
/*var _ = require('underscore')
var collections = _.keys(db.connection.collections);
console.log(collections);*/
/*var j =Date.now();
console.log(j-i);*/
//db.connection.collections['brand'].drop();
/*db.dropCollection("brand", function(err, result) {
    assert.equal(null, err);

    // Verify that the collection is gone
    db.collectionNames("brand", function(err, names) {
        assert.equal(0, names.length);

        db.close();
    });
});*/
// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with sample data
//require('./lib/config/dummydata');

// Passport Configuration
require('./lib/config/passport')();

var app = express();
var optionsphantom = {
    // Currently the middleware caches the response from the
    // phantomjs process in the memory. The parameter defines
    // TTL in seconds. If 0 is passed the cache will be ignored.
    cacheLifetime: 3600,

    // Dump status to the console or not
    verbose: false,

    // Prepends the string to the pretty generated hash
    // ex. if '!' is defined ->  #!/home/page
    hashPrepend: '!'
}
app.use(phantomExpress(optionsphantom));


// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;