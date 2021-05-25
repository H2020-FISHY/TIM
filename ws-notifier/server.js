const WebSocket = require('ws');
const { rabbitServerController, rabbitHelpers, StatusDefinition } = require('@x-npm/rabbit');
// console.log(StatusDefinition.STATUS_SUCCESS);
let clients = [];
let wss = new WebSocket.Server({ port: 8080 });

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
    host: '127.0.0.1',
    port: 5672
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