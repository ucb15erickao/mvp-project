import React from 'react';
import NameTag from './NameTag';
import Cards from './Cards';
import Chips from './Chips';
import render from './RenderText';
import style from '../../style.css';

const Opponent = ({ playerCount, gameOver, winner, winning, losing, prevFirstBet, opponent, turn, bettingRound, currentBets, pot }) => {
  console.log('bettingRound:', bettingRound);
  console.log('winner:', winner);
  console.log('playerCount:', playerCount);
  return (
    <div className={style.opponentContainer}>

      <Chips chips={opponent.chips} bet={opponent.bet} bettingRound={bettingRound} />

      <NameTag player={false} gameOver={gameOver} winner={winner} playerCount={playerCount} prevFirstBet={prevFirstBet} />

      <Cards location={'opponent'} hand={opponent.hand} winner={winner} currentBets={currentBets} />

      <div className={style.BTcontainer}>

        {playerCount !== turn && winner === 0 && gameOver === false && bettingRound > 0 && (
          <span className={style.betTracker}>[BET]</span>
        )}

        {(((playerCount === turn && winner === 0) || bettingRound === 0 || (gameOver === false && winner === playerCount)) && winner !== 3) && (
          <span className={style.betTrackerHidden}>[BET]</span>
        )}

        {winner !== 0 && winner !== playerCount && winner !== 3 && currentBets[currentBets.length - 1] !== 'fold' && (
          <span className={style.winMessage}>
            <span>{render.pokerHands[winning.score]} </span>
            { render.smallCards(winning.hand) }
            <span>{` BEATS `}</span>
            <span>{render.pokerHands[losing.score]} </span>
            { render.smallCards(losing.hand) }
            <span>{` FOR THE POT `}</span>
            { render.textPot(pot) }
          </span>
        )}

        {winner !== 0 && winner !== playerCount && currentBets[currentBets.length - 1] === 'fold' && (
          <span className={style.winMessage}>{`YOU FOLDED & OPPONENT WINS THE POT (${pot}).`}</span>
        )}

        {winner === 3 && (
          <span className={style.winMessage}>
            <span>{render.pokerHands[winning.score]} </span>
            { render.smallCards(winning.hand) }
            <span>{` TIES `}</span>
            <span>{render.pokerHands[losing.score]} </span>
            { render.smallCards(losing.hand) }
            <span>{` FOR A SPLIT POT `}</span>
            { render.textPot(pot / 2) }
          </span>
        )}

      </div>



    </div>
  );
};

export default Opponent;
