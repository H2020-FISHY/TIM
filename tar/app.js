'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
const db = require('./database/database');
const { rabbitClientController } = require('@x-npm/rabbit');

var config = {
  appRoot: __dirname // required config
};

db.init().then(() => {
  rabbitClientController.init({
    host: '127.0.0.1',
    port: 5672
  }).then(() => {
    SwaggerExpress.create(config, function(err, swaggerExpress) {
      if (err) { throw err; }
    
      // install middleware
      swaggerExpress.register(app);
    
      var port = process.env.PORT || 10010;
      app.listen(port);
    });
  });
});
