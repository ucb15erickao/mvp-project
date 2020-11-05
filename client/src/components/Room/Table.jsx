import React from 'react';
import axios from 'axios';

import style from '../../style.css';
import Opponent from './Opponent';
import Board from './Board';
import Player from './Player';
import HUD from './HUD';
import { shuffleDeck, deal, pick5, determineWinner } from './gameFunctions';

const socket = new WebSocket("ws://localhost:8080");
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0,
      gameOver: false,
      winner: 0,
      prevFirstBet: 1,
      turn: 1,
      bettingRound: 1,
      currentBets: [],
      betSelect: 0,
      pot: 0,
      deck: [],
      board: ['', '', '', '', ''],
      p1: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 },
      p2: { hand: ['', ''], chips: 19, bet: 1, minBet: 1 }
    };
    socket.addEventListener('message', serverMessage => {
      const parsedSM = JSON.parse(serverMessage.data);
      this.setState(parsedSM, () => {
        const { p1, p2 } = this.state;
        const betSelect = eval(`p${this.state.playerCount}`).minBet;
        this.setState({ betSelect }, () => {  console.log('state.betSelect set to min by socket:', this.state.betSelect);  });
      });
    });
    this.play = this.play.bind(this);
    this.clicker = this.clicker.bind(this);
    this.changeBet = this.changeBet.bind(this);
  };

  componentDidMount() {
    socket.addEventListener('open', () => {
      axios.get('/room')
        .then(res => {
          let { playerCount } = res.data;
          if (playerCount < 2) {  playerCount++;  }
          else {  playerCount = 1;  }
          this.setState({ playerCount }, () => {  this.play();  });
        })
        .catch(() => {  console.log('axios get error');  });
    });
  };

  changeBet() {
    this.setState({ betSelect: Number(event.target.value) }, () => {  console.log('bet selected:', this.state.betSelect);  });
  };

  clicker() {
    let { playerCount, prevFirstBet, turn, bettingRound, currentBets, betSelect, pot, board, p1, p2 } = this.state;
    if (turn === 2) {  turn = 1;  }
    else {  turn = 2;  }
    currentBets.push(event.target.value);

    if (event.target.value === 'reset') {
      this.reset();
    } else if (event.target.value === 'fold') {
      let opponent = 1;
      if (playerCount === 1) {  opponent++;  }
      this.setState({ winner: opponent }, () => {  this.play();  });
    } else {
      let  player = p1, opponent = p2;
      if (playerCount === 2) {  player = p2, opponent = p1;  }

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
          player.bet += player.chips;
          const excess = difference - player.chips;
          player.chips = 0;
          opponent.bet -= excess;
          opponent.chips += excess;
        }
      }

      if (currentBets.length > 1 && event.target.value === 'check') {
        if (bettingRound < 5) {
          const newPot = pot + p1.bet + p2.bet;
          p1.bet = 0, p2.bet = 0;
          p1.minBet = 1, p2.minBet = 1;
          const updates = { turn: prevFirstBet, bettingRound: bettingRound + 1, currentBets: [], pot: newPot, p1, p2 };
          if (bettingRound === 4) {
            const p1top5 = pick5(board.concat(p1.hand));
            const p2top5 = pick5(board.concat(p2.hand));
            let gameWinner = determineWinner(p1top5, p2top5);
            if (JSON.stringify(gameWinner) === JSON.stringify(p1top5)) {  gameWinner = 1;  }
            else {  gameWinner = 2;  }
            updates.winner = gameWinner;
          }
          this.setState(updates, () => {  this.play();  });
        } else {  this.nextHand();  }
      } else if (Number.isNaN(Number(event.target.value)) === false) {
        if (Number.isNaN(Number(currentBets[currentBets.length - 2])) === false) {
          this.nextHand();
        } else {
          this.setState({ currentBets }, () => {  socket.send(JSON.stringify({ currentBets }));  });
        }
      } else {
        let updates = { turn, currentBets, p1: player, p2: opponent };
        if (playerCount === 2) {  updates = { turn, currentBets, p1: opponent, p2: player };  }
        this.setState(updates, () => {  socket.send(JSON.stringify(updates));  });
      }
    }
  };

  play() {
    let { bettingRound, deck, board, p1, p2 } = this.state;
    if (deck.length < 1 || (bettingRound === 1 && deck.length < 4) || (bettingRound === 2 && deck.length < 3)) {  deck = shuffleDeck();  }
    if (bettingRound === 1) {
      for (let p = 0; p < 2; p++) {
        for (let c = 0; c < 2; c++) {
          [ eval(`p${p + 1}`).hand[c], deck ] = deal(deck);
        }
      }
      this.setState({ deck, p1, p2 }, () => {  socket.send(JSON.stringify(this.state));  });
    } else if (bettingRound < 5) {
      if (bettingRound === 2) {  for (let i = 0; i < 3; i += 1) { [board[i], deck] = deal(deck); }  }
      else {  [board[bettingRound], deck] = deal(deck);  }
      this.setState({ deck, board }, () => {  socket.send(JSON.stringify(this.state));  });
    } else {  socket.send(JSON.stringify(this.state));  }
  };

  nextHand() {
    const { gameOver, winner, prevFirstBet, pot, p1, p2 } = this.state;
    const winnings = pot + p1.bet + p2.bet;
    if (winner === 1) {  p1.chips += winnings;  }
    else {  p2.chips += winnings;  }
    let newFirstBet = 1;
    if (prevFirstBet === 1) {  newFirstBet++;  }
    p1.hand = ['', ''], p2.hand = ['', ''];
    p1.chips--, p2.chips--;
    p1.bet = 1, p2.bet = 1;
    p1.minBet = 1, p2.minBet = 1;
    const updates = { winner: 0, prevFirstBet: newFirstBet, turn: newFirstBet, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2 };
    if (p1.chips < 0 || p2.chips < 0 ) {  updates.gameOver = true;  }
    this.setState(updates, () => {  this.play();  });
  };

  reset() {
    const { prevFirstBet, p1, p2 } = this.state;
    let newFirstBet = 1;
    if (prevFirstBet === 1) {  newFirstBet++;  }
    p1.hand = ['', ''], p2.hand = ['', ''];
    p1.chips = 19, p2.chips = 19;
    p1.bet = 1, p2.bet = 1;
    p1.minBet = 1, p2.minBet = 1;
    const updates = { gameOver: false, winner: 0, prevFirstBet: newFirstBet, turn: newFirstBet, bettingRound: 1, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2 };
    this.setState(updates, () => {  this.play();  });
  };

  render() {
    const { playerCount, gameOver, winner, prevFirstBet, turn, bettingRound, currentBets, pot, deck, board, p1, p2 } = this.state;
    let opponent = p2, player = p1;
    if (playerCount === 2) {  opponent = p1; player = p2;  }
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>
            <Opponent playerCount={playerCount} gameOver={gameOver} winner={winner} prevFirstBet={prevFirstBet} turn={turn} bettingRound={bettingRound} currentBets={currentBets} opponent={opponent} />
            <Board playerCount={playerCount} gameOver={gameOver} prevFirstBet={prevFirstBet} pot={pot} board={board} />
            <Player playerCount={playerCount} gameOver={gameOver} winner={winner} prevFirstBet={prevFirstBet} turn={turn} bettingRound={bettingRound} player={player} />
          </div>
          <HUD clicker={this.clicker} changeBet={this.changeBet} playerCount={playerCount} gameOver={gameOver} winner={winner} turn={turn} bettingRound={bettingRound} currentBets={currentBets} player={player} opponent={opponent} />
        </div>
      </div>
    );
  };

}

export default Table;
