const {spawn} = require('child_process');
let output = '';
let exitCode = -1; // -1 means in progress, otherwise exit code of process

function runAnsible() {
	
	console.log("Request recieved, starting ansible deploy");

	let ansible = spawn('make', ['provision'], {cwd: '../../vagrant/ansible-deploy', env: { ENVIRONMENT: 'local'}});
	exitCode = -1;
	output = '';
	ansible.stdout.on('data', (data) => {
		output += data;
	});
	ansible.stderr.on('data', (data) => {
		output += data;
	});
	ansible.on('close', (code) => {
		exitCode = code;
	});
}

module.exports = {
    runAnsible
};
