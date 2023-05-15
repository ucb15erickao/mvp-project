const mongoose = require('mongoose');
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/tables';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const tableSchema = mongoose.Schema({
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

const Table = mongoose.model('Table', tableSchema);

const getTables = (callback) => {
  Table.find({}, (getError, tableData) => {
    callback(getError, tableData);
  });
};

const updateTable = (tid, updates, callback) => {
  Table.updateOne({ _id: tid }, updates, (postError, postResult) => {
    callback(postError, postResult);
  });
};

const createTable = (tid, callback) => {
  Table.create({ _id: tid }, (createError, createResult) => {
    callback(createError, createResult);
  });
}

const deleteTable = (tid, callback) => {
  Table.deleteOne({ _id: tid }, (deleteError, deleteResult) => {
    callback(deleteError, deleteResult);
  });
}

const deleteAllTables = (callback) => {
  Table.deleteMany({}, (deleteError, deleteResult) => {
    callback(deleteError, deleteResult);
  });
}

module.exports = { Table, getTables, updateTable, createTable, deleteTable, deleteAllTables };
