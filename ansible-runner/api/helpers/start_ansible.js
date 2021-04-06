const { exec } = require("child_process");
const extend = require('extend');

function startAnsible() {
    console.log("Request recieved, starting ansible deploy");

    exec("cd ../../vagrant/ansible-deploy && make provision", (error, stdout, stderr) => {
    //exec("cd ../ansible-deploy/ansible-deploy-elk && make create provision", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports = {
    startAnsible
};
