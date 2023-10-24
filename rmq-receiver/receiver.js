const amqp = require('amqplib');
const os = require('os');
//const { config } = require('process');
const extend = require('extend');
const syslog = require("syslog-client");

var conf = extend(true, require('./config/default.json'), require('./config/config.json'));

let connect = amqp.connect('amqp://' + conf.rmq_user + ':' + conf.rmq_password + '@' + conf.rmq_ip + ':' + conf.rmq_port);

if (conf.transport == "udp") {
  var transp = syslog.Transport.Udp;
}
else if (conf.transport == "tcp"){
  var transp = syslog.Transport.Tcp;
}

connect.then((conn) => {
  return conn.createChannel();
}).then((chan) => {
  return chan.assertExchange(conf.exchange_name, conf.exchange_type).then(() => {
    return chan;
  });
}).then((chan) => {
  return chan.assertQueue(conf.exchange_name).then(() => {
    return chan.bindQueue(conf.exchange_name, conf.exchange_name, '').then(() => {
      return chan;
    });
  });
}).then((chan) => {
  return chan.consume(conf.exchange_name, (msg) => {
    if(msg !== null) {

      var options = {
        syslogHostname: os.hostname(),
        transport: transp,
        port: conf.target_port
      };

      var client = syslog.createClient(conf.target_ip, options);
      client.log(msg.content.toString());
      console.log(msg.content.toString());
      chan.ack(msg);
    }
  });
});
