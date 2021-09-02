'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const extend = require('extend');
module.exports = app; // for testing
const db = require('./database/database');
const { rabbitClientController } = require('@x-npm/rabbit');

var conf = extend(true, require('./config/default.json'), require('./config/config.json'));

var config = {
  appRoot: __dirname // required config
};

db.init().then(() => {
  rabbitClientController.init({
    host: conf.rabbitserver_ip,
    port: conf.rabbitserver_port
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
