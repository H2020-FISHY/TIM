const amqp = require('amqplib');

let connect = amqp.connect('amqp://guest:guest@192.168.55.10:5672');

connect.then((conn) => {
  return conn.createChannel();
}).then((chan) => {
  return chan.assertExchange('sample-logs', 'fanout').then(() => {
    return chan;
  });
}).then((chan) => {
  return chan.assertQueue('sample-logs').then(() => {
    return chan.bindQueue('sample-logs', 'sample-logs', '').then(() => {
      return chan;
    });
  });
}).then((chan) => {
  return chan.consume('sample-logs', (msg) => {
    if(msg !== null) {
      console.log(msg.content.toString());
    }
  });
});
