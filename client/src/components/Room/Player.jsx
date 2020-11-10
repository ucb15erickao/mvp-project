import React from 'react';
import NameTag from './NameTag';
import Cards from './Cards';
import Chips from './Chips';
import render from './RenderText';
import style from '../../style.css';

const Player = ({ playerCount, gameOver, winner, winning, losing, prevFirstBet, turn, bettingRound, currentBets, pot, player }) => {
  let { hand, chips, bet } = player;
  return (
    <div className={style.playerContainer}>
      <div className={style.BTcontainer}>
        {playerCount === turn && winner === 0 && gameOver === false && bettingRound > 0 && (
          <span className={style.betTracker}>{ render.betTracker() }</span>
        )}
        {(((playerCount !== turn && winner === 0) || bettingRound === 0 || (gameOver === false && winner !== playerCount && winner !== 0)) && winner !== 3) && (
          <span className={style.betTrackerHidden}>{ render.betTracker() }</span>
        )}

        {winner === playerCount && currentBets.indexOf('fold') === -1 && gameOver === false && (
          <span>{ render.winMessage(winning, losing, pot) }</span>
        )}

        {winner === playerCount && currentBets.indexOf('fold') !== -1 && (
          <span className={style.winMessage}>
            {`OPPONENT FOLDS & YOU WIN THE POT `}
            { render.textPot(pot) }
          </span>
        )}

        {winner === 3 && (
          <span>{ render.tieMessage(winning, losing, pot) }</span>
        )}
      </div>
      <Cards location={'player'} hand={hand} winner={null} currentBets={null} />
      <NameTag player={true} gameOver={gameOver} winner={winner} playerCount={playerCount} prevFirstBet={prevFirstBet} />
      <Chips chips={chips} bet={bet} bettingRound={bettingRound} />
    </div>
  );
};

export default Player;
