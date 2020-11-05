import React from 'react';
import style from '../../style.css';

const Player = ({ playerCount, gameOver, winner, prevFirstBet, turn, bettingRound, player }) => {
  let { hand, chips, bet } = player;
  return (
    <div className={style.playerContainer}>

      <div className={style.cards}>
        {hand[0].indexOf('♦') === -1 && hand[0].indexOf('♥') === -1 && (
          <span>
            <span> [ </span>
            <span className={style.black}>{hand[0]}</span>
            <span> ] </span>
          </span>
        )}
        {hand[0].indexOf('♣') === -1 && hand[0].indexOf('♠') === -1 && (
          <span>
            <span> [ </span>
            <span className={style.red}>{hand[0]}</span>
            <span> ] </span>
          </span>
        )}

        <span> , </span>

        {hand[1].indexOf('♦') === -1 && hand[1].indexOf('♥') === -1 && (
          <span>
            <span> [ </span>
            <span className={style.black}>{hand[1]}</span>
            <span> ] </span>
          </span>
        )}
        {hand[1].indexOf('♣') === -1 && hand[1].indexOf('♠') === -1 && (
          <span>
            <span> [ </span>
            <span className={style.red}>{hand[1]}</span>
            <span> ] </span>
          </span>
        )}
      </div>


      <div className={style.pBT}>
        {prevFirstBet === playerCount && (
          <div className={style.betTracker}>[UNDER THE GUN]</div>
        )}
        {prevFirstBet !== playerCount && (
          <div className={style.betTrackerHidden}>[UNDER THE GUN]</div>
        )}
      </div>


      <div className={style.player}>
        {playerCount === turn && winner === 0 && gameOver === false && (
          <span className={style.turn}>******************|||||||| </span>
        )}

        <span>{` (( PLAYER ${playerCount} ))`}</span>
        {winner === playerCount && (
          <span> WINS THE CURRENT POT!</span>
        )}

        {playerCount === turn && winner === 0 && gameOver === false && (
          <span className={style.turn}> ||||||||******************</span>
        )}
      </div>


      <div className={style.bettingLine}>
        {chips < 0 && (
          <span>
            <span className={style.lost}>{`< CHIPS : ${chips} >`}</span>
            <span>{` -------- < CURRENT BET :  ${bet}`}</span>
          </span>
        )}
        {chips >= 0 && (
          <span>{`< CHIPS : ${chips} > -------- < CURRENT BET :  ${bet}`}</span>
        )}
        {bettingRound === 0 && bet === 1 && (
          <span className={style.ante}> [ante]</span>
        )}
        <span> &gt;</span>
      </div>



    </div>
  );
};

export default Player;
