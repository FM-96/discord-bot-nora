const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// create webserver and attach socket.io
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

module.exports = {
	app,
	httpServer,
	io,
};
