var portNumber = 8888;
var http 	= require('http');
var url 	= require('url');
var path 	= require('path');
var fs 		= require('fs');

// Basic server for delivering the client files
var server = http.createServer(function (request, response) {

	console.log('Incoming Request');

	var filePath = '.' + request.url;
	if (filePath == './'){
		filePath = './index.html';
	}

	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	filePath = "client/"+filePath;
	fs.exists(filePath, function(exists) {

		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});

	console.log('Served');
}).listen(portNumber);
console.log('listening on port', portNumber)