import React from 'react';
import style from '../../style.css';
import Opponent from './Opponent';
import Board from './Board';
import Player from './Player';
import ControlPanel from './ControlPanel';
import { shuffleDeck, deal, pick5, determineWinner, convertHand } from './gameFunctions';

const socket = new WebSocket("ws://localhost:8080");
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0,
      gameOver: false,
      winner: 0,
      winning: {
        score: 0,
        hand: [],
        high: ''
      },
      losing: {
        score: 0,
        hand: [],
        high: ''
      },
      prevFirstBet: 1,
      turn: 1,
      bettingRound: 0,
      currentBets: [],
      betSelect: 0,
      pot: 0,
      deck: [],
      board: ['', '', '', '', ''],
      p1: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 },
      p2: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 },
      deal: false
    };
    this.deal = this.deal.bind(this);
    this.clicker = this.clicker.bind(this);
    this.changeBet = this.changeBet.bind(this);
  };


  componentDidMount() {
    socket.addEventListener('open', () => {
      socket.addEventListener('message', serverMessage => {
        const parsedSM = JSON.parse(serverMessage.data);
        if (typeof parsedSM === 'number') {
          this.setState({ playerCount: parsedSM }, () => { console.log('Player', this.state.playerCount)  });
        } else {
          const { p1, p2 } = parsedSM;
          if (parsedSM.bettingRound === 5) {  parsedSM.deal = false  }
          if (p1 && p2) {  parsedSM.betSelect = eval(`p${this.state.playerCount}`).minBet  }
          this.setState(parsedSM, () => {if (this.state.deal === true) {  this.deal()  }});
        }
      });
    });
  };


  changeBet() {  this.setState({ betSelect: Number(event.target.value) }, () => {  console.log(`bet: ${this.state.betSelect}`)  })  };


  clicker() {
    let { gameOver, playerCount, prevFirstBet, turn, bettingRound, currentBets, betSelect, pot, board, p1, p2 } = this.state;
    bettingRound++;
    let  player = p1, opponent = p2;
    if (playerCount === 2) {  player = p2, opponent = p1  }
    if (turn === 2) {  turn = 1  }
    else {  turn = 2  }
    currentBets.push(event.target.value);

    if (event.target.value === 'fold') {
      let opponent = 1;
      if (playerCount === 1) {  opponent++  }
      const newPot = pot + p1.bet + p2.bet;
      p1.bet = 0, p2.bet = 0, p1.minBet = 1, p2.minBet = 1;
      socket.send(JSON.stringify({ winner: opponent, bettingRound, currentBets, pot: newPot, p1, p2 }));
    } else {
      if (event.target.value === 'bet') {
        player.bet += Number(betSelect);
        player.chips -= Number(betSelect);
        opponent.minBet = player.bet - opponent.bet + 1;
      } else if (event.target.value === 'check' && currentBets[currentBets.length - 2] === 'bet') {
        const difference = opponent.bet - player.bet;
        if (difference <= player.chips) {
          player.bet += difference;
          player.chips -= difference;
        } else {
          const excess = difference - player.chips;
          opponent.bet -= excess, opponent.chips += excess;
          player.bet += player.chips;
          player.chips = 0;
        }
      }

      if (currentBets.length > 1 && event.target.value === 'check') {
        if (bettingRound <= 5) {
          const newPot = pot + p1.bet + p2.bet;
          p1.bet = 0, p2.bet = 0, p1.minBet = 1, p2.minBet = 1;
          const updates = { turn: prevFirstBet, bettingRound, currentBets: [], pot: newPot, p1, p2, deal: true };
          if (bettingRound === 5) {
            const p1play = pick5(board.concat(p1.hand));
            console.log('p1 hand:', p1play);
            const p2play = pick5(board.concat(p2.hand));
            console.log('p2 hand:', p2play);
            updates.winner  = determineWinner(p1play, p2play)[1];
            if (updates.winner[0]) {
              p1play.high = updates.winner[0][0];
              p2play.high =  updates.winner[0][1];
            }
            p1play.hand = convertHand(p1play.hand), p2play.hand = convertHand(p2play.hand);
            updates.winning = p1play, updates.losing = p2play;
            if (updates.winner === 2) {  updates.winning = p2play, updates.losing = p1play  }
            console.log(`p${updates.winner} wins. ${updates.winning.hand} beats ${updates.losing.hand}`);
          }
          socket.send(JSON.stringify(updates));
        } else {  this.nextHand()  }
      } else if (Number.isNaN(Number(event.target.value)) === false) {
        if (Number.isNaN(Number(currentBets[currentBets.length - 2])) === false) {
          if (bettingRound <= 1) {
            socket.send(JSON.stringify({ turn: prevFirstBet, bettingRound, currentBets: [], deal: true }));
          } else {
            if (gameOver) {  this.reset()  }
            else {  this.nextHand()  }
          }
        } else {  socket.send(JSON.stringify({ currentBets }))  }
      } else {
        const updates = { turn, currentBets, p1: player, p2: opponent };
        if (playerCount === 2) {  updates.p1 = opponent, updates.p2 = player  }
        socket.send(JSON.stringify(updates));
      }

    }
  };


  deal() {
    let { winner, bettingRound, deck, board, p1, p2 } = this.state;
    if (deck.length < 1 || (bettingRound === 1 && deck.length < 4) || (bettingRound === 2 && deck.length < 3)) {  deck = shuffleDeck()  }
    if (bettingRound === 1) {
      for (let c = 0; c < 2; c++) {
        for (let p = 0; p < 2; p++) {
          [ eval(`p${p + 1}`).hand[c], deck ] = deal(deck);
        }
      }
      socket.send(JSON.stringify({ currentBets: [], deck, p1, p2, deal: false }));
    } else {
      if (bettingRound === 2) {
        for (let i = 0; i < 3; i += 1) {
          [ board[i], deck ] = deal(deck);
        }
      } else {  [ board[bettingRound], deck ] = deal(deck)  }
      socket.send(JSON.stringify({ currentBets: [], deck, board, deal: false }));
    }
  };


  nextHand() {
    const { gameOver, winner, prevFirstBet, pot, p1, p2 } = this.state;
    let newFirstBet = 1;
    if (prevFirstBet === 1) { newFirstBet++ }
    if (winner !== 0) {
      const winnings = pot + p1.bet + p2.bet;
      if (winner === 1) { p1.chips += winnings }
      else if (winner === 1) { p2.chips += winnings }
      else {  p1.chips += (winnings / 2), p2.chips += (winnings / 2)   }
    }
    p1.hand = ['', ''], p2.hand = ['', ''], p1.bet = 1, p2.bet = 1, p1.minBet = 1, p2.minBet = 1, p1.chips--, p2.chips--;
    const updates = { winner: 0, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2, deal: true };
    if (winner !== 0) {  updates.prevFirstBet = newFirstBet, updates.turn = newFirstBet, updates.winning = [], updates.losing = []  }
    if (p1.chips < 0 || p2.chips < 0 ) {  updates.gameOver = true, updates.winner = winner   }
    socket.send(JSON.stringify(updates));
  };


  reset() {
    const { prevFirstBet, p1, p2 } = this.state;
    let newFirstBet = 1;
    if (prevFirstBet === 1) {  newFirstBet++  }
    p1.hand = ['', ''], p2.hand = ['', ''], p1.bet = 1, p2.bet = 1, p1.minBet = 1, p2.minBet = 1, p1.chips = 19, p2.chips = 19;
    const updates = { gameOver: false, winner: 0, winning: [], losing: [], prevFirstBet: newFirstBet, turn: newFirstBet, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2, deal: true };
    socket.send(JSON.stringify(updates));
  };


  render() {
    const { playerCount, gameOver, winner, winning, losing, prevFirstBet, turn, bettingRound, currentBets, pot, deck, board, p1, p2 } = this.state;
    let opponent = p2, player = p1;
    if (playerCount === 2) {  opponent = p1, player = p2  }
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>
            <Opponent playerCount={playerCount} gameOver={gameOver} winner={winner} winning={winning} losing={losing} prevFirstBet={prevFirstBet} turn={turn} bettingRound={bettingRound} currentBets={currentBets} pot={pot} opponent={opponent} />
            <Board playerCount={playerCount} gameOver={gameOver} prevFirstBet={prevFirstBet} pot={pot} board={board} />
            <Player playerCount={playerCount} gameOver={gameOver} winner={winner} winning={winning} losing={losing} prevFirstBet={prevFirstBet} turn={turn} bettingRound={bettingRound} currentBets={currentBets} pot={pot} player={player} />
          </div>
          <ControlPanel clicker={this.clicker} changeBet={this.changeBet} playerCount={playerCount} gameOver={gameOver} winner={winner} turn={turn} bettingRound={bettingRound} currentBets={currentBets} player={player} opponent={opponent} />
        </div>
      </div>
    );
  };

}

export default Table;
