import React from 'react';
import NameTag from './NameTag';
import Cards from './Cards';
import Chips from './Chips';
import render from './RenderText';
import style from '../../style.css';

const Player = ({ playerCount, gameOver, winner, winning, losing, prevFirstBet, turn, bettingRound, currentBets, pot, player }) => {
  console.log('turn:', turn);
  let { hand, chips, bet } = player;
  return (
    <div className={style.playerContainer}>

      <div className={style.BTcontainer}>

        {playerCount === turn && winner === 0 && gameOver === false && bettingRound > 0 && (
          <span className={style.betTracker}>[BET]</span>
        )}

        {(((playerCount !== turn && winner === 0) || bettingRound === 0 || (gameOver === false && winner !== playerCount && winner !== 0)) && winner !== 3) && (
          <span className={style.betTrackerHidden}>[BET]</span>
        )}

        {winner === playerCount && currentBets[currentBets.length - 1] !== 'fold' && (
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

        {winner === playerCount && currentBets[currentBets.length - 1] === 'fold' && (
          <span className={style.winMessage}>{`OPPONENT FOLDS & YOU WIN THE POT (${pot}).`}</span>
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
      <Cards location={'player'} hand={hand} winner={null} currentBets={null} />
      <NameTag player={true} gameOver={gameOver} winner={winner} playerCount={playerCount} prevFirstBet={prevFirstBet} />
      <Chips chips={chips} bet={bet} bettingRound={bettingRound} />
    </div>
  );
};

export default Player;
