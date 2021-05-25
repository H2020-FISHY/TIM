const { Sequelize, DataTypes } = require('sequelize');
const uuid = require('uuid');

let Node;
let Report;

async function init(sequelize) {
    Node = sequelize.define('Node', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true
    });
    Report = sequelize.define('Report', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        node_id: {
            type: DataTypes.UUID,
            foreignKey: {
                references: Node,
                key: 'id'
            }
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true
    });
    Report.belongsTo(Node, { foreignKey: 'node_id' });
    Node.hasMany(Report, { foreignKey: 'node_id' });
    await Node.sync();
    await Report.sync();
}

async function createNode(name, status) {
    let node = await Node.create({
        name,
        status
    });
    return node;
}

async function listNodes() {
    let nodes = await Node.findAll({
        order: [['created_at', 'DESC']]
    });
    return nodes;
}

async function getNode(id) {
    let node = await Node.findOne({ where: { id } });
    return node;
}

async function updateNodeStatus(id, status) {
    let node = await getNode(id);
    if(node !== null) {
        node.status = status;
        await node.save();
    }
    return node;
}

async function createReport(nodeId, source, data) {
    let report = await Report.create({
        node_id: nodeId,
        source,
        data
    });
    return report;
}

async function createReportStandalone(source, data) {
    let report = await createReport(null, source, data);
    return await getReportStandalone(report.id);
}

async function listReports(nodeId) {
    let reports = await Report.findAll({
        where: {
            node_id: nodeId
        },
        order: [['created_at', 'DESC']],
        attributes: {
            exclude: ['node_id']
        }
    });
    return reports;
}

async function listReportsStandalone() {
    let reports = await Report.findAll({
        where: {
            node_id: null
        },
        order: [['created_at', 'DESC']],
        attributes: {
            exclude: ['node_id']
        }
    });
    return reports;
}

async function getReport(id) {
    let report = await Report.findOne({
        where: {
            id
        }
    });
    return report;
}

async function getReportStandalone(id) {
    let report = await Report.findOne({
        where: {
            id
        },
        attributes: {
            exclude: ['node_id']
        }
    });
    return report;
}

module.exports = {
    init,
    Node: {
        createNode,
        listNodes,
        getNode,
        updateNodeStatus
    },
    Report: {
        createReport,
        createReportStandalone,
        listReports,
        listReportsStandalone,
        getReport,
        getReportStandalone
    }
};