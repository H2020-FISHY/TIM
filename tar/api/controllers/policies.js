const drl = require('../helpers/db-rabbit-link');
const { Policy } = require('../../database/models');

function createPolicy(req, res) {
  let data = req.swagger.params.data.value;
  drl.createPolicy(data.source, data.status, data.timestamp, data.HSPL, data.attack_info).then((policy) => {
    res.status(201).json(policy);
  });
}

function listPolicies(req, res) {
  Policy.listPolicies().then((policies) => {
    res.json(policies);
  });
}

function getPolicy(req, res) {
  let policyId = req.swagger.params.policy_id.value;
  Policy.getPolicy(policyId).then((policy) => {
    if(!policy) {
      res.status(404).json({
        message: 'Policy not found'
      })
    } else {
      res.json(policy);
    }
  });
}

function deletePolicy(req, res) {
  let policyId = req.swagger.params.policy_id.value;
  drl.deletePolicy(policyId).then(() => {
    res.status(204).json();
  });
}

module.exports = {
  createPolicy,
  listPolicies,
  getPolicy,
  listPolicies,
  deletePolicy
}
