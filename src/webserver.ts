import http from 'node:http';
import express from 'express';

// create webserver
const app = express();
const httpServer = http.createServer(app);

export default {
	app,
	httpServer,
};
