import React from 'react';
import axios from 'axios';

import style from '../../style.css';
import Player from './Player';
import HUD from './HUD';

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deck: [],
      playerCount: 0,
      bettingRound: 0,
      turn: 1,
      community: ['', '', '', '', ''],
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
      },
      pot: 0
    };
    this.play = this.play.bind(this);
    this.clicker = this.clicker.bind(this);
  };

  componentDidMount() {
    const socket = new WebSocket("ws://localhost:8080");
    socket.addEventListener('open', (event) => {
      socket.send('Hello Server!');
    });
    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
    });
    axios.get('/room')
      .then(({ data }) => {
        console.log('getData:', data);
        if (data.playerCount === 0 || data.playerCount === 1) {
          data.playerCount += 1;
        } else {
          data.playerCount = 1;
        }

        this.setState({ playerCount: data.playerCount}, () => {
          const { playerCount } = this.state;
          console.log('this.state.playerCount:', playerCount);
          if (playerCount === 1) {
            console.log('before promise:', this.state.deck);
            new Promise((resolve, reject) => { this.play(); return resolve(); })
              .then(() => {
                console.log('playPromise then:', this.state.deck);
                axios.post('/room', this.state)
                  .then((p1Result) => { console.log('p1Result:', p1Result.data) })
                  .catch((p1Error) => { console.log('p1Error:', p1Error) });
              })
              .catch((error) => { console.log('playPromise error:', error) });
          } else if (playerCount === 2) {
            axios.post('/room', { playerCount })
              .then((p2Result) => {
                console.log('p2Result:', p2Result.data);
                this.setState(data, () => { console.log('this.state:', this.state) });
              })
              .catch((p2Error) => { console.log('p2Error:', p2Error) });
          }
        });
      })
      .catch((getError) => { console.log('getError:', getError) });
  };

  clicker() {
    let { turn } = this.state;
    if (turn === 2) {
      turn = 1;
    } else {
      turn = 2;
    }
    console.log(event.target.value);
    if (event.target.value === 'check') {
      //
    }
    axios.post('/room', { turn })
      .then((turnResult) => {
        console.log('turnResult:', turnResult.data);
        this.setState({ turn }, () => { console.log('this.state.turn:', this.state.turn) });
      })
      .catch((turnError) => { console.log('turnError:', turnError) });
  }

  play() {
    let { deck, p1, p2 } = this.state;
    console.log('deck.length:', deck.length);

    if (deck.length === 0) {
      deck = this.shuffleDeck();
      console.log('shuffle deck:', deck);
    }

    if (p1.hand[0] === '' && p2.hand[0] === '') {
      p1.hand = [];
      p2.hand = [];
      for (let i = 0; i < 2; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          const drawCard = this.deal(deck);
          const draw = drawCard[0];
          deck = drawCard[1];
          console.log('draw:', draw);
          if (j === 0) {
            p1.hand.push(draw);
          } else {
            p2.hand.push(draw);
          }
        }
      }
      this.setState({ deck, p1, p2 }, () => { console.log('deck:', this.state.deck, '\np1 hand:', this.state.p1.hand, '\np2 hand:', this.state.p2.hand) });
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
    const { deck, playerCount, bettingRound, turn, community, p1, p2 } = this.state;
    return (
      <div className={style.container}>
        <div className={style.room}>
          <h1 className={style.titleBar}>Texas Hold'em</h1>
          <div className={style.table}>

            <div className={style.opponent}>
              <span>OPPONENT</span>
              {playerCount !== turn && (
                <span className={style.turn}>*CURRENT TURN*</span>
              )}
              <div>
                <span> [?] [?] </span>
              </div>
            </div>

            <div className={style.community}>
              <div>
                {playerCount === 2 && (
                  <div>DEALER</div>
                )}
                {playerCount === 1 && (
                  <div className={style.hidden}>DEALER</div>
                )}
              </div>

              <div>BOARD: {community}</div>

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
              <Player playerCount={playerCount} hand={p1.hand} turn={turn} />
            )}
            {playerCount === 2 && (
              <Player playerCount={playerCount} hand={p2.hand} turn={turn} />
            )}

          </div>

          <HUD clicker={this.clicker} playerCount={playerCount} bettingRound={bettingRound} turn={turn} />

        </div>
      </div>
    );
  }

}

export default Table;
