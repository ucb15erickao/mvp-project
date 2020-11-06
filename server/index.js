const express = require('express');
const server = express();
server.listen(8888, () => {  console.log('express port: 8888');  });
server.use(express.static(`${__dirname}/../client/dist`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', ws => {
  if (clients.length < 2) {  clients.push(ws)  }
  ws.send(clients.length);
  ws.on('message', clientMessage => {
    for (let i = 0; i < clients.length; i++) {  clients[i].send(clientMessage)  }
  });
});
