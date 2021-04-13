'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const extend = require('extend');
module.exports = app; // for testing
global.config = extend(true, require('../config/default.json'), require('../config/config.json'));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || global.config.ansibleRunner.port;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/callAnsibleDeploy']) {
    console.log('Swagger is up!');
  }

  if (swaggerExpress.runner.swagger.paths['/checkStatus']) {
    console.log('Checking status!');
  }
});
