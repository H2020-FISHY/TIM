const { Sequelize, DataTypes } = require('sequelize');
const uuid = require('uuid');

let Node;
let Report;
let Policy;
let AttackInfo;
let CefReport;
let MsplConfig;

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
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Report.belongsTo(Node, { foreignKey: 'node_id' });
  Node.hasMany(Report, { foreignKey: 'node_id' });

  Policy = sequelize.define('Policy', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    HSPL: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        let val = this.getDataValue('HSPL');
        return val || '';
      }
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  AttackInfo = sequelize.define('AttackInfo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    policy_id: {
      type: DataTypes.UUID,
      foreignKey: {
        references: Policy,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  AttackInfo.belongsTo(Policy, { foreignKey: 'policy_id' });
  Policy.hasOne(AttackInfo, { foreignKey: 'policy_id', as: 'attack_info' });

  CefReport = sequelize.define('CefReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    device_product: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device_version: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device_event_class_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    extensions_list: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  MsplConfig = sequelize.define('MsplConfig', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['mspl', 'configuration']]
      }
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  await Node.sync();
  await Report.sync();
  await Policy.sync();
  await AttackInfo.sync();
  await CefReport.sync();
  await MsplConfig.sync();
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
  if (node !== null) {
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

async function listPolicies() {
  let policies = await Policy.findAll({
    order: [['created_at', 'DESC']],
    attributes: {
      exclude: ['created_at', 'updated_at']
    },
    include: {
      model: AttackInfo,
      as: 'attack_info',
      attributes: {
        exclude: ['id', 'policy_id', 'created_at', 'updated_at']
      }
    }
  });
  return policies;
}

async function getPolicy(policyId) {
  let policy = await Policy.findOne({
    where: {
      id: policyId
    },
    attributes: {
      exclude: ['created_at', 'updated_at']
    },
    include: {
      model: AttackInfo,
      as: 'attack_info',
      attributes:{
        exclude: ['id', 'policy_id', 'created_at', 'updated_at']
      }
    }
  });
  return policy;
}

async function createPolicy(source, status, timestamp, HSPL, attackInfo) {
  let data = {
    source,
    status,
    timestamp
  };
  if(HSPL) {
    data.HSPL = HSPL;
  }
  let policy = await Policy.create(data);
  if (attackInfo) {
    await AttackInfo.create({
      name: attackInfo.name,
      policy_id: policy.id,
      type: attackInfo.type,
      location: attackInfo.location
    });
  }
  return await getPolicy(policy.id);
}

async function deletePolicy(policyId) {
  let policy = await getPolicy(policyId);
  if(policy) {
    let attackInfo = await AttackInfo.findOne({
      where: {
        policy_id: policyId
      }
    });
    if(attackInfo) {
      await attackInfo.destroy();
    }
    await policy.destroy();
    return policy;
  }
}

async function createCefReport(device_product, device_version, event_name, device_event_class_id, severity, extensions_list) {
  let cefReport = await CefReport.create({
    device_product,
    device_version,
    event_name,
    device_event_class_id,
    severity,
    extensions_list
  });
  return cefReport;
}

async function getCefReport(id) {
  let cefReport = await CefReport.findOne({
    where: {
      id
    },
    attributes: {
      exclude: ['created_at', 'updated_at']
    }
  });
  return cefReport;
}

async function listCefReports() {
  let cefReports = await CefReport.findAll({
    order: [['created_at', 'DESC']],
    attributes: {
      exclude: ['created_at', 'updated_at']
    }
  });
  return cefReports;
}

async function createMsplConfig(type, source, status, timestamp, data) {
  let msplconfig = await MsplConfig.create({
    type,
    source,
    status,
    timestamp,
    data
  });
  return await getMsplConfig(msplconfig.id);
}

async function getMsplConfig(id) {
  let msplconfig = await MsplConfig.findOne({
    where: {
      id
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'type']
    }
  });
  return msplconfig;
}

async function listMsplConfig(type) {
  if(!type || !type.length) {
    throw new Error('Type is required');
  }
  let msplconfigs = await MsplConfig.findAll({
    where: {
      type
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'type']
    }
  });
  return msplconfigs
}

async function deleteMsplConfig(id) {
  let msplconfig = await getMsplConfig(id);
  if(msplconfig) {
    await msplconfig.destroy();
  }
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
  },
  Policy: {
    createPolicy,
    listPolicies,
    getPolicy,
    deletePolicy
  },
  CefReport: {
    createCefReport,
    getCefReport,
    listCefReports
  },
  MsplConfig: {
    createMsplConfig,
    listMsplConfig,
    getMsplConfig,
    deleteMsplConfig
  }
};
