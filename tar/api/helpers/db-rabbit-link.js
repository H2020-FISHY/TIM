const { rabbitClientController, rabbitHelpers } = require('@x-npm/rabbit');
const { Report, Node, Policy, CefReport, MsplConfig } = require('../../database/models');

async function createReport(nodeId, source, data) {
    let report;
    if(nodeId == null) {
        report = await Report.createReportStandalone(source, data);
    }
    else {
        report = await Report.createReport(nodeId, source, data);
    }
    let taskName = 'nodes.reports';
    if(!nodeId) {
        taskName = 'reports.create';
    }
    let task = rabbitHelpers.createTask(taskName, {
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

async function createPolicy(source, status, timestamp, HSPL, attackInfo) {
    let policy = await Policy.createPolicy(source, status, timestamp, HSPL, attackInfo);
    let task = rabbitHelpers.createTask('policies.create', policy);
    rabbitClientController.sendTaskDontWait(task);
    return policy;
}

async function deletePolicy(policyId) {
    let policy = await Policy.deletePolicy(policyId);
    if(policy) {
        let task = rabbitHelpers.createTask('policies.delete', policy);
        rabbitClientController.sendTaskDontWait(task);
        return policy;
    }
}

async function createCefReport(device_product, device_version, event_name, device_event_class_id, severity, extensions_list) {
    let cefReport = await CefReport.createCefReport(device_product, device_version, event_name, device_event_class_id, severity, extensions_list);
    let task = rabbitHelpers.createTask('reports.create.cef', cefReport);
    rabbitClientController.sendTaskDontWait(task);
    return cefReport;
}

async function createMsplConfig(type, source, status, timestamp, data) {
    let msplconfig = await MsplConfig.createMsplConfig(type, source, status, timestamp, data);
    let task = rabbitHelpers.createTask(`${type}.create`, msplconfig);
    rabbitClientController.sendTaskDontWait(task);
    return msplconfig;
}

module.exports = {
    createReport,
    updateNodeStatus,
    createNode,
    createPolicy,
    deletePolicy,
    createCefReport,
    createMsplConfig
};
