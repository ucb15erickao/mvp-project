const db = require('./database');

const express = require('express');
const server = express();
server.listen(8888, () => {  console.log('express port: 8888');  });
server.use(express.static(`${__dirname}/../client/dist`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const socketServers = {};
const clients = {};

server.get('/tables', (req, res) => {
  /*
  db.getTables((error, data) => {
    if (error) {
      console.log('getTables error:', error);
      res.status(400).send(error);
    } else {
      console.log('getTables data:', data);
      res.status(200).send(data);
    }
  });
  */
  console.log('clients:', clients);
  res.status(200).send(clients);
});

server.put('/createTable/:tableNumber', (req, res) => {
  /*
  db.createTable(tableNumber, (error, data) => {
    if (error) {
      console.log('createTable error:', error);
      res.status(500).send(error);
    } else {
      tableNumber = Object.keys(clients).length;
      wss.on('connection', ws => {
        clients[tableNumber] = [ws];
        ws.send(1);
        ws.on('message', clientMessage => {
          console.log('clientMessage:', clientMessage);
          for (let i = 0; i < clients[tableNumber].length; i++) {
            clients[tableNumber][i].send(clientMessage);
          }
        });
      });
      console.log('createTable data:', data);
      res.status(200).send(data);
    }
  });
  */
  let tableNumber = Number(req.params.tableNumber);
  clients[tableNumber] = [];
  // console.log('createTable tableNumber:', tableNumber);
  let portNumber = 8000 + tableNumber;
  socketServers[tableNumber] = new WebSocket.Server({ port: portNumber });
  refreshSockets();
  /*
  socketServers[tableNumber].on('connection', ws => {
    clients[tableNumber] = [ws];
    // console.log('createTable clients[tableNumber]:', clients[tableNumber]);
    ws.send(1);
    ws.on('message', clientMessage => {
      console.log('clientMessage:', clientMessage);
      for (let i = 0; i < clients[tableNumber].length; i++) {
        clients[tableNumber][i].send(clientMessage);
      }
    });
  });
  */
  // console.log('clients after create:', clients);
  res.status(200).send(JSON.stringify(tableNumber));
});

server.put('/joinTable/:tableNumber', (req, res) => {
  let tableNumber = Number(req.params.tableNumber);
  refreshSockets();
  // console.log('joinTable tableNumber:', tableNumber);
  /*
  socketServers[tableNumber].on('connection', ws => {
    clients[tableNumber].push(ws);
    // console.log('joinTable clients[tableNumber]:', clients[tableNumber]);
    ws.send(2);
    ws.on('message', clientMessage => {
      console.log('clientMessage:', clientMessage);
      for (let i = 0; i < clients[tableNumber].length; i++) {
        clients[tableNumber][i].send(clientMessage);
      }
    });
  });
  */
  // console.log('clients after join:', clients);
  res.status(200).send(JSON.stringify(tableNumber));
});


const refreshSockets = () => {
  Object.keys(socketServers).map((key, i) => {
    console.log('Object.keys(socketServers).map');
    socketServers[key].on('connection', ws => {
      console.log('socketServers[key].on connection');
      if (clients[key].length < 2) {
        clients[key].push(ws);
      }
      // console.log('joinTable clients[key]:', clients[key]);
      ws.send(clients[key].length);
      console.log('map clients[key]:', clients[key]);
      ws.on('message', clientMessage => {
        console.log('socketServers[key].on message');
        console.log('clientMessage:', clientMessage);
        for (let i = 0; i < clients[key].length; i++) {
          clients[key][i].send(clientMessage);
        }
      });
    });
  });
}




/*
const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', ws => {
  if (clients.length < 2) {  clients.push(ws)  }
  ws.send(clients.length);
  ws.on('message', clientMessage => {
    console.log('clientMessage:', clientMessage);
    for (let i = 0; i < clients.length; i++) {
      clients[i].send(clientMessage);
    }
  });
});
*/
