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
            const { deck, bettingRound, turn, board, p1, p2, pot } = getData;
            const response = { deck, bettingRound, turn, board, p1, p2, pot };
            for (let i = 0; i < clients.length; i += 1) {
              console.log('clients.length:', clients.length);
              console.log('response:', response);
              clients[i].send(JSON.stringify(response));
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
      res.status(201).send(postResult);
    }
  });
});

const port = 8888;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
