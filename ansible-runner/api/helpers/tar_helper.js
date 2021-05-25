const axios = require('axios');

async function sendData(data) {
    let req = {
        source: 'Wazuh',
        data: JSON.stringify(data)
    };
    let res = await axios.post(`${config.tar.protocol}://${config.tar.url}:${config.tar.port}${config.tar.reports_path}`, req);
    console.log(`Response code: ${res.status}`)
}

module.exports = {
    sendData
};