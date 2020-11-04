const database = require('./database/index.js');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', ws => {
  if (clients.length < 2) {  clients.push(ws);  }
  ws.on('message', clientMessage => {
    const parsedCM = JSON.parse(clientMessage);
    database.updateRoom(parsedCM, (error, update) => {
      if (error) {  console.log('update error:', error);  }
      else {
        database.getRoom((err, roomData) => {
          if (err) {  console.log('getRoom error:', err);  }
          else {
            console.log('roomData:', roomData);
            roomData.playerCount = undefined;
            for (let i = 0; i < clients.length; i += 1) {  clients[i].send(JSON.stringify(roomData));  }
          }
        });
      }
    });
  });
});


const express = require('express');
const server = express();
server.listen(8888, () => {  console.log('express port: 8888');  });
server.use(express.static(`${__dirname}/../client/dist`));
server.use(express.json());

server.get('/room', (req, res) => {
  database.getRoom((error, roomData) => {
    if (error) {  res.status(404).send(error);  }
    else {  res.status(200).send(roomData);  }
  });
});
// database.deleteRooms((err, delete) => {
//   if (err) {  console.log('delete error:', err);  }
//   else {
//     console.log('delete:', delete);
//     database.createRoom((er, create) => {
//       if (er) {  console.log('create error:', er);  }
//       else {  console.log('create:', create);  }
//     });
//   }
// });
