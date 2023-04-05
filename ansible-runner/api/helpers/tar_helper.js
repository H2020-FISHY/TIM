const axios = require('axios');

async function sendData(source, data) {
    let req = {
        source: source,
        data: data
    };
    await axios.post(`${config.tar.protocol}://${config.tar.url}:${config.tar.port}${config.tar.reports_path}`, req);
}

module.exports = {
    sendData
};
