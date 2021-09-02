const WebSocket = require('ws');
const extend = require('extend');
const { rabbitServerController, rabbitHelpers, StatusDefinition } = require('@x-npm/rabbit');
// console.log(StatusDefinition.STATUS_SUCCESS);

var conf = extend(true, require('./config/default.json'), require('./config/config.json'));

let clients = [];
let wss = new WebSocket.Server({ port: conf.websocket_port });

function taskHandler(task) {
    let id = task.id;
    delete task.id;
    let message = JSON.stringify(task);
    clients.forEach((client) => {
        client.send(message);
    });
    // console.log(StatusDefinition);
    // rabbitHelpers.createStatus(id, StatusDefinition.STATUS_SUCCESS, {});
    // rabbitServerController.sendStatus(status);
}

rabbitServerController.init({ 
    host: conf.rabbitserver_ip,
    port: conf.rabbitserver_port
}, {
    task_bindings: ['nodes.#'],
    handler: taskHandler
}).then(() => {
    wss.on('connection', function(ws) {
        clients.push(ws);
    });
}).catch((err) => {
    console.log('Error connecting to RabbitMQ');
    console.log(err);
    process.exit(1);
});