const sample_logs = require('./example.json');
const amqp = require('amqplib');
const extend = require('extend');

var conf = extend(true, require('./config/default.json'), require('./config/config.json'));

let connect = amqp.connect('amqp://' + conf.rmq_user + ':' + conf.rmq_password + '@' + conf.rmq_ip + ':' + conf.rmq_port);

connect.then((conn) => {
  return conn.createChannel();
}).then((chan) => {
  return chan.assertExchange(conf.exchange_name, conf.exchange_type).then(() => {
    return chan;
  });
}).then((chan) => {
  setInterval(() => {
    let index = Math.floor(Math.random() * sample_logs.length);
    console.log(index);
    console.log(JSON.stringify(sample_logs[index]));
    chan.publish(conf.exchange_name, '', Buffer.from(JSON.stringify(sample_logs[index])));
  }, 5000);
});
