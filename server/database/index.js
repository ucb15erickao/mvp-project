const mongoose = require('mongoose');
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/tables';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const roomSchema = mongoose.Schema({
  _id: Number,
  password: String,
  playerCount: Number,
  gameOver: Boolean,
  winner: Number,
  winning: { score: Number, hand: [String], high: String },
  losing: { score: Number, hand: [String], high: String },
  prevFirstBet: Number,
  turn: Number,
  deal: Boolean,
  bettingRound: Number,
  currentBets: [String],
  pot: Number,
  deck: [String],
  board: [String],
  p1: { hand: [String], chips: Number, bet: Number, minBet: Number },
  p2: { hand: [String], chips: Number, bet: Number, minBet: Number }
});

const Room = mongoose.model('Room', roomSchema);

const getRooms = (callback) => {
  Room.find({}, (getError, roomData) => {
    callback(getError, roomData);
  });
};

const updateRoom = (tid, updates, callback) => {
  Room.updateOne({ _id: tid }, updates, (postError, postResult) => {
    callback(postError, postResult);
  });
};

const createRoom = (tid, callback) => {
  Room.create({ _id: tid }, (createError, createResult) => {
    callback(createError, createResult);
  });
}

const deleteRoom = (tid, callback) => {
  Room.deleteOne({ _id: tid }, (deleteError, deleteResult) => {
    callback(deleteError, deleteResult);
  });
}

const deleteAllRooms = (callback) => {
  Room.deleteMany({}, (deleteError, deleteResult) => {
    callback(deleteError, deleteResult);
  });
}

module.exports = { Room, getRooms, updateRoom, createRoom, deleteRoom, deleteAllRooms };
