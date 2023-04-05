const drl = require('../helpers/db-rabbit-link');
const { Node } = require('../../database/models');

function listNodes(req, res) {
  Node.listNodes()
    .then((nodes) => {
      res.json(nodes);
    });
}

function getNode(req, res) {
  let id = req.swagger.params.node_id.value;
  Node.getNode(id)
    .then((node) => {
      if (!node) {
        res.status(404).json({
          message: 'Node not found'
        })
      } else {
        res.json(node);
      }
    });
}

function createNode(req, res) {
  let data = req.swagger.params.data.value;
  drl.createNode(data.name, data.status)
    .then((node) => {
      res.status(201).json(node);
    });
}

function setNodeStatus(req, res) {
  let data = req.swagger.params.data.value;
  let id = req.swagger.params.node_id.value;
  drl.updateNodeStatus(id, data.status)
    .then((node) => {
      res.json(node);
    });
}

module.exports = {
  listNodes,
  getNode,
  createNode,
  setNodeStatus
}
