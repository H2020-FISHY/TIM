const { rabbitClientController, rabbitHelpers } = require('@x-npm/rabbit');
const { Report, Node } = require('../../database/models');

async function createReport(nodeId, source, data) {
    let report;
    if(nodeId == null) {
        report = await Report.createReportStandalone(source, data);
    }
    else {
        report = await Report.createReport(nodeId, source, data);
    }
    let task = rabbitHelpers.createTask('nodes.reports', {
        nodeId,
        report: {
            source,
            data
        }
    });
    rabbitClientController.sendTaskDontWait(task);
    return report;
}

async function updateNodeStatus(id, status) {
    let node = await Node.updateNodeStatus(id, status);
    if(node !== null) {
        let task = rabbitHelpers.createTask('nodes.updates', {
           nodeId: id,
           status 
        });
        rabbitClientController.sendTaskDontWait(task);
    }
    return node;
}

async function createNode(name, status) {
    let node = await Node.createNode(name, status);
    let task = rabbitHelpers.createTask('nodes.create', node);
    rabbitClientController.sendTaskDontWait(task);
    return node;
}

module.exports = {
    createReport,
    updateNodeStatus,
    createNode
};