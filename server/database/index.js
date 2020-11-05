const mongoose = require('mongoose');
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/fetcher';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const roomSchema = mongoose.Schema({
  _id: Number,
  playerCount: Number,
  gameOver: Boolean,
  winner: Number,
  prevFirstBet: Number,
  turn: Number,
  bettingRound: Number,
  currentBets: [String],
  pot: Number,
  deck: [String],
  board: [String],
  p1: {
    hand: [String],
    chips: Number,
    bet: Number,
    minBet: Number
  },
  p2: {
    hand: [String],
    chips: Number,
    bet: Number,
    minBet: Number
  }
});

const Room = mongoose.model('Room', roomSchema);

const getRoom = (callback) => {
  Room.findById(1, (getError, roomData) => {
    callback(getError, roomData);
  });
};

const updateRoom = (updates, callback) => {
  Room.updateOne({_id: 1}, updates, (postError, postResult) => {
    callback(postError, postResult);
  });
};

const createRoom = (callback) => {
  Room.create({_id: 1}, (createError, createResult) => {
    callback(createError, createResult);
  });
}

const deleteRooms = (callback) => {
  Room.deleteMany({}, (deleteError, deleteResult) => {
    callback(deleteError, deleteResult);
  });
}

module.exports = { Room, getRoom, updateRoom, createRoom, deleteRooms };
