const express = require('express');

const server = express();
server.use(express.static(`${__dirname}/../client/dist`));

const port = 8888;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
