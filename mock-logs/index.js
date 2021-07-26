const sample_logs = require('./example.json');
const amqp = require('amqplib');

let connect = amqp.connect('amqp://guest:guest@192.168.55.10:5672');

connect.then((conn) => {
  return conn.createChannel();
}).then((chan) => {
  return chan.assertExchange('sample-logs', 'fanout').then(() => {
    return chan;
  });
}).then((chan) => {
  setInterval(() => {
    let index = Math.floor(Math.random() * sample_logs.length);
    console.log(index);
    console.log(JSON.stringify(sample_logs[index]));
    chan.publish('sample-logs', '', Buffer.from(JSON.stringify(sample_logs[index])));
  }, 5000);
});
