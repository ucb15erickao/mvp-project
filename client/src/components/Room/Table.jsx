import React from 'react';
import axios from 'axios';

import style from '../../style.css';
import Player from './Player';
import HUD from './HUD';

const socket = new WebSocket("ws://localhost:8080");

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0,
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
  };

  componentDidMount() {
    socket.addEventListener('open', (event) => {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        this.setState(data, () => { console.log('state updated via socket:', this.state) });
      });
      axios.get('/room')
      .then(res => {
        let players = res.data.playerCount;
        if (players === 0 || players === 1) { players += 1; }
        else { players = 1; }
        this.setState({ playerCount: players }, () => {
          const { playerCount, p1, p2 } = this.state;
          socket.send(JSON.stringify({ playerCount, turn: 1, bettingRound: 0, currentBets: [], pot: 0, deck: [], board: ['', '', '', '', ''], p1, p2 }));
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
    console.log('currentBets:', currentBets);
    if (currentBets.length > 1 && currentBets[currentBets.length - 1] === 'check') {
      roundComplete = true;
    }
    if (roundComplete === true) {
      const updates = this.state;
      updates.turn = turn;
      updates.bettingRound = bettingRound + 1;
      updates.currentBets = [];
      socket.send(JSON.stringify(updates));
      new Promise((resolve, reject) => { this.play(); return resolve(); })
        .then(() => { socket.send(JSON.stringify(updates)); })
        .catch((error) => { console.log('playPromise error:', error) });
    } else {
      socket.send(JSON.stringify({ turn, currentBets }));
    }
  }

  play() {
    let { bettingRound, deck, board, p1, p2 } = this.state;
    if (deck.length < 1 || (bettingRound === 1 && deck.length < 4) || (bettingRound === 2 && deck.length < 3)) {
      deck = this.shuffleDeck();
    }
    if (bettingRound === 1) {
      p1.hand = [];
      p2.hand = [];
      for (let i = 0; i < 2; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          const drawCard = this.deal(deck);
          deck = drawCard[1];
          if (j === 0) {
            p1.hand.push(drawCard[0]);
          } else {
            p2.hand.push(drawCard[0]);
          }
        }
      }
      this.setState({ deck, p1, p2 }, () => { console.log('HANDS DEALT\ndeck:', this.state.deck, '\np1 hand:', this.state.p1.hand, '\np2 hand:', this.state.p2.hand) });
    } else if (bettingRound < 5) {
      if (bettingRound === 2) {
        for (let i = 0; i < 3; i += 1) {
          const drawCard = this.deal(deck);
          deck = drawCard[1];
          board[i] = drawCard[0];
        }
      } else {
        const drawCard = this.deal(deck);
        deck = drawCard[1];
        if (bettingRound === 3) {
          board[3] = drawCard[0];
        } else if (bettingRound === 4) {
          board[4] = drawCard[0];
        }
      }
      this.setState({ deck, board }, () => { console.log('FLOP\ndeck:', this.state.deck, '\nboard:', this.state.board) });
    } else {
      console.log('Game over. Reveal cards.');
    }
  }

  shuffleDeck() {
    const deck = ['A♣', 'A♦',  'A♥',  'A♠',  '2♣',  '2♦', '2♥', '2♠', '3♣',  '3♦',  '3♥',  '3♠',  '4♣', '4♦', '4♥', '4♠',  '5♣',  '5♦',  '5♥',  '5♠', '6♣', '6♦', '6♥',  '6♠',  '7♣',  '7♦',  '7♥', '7♠', '8♣', '8♦',  '8♥',  '8♠',  '9♣',  '9♦', '9♥', '9♠', '10♣', '10♦', '10♥', '10♠', 'J♣', 'J♦', 'J♥', 'J♠',  'Q♣',  'Q♦',  'Q♥',  'Q♠', 'K♣', 'K♦', 'K♥',  'K♠'];
    for (let i = 0, {length} = deck; i < length; i += 1) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const currentCard = deck[i];
      deck[i] = deck[randomIndex];
      deck[randomIndex] = currentCard;
    }
    return deck;
  };

  deal(deck) {
    const draw = deck.pop();
    return [draw, deck];
  };

  render() {
    const { deck, playerCount, bettingRound, turn, board, p1, p2 } = this.state;
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>

            <div className={style.opponent}>
              {playerCount !== turn && (
                <span className={style.turn}>***CURRENT TURN***</span>
              )}
              {playerCount === 1 && (
                <span>{` OPPONENT: ${p2.chips} CHIPS`}</span>
              )}
              {playerCount === 2 && (
                <span>{` OPPONENT: ${p2.chips} CHIPS`}</span>
              )}
              <div>
                {playerCount === 1 && (
                  <span>
                    {p2.hand.map((card, i) => {
                      if (bettingRound === 5) {
                        if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
                          return (<span key={`${i}: ${card}`} className={style.black}>{` ${card} `}</span>);
                        }
                        return (<span key={`${i}: ${card}`} className={style.red}>{` ${card} `}</span>);
                      }
                      return (<span key={`${i}: ${card}`}>{' [?]'}</span>);
                    })}
                  </span>
                )}
                {playerCount === 2 && (
                  <span>
                    {p1.hand.map((card, i) => {
                      if (bettingRound === 5) {
                        if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
                          return (<span key={`${i}: ${card}`} className={style.black}>{` ${card} `}</span>);
                        }
                        return (<span key={`${i}: ${card}`} className={style.red}>{` ${card} `}</span>);
                      }
                      return (<span key={`${i}: ${card}`}>{' [?]'}</span>);
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className={style.board}>
              <div>
                {playerCount === 2 && (
                  <div>DEALER</div>
                )}
                {playerCount === 1 && (
                  <div className={style.hidden}>DEALER</div>
                )}
              </div>

              <div>
                BOARD: { board.map((card, i) => {
                  if (card === '') {
                    if (i === 4) {
                      return (<span key={`${i}: ${card}`}>{' [?]'}</span>);
                    }
                    return (<span key={`${i}: ${card}`}>{' [?],'}</span>);
                  } else if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
                    if (i === 4) {
                      return (<span key={`${i}: ${card}`} className={style.black}>{` ${card}`}</span>);
                    }
                    return (
                      <span key={`${i}: ${card}`}>
                        <span className={style.black}>{` ${card}`}</span>
                        <span>,</span>
                      </span>
                    );
                  } else {
                    if (i === 4) {
                      return (<span key={`${i}: ${card}`} className={style.red}>{` ${card}`}</span>);
                    }
                    return (
                      <span key={`${i}: ${card}`}>
                        <span className={style.red}>{` ${card}`}</span>
                        <span>,</span>
                      </span>
                    );
                  }
                }) }
              </div>

              <div>
                {playerCount === 1 && (
                  <div>DEALER</div>
                )}
                {playerCount === 2 && (
                  <div className={style.hidden}>DEALER</div>
                )}
              </div>
            </div>

            {playerCount === 1 && (
              <Player playerCount={playerCount} player={p1} turn={turn} />
            )}
            {playerCount === 2 && (
              <Player playerCount={playerCount} player={p2} turn={turn} />
            )}

          </div>

          <HUD clicker={this.clicker} playerCount={playerCount} bettingRound={bettingRound} turn={turn} />

        </div>
      </div>
    );
  }

}

export default Table;
