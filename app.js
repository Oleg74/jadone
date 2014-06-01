
/**
 * Module dependencies
 */

var express = require('express'),
    mongoose=require('mongoose'),
    fs = require('fs'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
    index = require('./lib/controllers/index'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */
app.set('port', process.env.PORT || 3000);
// all environments
/*app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
*//*app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());*//*
app.use(express.static(path.join(__dirname, 'app')));*/


// development only
/*if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};*/
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Application Config
var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// Passport Configuration
require('./lib/config/passport')();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Socket.io Communication
io.sockets.on('connection', require('./lib/controllers/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
