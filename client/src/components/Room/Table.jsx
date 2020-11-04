import React from 'react';
import axios from 'axios';

import style from '../../style.css';
import Opponent from './Opponent';
import Board from './Board';
import Player from './Player';
import HUD from './HUD';
import { shuffleDeck, deal } from './functions';

const socket = new WebSocket("ws://localhost:8080");
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0,
      prevFirstBet: 1,
      turn: 1,
      bettingRound: 0,
      currentBets: [],
      pot: 0,
      deck: [],
      board: ['', '', '', '', ''],
      p1: {
        hand: ['', ''],
        chips: 24,
        bet: 1,
        roundAction: 0
      },
      p2: {
        hand: ['', ''],
        chips: 24,
        bet: 1,
        roundAction: 0
      }
    };
    this.play = this.play.bind(this);
    this.clicker = this.clicker.bind(this);
    this.changeBet = this.changeBet.bind(this);
    socket.addEventListener('message', serverMessage => {
      this.setState(JSON.parse(serverMessage.data), () => {  console.log('WebSocket:', this.state);  });
    });
  };

  componentDidMount() {
    socket.addEventListener('open', () => {
      axios.get('/room')
        .then(res => {
          let { playerCount } = res.data;
          if (playerCount < 2) {  playerCount++;  }
          else {  playerCount = 1;  }
          this.setState({ playerCount }, () => {  socket.send(JSON.stringify(this.state));  });
        })
        .catch(() => {  console.log('axios get error');  });
    });
  };

  changeBet() {
    console.log(event.target.value);
  };

  clicker() {
    let { playerCount, turn, bettingRound, currentBets, pot, p1, p2 } = this.state;
    if (turn === 2) {  turn = 1;  }
    else {  turn = 2;  }
    currentBets.push(event.target.value);
    if (event.target.value === 'bet') {
      console.log(event.target.value);
    } else if (event.target.value === 'fold') {
      const winnings = pot + p1.bet + p2.bet;
      p1.bet = 0, p2.bet = 0;
      if (playerCount === 1) {
        p2.chips += winnings;
      } else {
        p1.chips += winnings;
      }
      this.setState({ p1, p2 }, () => {  this.nextHand();  });
    }
    if (currentBets.length > 1 && (event.target.value === 'check' || Number.isNaN(Number(event.target.value)) === false)) {
      if (bettingRound < 5) {
        const newPot = pot + p1.bet + p2.bet;
        p1.bet = 0, p2.bet = 0;
        this.setState({ turn, bettingRound: bettingRound + 1, currentBets: [], pot: newPot, p1, p2 }, () => {  this.play();  });
      } else {  this.nextHand();  }
    } else {
      this.setState({ turn, currentBets }, () => {  socket.send(JSON.stringify({ turn, currentBets }));  });
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
      if (bettingRound === 2) {
        for (let i = 0; i < 3; i += 1) {
          [ board[i], deck ] = deal(deck);
        }
      } else {  [ board[bettingRound], deck ] = deal(deck);  }
      this.setState({ deck, board }, () => {  socket.send(JSON.stringify(this.state));  });
    } else {  socket.send(JSON.stringify(this.state));  }
  };

  nextHand() {
    const { prevFirstBet, p1, p2 } = this.state;
    let newFirstBet = 1;
    if (prevFirstBet === 1) {  newFirstBet++;  }
    p1.hand = ['', ''], p2.hand = ['', ''];
    p1.chips--, p2.chips--;
    p1.bet++, p2.bet++;
    const updates = { prevFirstBet: newFirstBet, turn: newFirstBet, bettingRound: 0, pot: 0, currentBets: [], board: ['', '', '', '', ''], p1, p2 };
    this.setState(updates, () => {  socket.send(JSON.stringify(this.state));  });
  };

  render() {
    const { playerCount, prevFirstBet, turn, bettingRound, currentBets, pot, deck, board, p1, p2 } = this.state;
    let opponent = p2, player = p1;
    if (playerCount === 2) {  opponent = p1; player = p2;  }
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>
            <Opponent playerCount={playerCount} turn={turn} bettingRound={bettingRound} opponent={opponent} />
            <Board playerCount={playerCount} prevFirstBet={prevFirstBet} pot={pot} board={board} />
            <Player playerCount={playerCount} turn={turn} bettingRound={bettingRound} player={player} />
          </div>
          <HUD clicker={this.clicker} changeBet={this.changeBet} playerCount={playerCount} turn={turn} bettingRound={bettingRound} currentBets={currentBets} player={player} />
        </div>
      </div>
    );
  };

}

export default Table;
