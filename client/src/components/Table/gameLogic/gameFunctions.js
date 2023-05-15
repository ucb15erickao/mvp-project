const { shuffleDeck, dealCard, pick5, determineWinner, convertHand } = require('./cardFunctions');

const gameState = {
  tableID: 0,
  playerCount: 0,
  gameOver: false,
  winner: 0,
  winning: { score: 0, hand: [], high: '' },
  losing: { score: 0, hand: [], high: '' },
  prevFirstBet: 1,
  turn: 1,
  deal: false,
  bettingRound: 0,
  currentBets: [],
  betSelect: 0,
  pot: 0,
  deck: [],
  board: ['', '', '', '', ''],
  p1: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 },
  p2: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 }
};

const fold = (playerCount, bettingRound, currentBets, pot, p1, p2) => {
  let opponent = 1;
  if (playerCount === 1) {
    opponent++;
  }
  const newPot = pot + p1.bet + p2.bet;
  p1.bet = 0, p2.bet = 0, p1.minBet = 1, p2.minBet = 1;
  return { winner: opponent, bettingRound, currentBets, pot: newPot, p1, p2 };
};

const endRound = (prevFirstBet, bettingRound, currentBets, pot, board, p1, p2) => {
  const newPot = pot + p1.bet + p2.bet;
  p1.bet = 0, p2.bet = 0, p1.minBet = 1, p2.minBet = 1;
  const updates = { turn: prevFirstBet, bettingRound, currentBets, pot: newPot, p1, p2, deal: true };
  if (bettingRound === 5) {
    const p1play = pick5(board.concat(p1.hand)), p2play = pick5(board.concat(p2.hand));
    const judge = determineWinner(p1play, p2play);
    p1play.hand = convertHand(p1play.hand), p2play.hand = convertHand(p2play.hand);
    if (judge[0] !== null) {
      p1play.high = judge[0][0], p2play.high = judge[0][1];
    }
    updates.winner = judge[1];
    updates.winning = p1play, updates.losing = p2play;
    if (updates.winner === 2) {
      updates.winning = p2play, updates.losing = p1play;
    }
  }
  return updates;
};

const updatePlayers = (eTarget, betSelect, player, opponent) => {
  if (eTarget === 'bet') {
    player.bet += Number(betSelect), player.chips -= Number(betSelect);
    opponent.minBet = player.bet - opponent.bet + 1;
  } else if (eTarget === 'call') {
    const difference = opponent.bet - player.bet;
    if (difference <= player.chips) {
      player.bet += difference, player.chips -= difference;
    } else {
      const excess = difference - player.chips;
      opponent.chips += excess, opponent.bet -= excess;
      player.chips = 0, player.bet += player.chips;
    }
  }
  return { player, opponent };
};

const updateGame = (bettingRound, deck, board, p1, p2) => {
  if (deck.length < 1 || (bettingRound === 1 && deck.length < 4) || (bettingRound === 2 && deck.length < 3)) {
    deck = shuffleDeck();
  }
  if (bettingRound === 1) {
    for (let c = 0; c < 2; c++) {
      for (let p = 0; p < 2; p++) {
        [ eval(`p${p + 1}`).hand[c], deck ] = dealCard(deck);
      }
    }
  } else if (bettingRound === 2) {
    for (let i = 0; i < 3; i += 1) {
      [ board[i], deck ] = dealCard(deck);
    }
  } else {
    [ board[bettingRound], deck ] = dealCard(deck);
  }
  return { currentBets: [], deck, board, deal: false };
};

const startRound = (gameOver, winner, prevFirstBet, pot, p1, p2) => {
  let newFirstBet = 1;
  if (prevFirstBet === 1) { newFirstBet++ }
  if (winner !== 0) {
    const winnings = pot + p1.bet + p2.bet;
    if (winner === 1) { p1.chips += winnings }
    else if (winner === 2) { p2.chips += winnings }
    else { p1.chips += (winnings / 2), p2.chips += (winnings / 2) }
  }
  p1.hand = ['', ''], p2.hand = ['', ''];
  p1.bet = 1, p2.bet = 1, p1.minBet = 1, p2.minBet = 1;
  p1.chips--, p2.chips--;
  const updates = { winner: 0, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2, deal: true };
  if (winner !== 0) {
    updates.prevFirstBet = newFirstBet, updates.turn = newFirstBet;
    updates.winning = [], updates.losing = [];
  }
  if (p1.chips < 0 || p2.chips < 0) {
    updates.gameOver = true, updates.winner = winner;
  }
  return updates;
};

const newGame = (prevFirstBet, p1, p2) => {
  let newFirstBet = 1;
  if (prevFirstBet === 1) { newFirstBet++ }
  p1.hand = ['', ''], p2.hand = ['', ''];
  p1.bet = 1, p2.bet = 1, p1.minBet = 1, p2.minBet = 1;
  p1.chips = 19, p2.chips = 19;
  return { gameOver: false, winner: 0, winning: [], losing: [], prevFirstBet: newFirstBet, turn: newFirstBet, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2, deal: true };
};

module.exports = { gameState, fold, endRound, updatePlayers, updateGame, startRound, newGame };
