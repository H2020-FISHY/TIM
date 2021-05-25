const { Sequelize } = require('sequelize');
const models = require('./models');

async function init() {
    let sequelize = new Sequelize('sqlite::memory:');
    await models.init(sequelize);
    await sequelize.sync();
}

module.exports = {
    init
};