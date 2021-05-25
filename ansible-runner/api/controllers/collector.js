const tar = require('../helpers/tar_helper');

function createWazuhReport(req, res) {
    let data = req.swagger.params.data.value;
    tar.sendData(data).then(() => {
        res.status(204).send();
    });
}

module.exports = {
    createWazuhReport
};