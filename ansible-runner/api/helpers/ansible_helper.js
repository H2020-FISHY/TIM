const {spawn} = require('child_process');
let output = '';
let exitCode = -2; // -2 means not started, -1 means in progress, otherwise exit code of process

function runAnsible() {
	
	console.log("Request recieved, starting ansible deploy");

	process.env["ENVIRONMENT"] = "local"
	let ansible = spawn('make', ['provision'], {cwd: '/ansible/security-monitoring-ansible/', env: process.env, shell: true});
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

function statusCheck() {
	
	console.log("Request recieved, checking status");

	let status = 'success';
	if(exitCode === -2) {
		status = "not_started";
	} else if(exitCode === -1) {
		status = 'in_progress';
	} else if(exitCode > 0) {
		status = 'failed';
	}
	let response = {
		status,
		output: output
	};
	return response;
}

module.exports = {
	runAnsible,
	statusCheck
};
