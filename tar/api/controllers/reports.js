const drl = require('../helpers/db-rabbit-link');
const { Report } = require('../../database/models');

function listReports(req, res) {
    let nodeId = req.swagger.params.node_id.value;
    Report.listReports(nodeId)
    .then((reports) => {
        res.json(reports);
    });
}

function getReport(req, res) {
    let id = req.swagger.params.report_id.value;
    Report.getReport(id)
    .then((report) => {
        res.json(report);
    });
}

function createReport(req, res) {
    let data = req.swagger.params.data.value;
    let nodeId = req.swagger.params.node_id.value;
    drl.createReport(nodeId, data.source, data.data)
    .then((report) => {
        console.log(report.get());
        res.status(201).json(report);
    });
}

function listReportsStandalone(req, res) {
    Report.listReportsStandalone()
    .then((reports) => {
        res.json(reports);
    });
}

function getReportStandalone(req, res) {
    let id = req.swagger.params.report_id.value;
    Report.getReportStandalone(id)
    .then((report) => {
        res.json(report);
    });
}

function createReportStandalone(req, res) {
    let data = req.swagger.params.data.value;
    drl.createReport(null, data.source, data.data)
    .then((report) => {
        console.log(report.get());
        res.status(201).json(report);
    });
}

module.exports = {
    listReports,
    getReport,
    createReport,
    listReportsStandalone,
    getReportStandalone,
    createReportStandalone
}
