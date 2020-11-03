const express = require('express');
const WebSocket = require('ws');
const database = require('./database/index.js');

const server = express();
server.use(express.static(`${__dirname}/../client/dist`));
server.use(express.json() );

const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', (ws) => {
  if (clients.length < 2) {
    clients.push(ws);
    console.log('clients:', clients);
  }
  ws.on('message', (data) => {
    console.log('incoming message:', data);
    console.log('wss.clients', wss.clients);
    for (let i = 0; i < clients.length; i += 1) {
      console.log('clients.length:', clients.length);
      clients[i].send(`incoming message received and sent back to clients: ${data}`);
    }
    // ws.send(`incoming message received and send back to clients: ${data}`);
  });
});

server.get('/room', (req, res) => {
  database.getRoom((getError, getData) => {
    if (getError) {
      console.log('getError:', getError);
      res.status(404).send(getError);
    } else {
      // console.log('getData:', getData);
      res.status(200).send(getData);
    }
  });
});

server.post('/room', (req, res) => {
  // console.log('req.body:', req.body);
  database.updateRoom(req.body, (postError, postResult) => {
    if (postError) {
      console.log('postError:', postError);
      res.status(400).send(postError);
    } else {
      // console.log('postResult:', postResult);
      res.status(201).send(postResult);
    }
  });
});

const port = 8888;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
