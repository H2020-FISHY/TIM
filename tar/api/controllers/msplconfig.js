const drl = require('../helpers/db-rabbit-link');
const { Mspl, Config } = require('../../database/models');

function listMspl(req, res) {
  let policy_id = req.swagger.params.policy_id.value;
  Mspl.listMspl(policy_id).then((mspls) => {
    res.json(mspls);
  });
}

function createMspl(req, res) {
  let data = req.swagger.params.data.value;
  drl.createMspl(data.source, data.status, data.timestamp, data.data, data.policy_id).then((mspl) => {
    res.status(201).json(mspl);
  });
}

function getMspl(req, res) {
  let entityId = req.swagger.params.mspl_id.value;
  Mspl.getMspl(entityId).then((mspl) => {
    if (!mspl) {
      res.status(404).json({
        message: `MSPL not found`
      });
    } else {
      res.json(mspl);
    }
  });
}

function deleteMspl(req, res) {
  let entityId = req.swagger.params.mspl_id.value;
  Mspl.deleteMspl(entityId).then(() => {
    res.status(204).json();
  });
}

function listConfigurations(req, res) {
  let mspl_id = req.swagger.params.mspl_id.value;
  Config.listConfig(mspl_id).then((configs) => {
    res.json(configs);
  });
}

function createConfiguration(req, res) {
  let data = req.swagger.params.data.value;
  drl.createConfig(data.source, data.status, data.timestamp, data.data, data.mspl_id).then((config) => {
    res.status(201).json(config);
  });
}

function getConfiguration(req, res) {
  let entityId = req.swagger.params.configuration_id.value;
  Config.getConfig(entityId).then((config) => {
    if (!config) {
      res.status(404).json({
        message: `Configuration not found`
      });
    } else {
      res.json(config);
    }
  });
}

function deleteConfiguration(req, res) {
  let entityId = req.swagger.params.configuration_id.value;
  Config.deleteConfig(entityId).then(() => {
    res.status(204).json();
  });
}

module.exports = {
  listMspl,
  createMspl,
  getMspl,
  deleteMspl,
  listConfigurations,
  createConfiguration,
  getConfiguration,
  deleteConfiguration
};
