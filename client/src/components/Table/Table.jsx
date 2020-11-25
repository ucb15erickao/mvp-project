import React from 'react';
import style from '../../style.css';
import Opponent from './Opponent';
import Board from './Board';
import Player from './Player';
import ControlPanel from './ControlPanel';
import { gameState, fold, endRound, updatePlayers, updateGame, startRound, newGame } from './gameLogic/gameFunctions';

const socket = new WebSocket("ws://localhost:8080");
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = gameState;
    this.deal = this.deal.bind(this);
    this.clicker = this.clicker.bind(this);
    this.changeBet = this.changeBet.bind(this);
  };

  componentDidMount() {
    socket.addEventListener('open', () => {
      socket.addEventListener('message', serverMessage => {
        const parsedSM = JSON.parse(serverMessage.data);
        if (typeof parsedSM === 'number') {  this.setState({ playerCount: parsedSM })  }
        else {
          const { p1, p2 } = parsedSM;
          if (parsedSM.bettingRound === 5) {  parsedSM.deal = false  }
          if (p1 && p2) {  parsedSM.betSelect = eval(`p${this.state.playerCount}`).minBet  }
          this.setState(parsedSM, () => {
            if (this.state.deal === true) {  this.deal()  }
          });
        }
      });
    });
  };

  changeBet() {  this.setState({ betSelect: Number(event.target.value) })  };

  clicker() {
    let { gameOver, playerCount, prevFirstBet, turn, bettingRound, currentBets, betSelect, pot, board, p1, p2 } = this.state;
    let  player = p1, opponent = p2;
    if (playerCount === 2) {  player = p2, opponent = p1  }
    bettingRound++;
    currentBets.push(event.target.value);
    if (turn === 2) {  turn = 1  }
    else {  turn = 2  }

    if (event.target.value === 'fold') { socket.send(JSON.stringify(fold(playerCount, bettingRound, currentBets, pot, p1, p2)))  }
    else {
      const playerData = updatePlayers(event.target.value, betSelect, player, opponent);
      player = playerData.player, opponent = playerData.opponent;
      if (currentBets.length > 1 && (event.target.value === 'check' || event.target.value === 'call')) {
        if (bettingRound <= 5) {
          socket.send(JSON.stringify(endRound(prevFirstBet, bettingRound, currentBets, pot, board, p1, p2)));
        } else {  this.nextHand()  }


      } else if (Number.isNaN(Number(event.target.value)) === false) {
        if (Number.isNaN(Number(currentBets[currentBets.length - 2])) === false) {
          if (bettingRound <= 1) {
            socket.send(JSON.stringify({ turn: prevFirstBet, bettingRound, deal: true }));
          } else {
            if (gameOver) {  this.reset()  }
            else {  this.nextHand()  }
          }
        } else {  socket.send(JSON.stringify({ currentBets }))  }


      } else {
        const updates = { turn, currentBets, p1: player, p2: opponent };
        if (playerCount === 2) {
          updates.p1 = opponent, updates.p2 = player;
        }
        socket.send(JSON.stringify(updates));
      }
    }
  };

  deal() {
    const { bettingRound, deck, board, p1, p2 } = this.state;
    socket.send(JSON.stringify(updateGame(bettingRound, deck, board, p1, p2)));
  };

  nextHand() {
    const { gameOver, winner, prevFirstBet, pot, p1, p2 } = this.state;
    socket.send(JSON.stringify(startRound(gameOver, winner, prevFirstBet, pot, p1, p2)));
  };

  reset() {
    const { prevFirstBet, p1, p2 } = this.state;
    socket.send(JSON.stringify(newGame(prevFirstBet, p1, p2)));
  };

  render() {
    const { changePage } = this.props;
    const { playerCount, gameOver, winner, winning, losing, prevFirstBet, turn, bettingRound, currentBets, pot, deck, board, p1, p2 } = this.state;
    let opponent = p2, player = p1;
    if (playerCount === 2) {  opponent = p1, player = p2  }
    return (
      <div className={style.container}>
        <div className={style.room}>
          <button className={style.returnToLobby} onClick={() => { changePage('lobby') }}>RETURN TO CASINO LOBBY</button>
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
};

export default Table;
