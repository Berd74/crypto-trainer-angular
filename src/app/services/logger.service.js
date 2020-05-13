// this file is loaded via angular.json configuration
// for production just comment the body of the functions

function log(msg) {
	console.log(msg);
}

function logtri(name) {
	if (name.includes('Module')) {
		console.log('%c' + name + ' Triggered! ', 'color: #00eeff');
	} else if (name.includes('Component')) {
		console.log('%c' + name + ' Triggered! ', 'color: #0088bb');
	} else if (name.includes('Service')) {
		console.log('%c' + name + ' Triggered! ', 'color: #bb8800');
	} else {
		console.log('%c' + name + ' Triggered! ', 'color: #779977');
	}
}
