const tar = require('../helpers/tar_helper');

function createWazuhReport(req, res) {
    let data = req.swagger.params.data.value;
    tar.sendData('Wazuh', JSON.stringify(data)).then(() => {
        res.status(204).send();
    });
}

function createReport(req, res) {
    let source = req.swagger.params.source.value;
    let data = req.swagger.params.data.value;
    tar.sendData(source, JSON.stringify(data)).then(() => {
        res.status(204).send();
    });
}

module.exports = {
    createWazuhReport,
    createReport
};