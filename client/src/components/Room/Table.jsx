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
        chips: 10,
        bet: 0,
        roundAction: 0
      },
      p2: {
        hand: ['', ''],
        chips: 10,
        bet: 0,
        roundAction: 0
      }
    };
    this.play = this.play.bind(this);
    this.clicker = this.clicker.bind(this);
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.setState(data, () => { console.log('state updated via socket:', this.state) });
    });
  };

  componentDidMount() {
    socket.addEventListener('open', (event) => {
      axios.get('/room')
        .then(({ data }) => {
          let players = data.playerCount;
          if (players < 2) { players++ }
          else { players = 1 }
          this.setState({ playerCount: players }, () => {
            socket.send(JSON.stringify(this.state));
          });
        })
        .catch((err) => { console.log('axios get error:', err) });
    });
  };

  clicker() {
    let { turn, bettingRound, currentBets, pot } = this.state;
    let roundComplete = false;
    if (turn === 2) { turn = 1; }
    else { turn = 2; }
    currentBets.push(event.target.value);
    if (currentBets[0] === '') {
      currentBets.shift();
    }
    console.log('currentBets:', currentBets);
    if (currentBets.length > 1 && currentBets[currentBets.length - 1] === 'check') {
      roundComplete = true;
    }
    if (roundComplete === true) {
      if (bettingRound + 1 === 6) {
        this.nextHand();
      } else {
        this.setState({
          turn,
          bettingRound: bettingRound + 1,
          currentBets: []
        }, () => {
          console.log('round complete:', this.state);
          this.play();
        });
      }
    } else {
      this.setState({ turn, currentBets }, () => {
        socket.send(JSON.stringify({ turn: this.state.turn, currentBets: this.state.currentBets }));
      });
    }
  }

  play() {
    let { bettingRound, deck, board, p1, p2 } = this.state;
    if (deck.length < 1 || (bettingRound === 1 && deck.length < 4) || (bettingRound === 2 && deck.length < 3)) {
      deck = shuffleDeck();
    }
    if (bettingRound === 1) {
      p1.hand = [];
      p2.hand = [];
      for (let i = 0; i < 2; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          const drawCard = deal(deck);
          deck = drawCard[1];
          if (j === 0) {
            p1.hand.push(drawCard[0]);
          } else {
            p2.hand.push(drawCard[0]);
          }
        }
      }
      this.setState({ deck, p1, p2 }, () => {
        console.log('HANDS DEALT\ndeck:', this.state.deck, '\np1 hand:', this.state.p1.hand, '\np2 hand:', this.state.p2.hand);
        socket.send(JSON.stringify(this.state));
      });
    } else if (bettingRound < 5) {
      if (bettingRound === 2) {
        for (let i = 0; i < 3; i += 1) {
          const drawCard = deal(deck);
          deck = drawCard[1];
          board[i] = drawCard[0];
        }
        console.log('FLOP');
      } else {
        const drawCard = deal(deck);
        deck = drawCard[1];
        if (bettingRound === 3) {
          board[3] = drawCard[0];
          console.log('TURN');
        } else if (bettingRound === 4) {
          board[4] = drawCard[0];
          console.log('RIVER');
        }
      }
      this.setState({ deck, board }, () => {
        console.log('BOARD UPDATED\ndeck:', this.state.deck, '\nboard:', this.state.board);
        socket.send(JSON.stringify(this.state));
      });
    } else if (bettingRound === 5) {
      console.log('Game over. Reveal cards. Determine winner.');
      socket.send(JSON.stringify(this.state));
    }
  };

  nextHand() {
    const { prevFirstBet, p1, p2 } = this.state;
    let newFirstBet = 0;
    if (prevFirstBet === 1) {
      newFirstBet = 2;
    } else {
      newFirstBet = 1;
    }
    p1.hand = ['', ''];
    p2.hand = ['', ''];
    this.setState({
      p1,
      p2,
      prevFirstBet: newFirstBet,
      turn: newFirstBet,
      bettingRound: 0,
      currentBets: [],
      pot: 0,
      board: ['', '', '', '', '']
    }, () => {
      console.log(`NEXT HAND\n${this.state}`);
      socket.send(JSON.stringify(this.state));
    });
  };

  render() {
    const { playerCount, prevFirstBet, turn, bettingRound, deck, board, p1, p2 } = this.state;
    let opponent = {};
    let player = {};
    if (playerCount === 1) {
      opponent = p2;
      player = p1;
    } else {
      opponent = p1;
      player = p2;
    }
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>
            <Opponent playerCount={playerCount} turn={turn} bettingRound={bettingRound} opponent={opponent} />
            <Board playerCount={playerCount} prevFirstBet={prevFirstBet} board={board} />
            <Player playerCount={playerCount} turn={turn} bettingRound={bettingRound} player={player} />
          </div>
          <HUD clicker={this.clicker} playerCount={playerCount} turn={turn} bettingRound={bettingRound} />
        </div>
      </div>
    );
  };

}

export default Table;
