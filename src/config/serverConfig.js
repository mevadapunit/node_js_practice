// serverConfig.js
const http = require('http');
const express = require('express');
const app = express();

const DEFAULT_PORT = process.env.PORT || 4035;
let currentPort = DEFAULT_PORT;

const checkPortAvailability = (port) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') reject();
      else reject(err);
    }).once('listening', () => {
      server.close();
      resolve(port);
    }).listen(port);
  });
};

const startServer = async () => {
  try {
    await checkPortAvailability(currentPort);
    app.listen(currentPort, () => {
      console.log(`Server running on port ${currentPort}`);
    });
  } catch (err) {
    console.log(`Port ${currentPort} is already in use. Trying the next available port...`);
    currentPort++; 
    startServer(); 
  }
};

module.exports = { startServer, app };
