'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const extend = require('extend');
module.exports = app; // for testing
const db = require('./database/database');
const { rabbitClientController } = require('@x-npm/rabbit');

// check if we're getting config from env or files
let envConfig = process.env.GET_CONFIG_FROM_ENV;

console.log(require('util').inspect(process.env,false,null));

// K8S specific stuff
let rabbitIP = process.env.CENTRAL_REPOSITORY_RMQ_SERVICE_HOST;
let rabbitPort = process.env.CENTRAL_REPOSITORY_RMQ_SERVICE_PORT;

var conf = extend(true, require('./config/default.json'), require('./config/config.json'));

if(!envConfig || envConfig === 'false' || envConfig === 'False') {
  rabbitIP = conf.rabbitserver_ip;
  rabbitPort = conf.rabbitserver_port;
}

var config = {
  appRoot: __dirname // required config
};

db.init().then(() => {
  rabbitClientController.init({
    host: rabbitIP,
    port: rabbitPort
  }).then(() => {
    SwaggerExpress.create(config, function(err, swaggerExpress) {
      if (err) { throw err; }
    
      // install middleware
      swaggerExpress.register(app);
    
      var port = process.env.PORT || conf.swagger_port;
      app.listen(port);
    });
  });
});
