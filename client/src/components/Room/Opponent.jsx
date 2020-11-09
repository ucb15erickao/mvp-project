import React from 'react';
import NameTag from './NameTag';
import Cards from './Cards';
import Chips from './Chips';
import render from './RenderText';
import style from '../../style.css';

const Opponent = ({ playerCount, gameOver, winner, winning, losing, prevFirstBet, opponent, turn, bettingRound, currentBets, pot }) => {
  return (
    <div className={style.opponentContainer}>

      <Chips chips={opponent.chips} bet={opponent.bet} bettingRound={bettingRound} />

      <NameTag player={false} gameOver={gameOver} winner={winner} playerCount={playerCount} prevFirstBet={prevFirstBet} />

      <Cards location={'opponent'} hand={opponent.hand} winner={winner} currentBets={currentBets} />

      <div className={style.BTcontainer}>

        {playerCount !== turn && winner === 0 && gameOver === false && bettingRound > 0 && (
          <span className={style.betTracker}>{ render.betTracker() }</span>
        )}

        {(((playerCount === turn && winner === 0) || bettingRound === 0 || (gameOver === false && winner === playerCount)) && winner !== 3) && (
          <span className={style.betTrackerHidden}>{ render.betTracker() }</span>
        )}

        {winner !== 0 && winner !== playerCount && winner !== 3 && currentBets[currentBets.length - 1] !== 'fold' && ( <span>{ render.winMessage(winning, losing, pot) }</span> )}

        {winner !== 0 && winner !== playerCount && currentBets[currentBets.length - 1] === 'fold' && (
          <span className={style.winMessage}>
            {`YOU FOLDED & OPPONENT WINS THE POT `}
            { render.textPot(pot)}
          </span>
        )}

        {winner === 3 && ( <span>{ render.tieMessage(winning, losing, pot) }</span> )}

      </div>

    </div>
  );
};

export default Opponent;
