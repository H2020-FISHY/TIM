const drl = require('../helpers/db-rabbit-link');
const { Report, CefReport } = require('../../database/models');

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
      if (!report) {
        res.status(404).json({
          message: 'Report not found'
        })
      } else {
        res.json(report);
      }
    });
}

function createReport(req, res) {
  let data = req.swagger.params.data.value;
  let nodeId = req.swagger.params.node_id.value;
  drl.createReport(nodeId, data.source, data.data)
    .then((report) => {
      res.status(201).json(report);
    });
}

function listReportsStandalone(req, res) {
  let pilot = req.swagger.params.pilot.value;
  Report.listReportsStandalone(pilot)
    .then((reports) => {
      res.json(reports);
    });
}


function listReportsCEFStandalone(req, res) {
  let device_product = req.swagger.params.device_product.value;
  let device_version = req.swagger.params.device_version.value;
  let pilot = req.swagger.params.pilot.value;
  CefReport.listCefReports(device_product, device_version, pilot)
    .then((reports) => {
      res.json(reports);
    });
}

function getReportCEFStandalone(req, res) {
  let id = req.swagger.params.report_id.value;
  CefReport.getCefReport(id)
    .then((report) => {
      if (!report) {
        res.status(404).json({
          message: 'Report not found'
        })
      } else {
        res.json(report);
      }
    });
}

function getReportStandalone(req, res) {
  let id = req.swagger.params.report_id.value;
  Report.getReportStandalone(id)
    .then((report) => {
      if (!report) {
        res.status(404).json({
          message: 'Report not found'
        })
      } else {
        res.json(report);
      }
    });
}

function createReportCEFStandalone(req, res) {
  let data = req.swagger.params.data.value;
  drl.createCefReport(data.device_product, data.device_version, data.event_name, data.device_event_class_id, data.severity, data.extensions_list)
    .then((report) => {
      res.status(201).json(report);
    })
}


function createReportStandalone(req, res) {
  let data = req.swagger.params.data.value;
  drl.createReport(null, data.source, data.data)
    .then((report) => {
      res.status(201).json(report);
    });
}

module.exports = {
  listReports,
  getReport,
  createReport,
  listReportsStandalone,
  getReportStandalone,
  createReportStandalone,
  createReportCEFStandalone,
  listReportsCEFStandalone,
  getReportCEFStandalone
}
