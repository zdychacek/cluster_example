var cluster = require('cluster'),
	http = require('http'),
	fs = require('fs'),
	numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log('numCPUs:', numCPUs);

	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
}
else {
	// Workers can share any TCP connection
	// In this case its a HTTP server
	http.createServer(function (req, res) {
		//console.log('Worker PID:', process.pid);

		fs.readFile('./data.html', function (err, data) {
			if (!err) {
				res.writeHead(200);
				res.end(data);
			}
			else {
				res.writeHead(500);
				res.end(err);
			}
		});
	}).listen(8000);
}