const express = require('express');
const http = require('http');

// create webserver
const app = express();
const httpServer = http.createServer(app);

module.exports = {
	app,
	httpServer,
};
