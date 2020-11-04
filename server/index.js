const express = require('express');
const WebSocket = require('ws');
const database = require('./database/index.js');

const server = express();
server.use(express.static(`${__dirname}/../client/dist`));
server.use(express.json() );

const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log('ip:', ip);
  if (clients.length < 2) {
    clients.push(ws);
    console.log('clients.length:', clients.length);
  }
  ws.on('message', (data) => {
    const parsed = JSON.parse(data);
    console.log('Message from client:', parsed);
    database.updateRoom(parsed, (updateError, postResult) => {
      if (updateError) {
        console.log('updateError:', updateError);
      } else {
        console.log('update room success:', postResult);
        database.getRoom((getError, getData) => {
          if (getError) {
            console.log('getError:', getError);
          } else {
            console.log('getData:', getData);
            getData.playerCount = undefined;
            for (let i = 0; i < clients.length; i += 1) {
              clients[i].send(JSON.stringify(getData));
            }
          }
        });
      }
    });
  });
});

server.get('/room', (req, res) => {
  // database.deleteRooms((error, data) => {
  //   if (error) {
  //     console.log('delete error');
  //   } else {
  //     console.log('rooms deleted:', data);
  //     database.createRoom((err, d) => {
  //       if (err) {
  //         console.log('create error');
  //       } else {
  //         console.log('room created:', d);
  //       }
  //     });
  //   }
  // });
  database.getRoom((err, roomData) => {
    if (err) {
      console.log('axios get error:', err);
      res.status(404).send(err);
    } else {
      res.status(200).send(roomData);
    }
  });
});

const port = 8888;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
