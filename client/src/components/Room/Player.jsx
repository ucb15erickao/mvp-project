import React from 'react';
import style from '../../style.css';

const Player = ({ playerCount, turn, bettingRound, player }) => {
  let { hand, chips, bet } = player;
  if (hand[0] === '') {  hand = ['[ ? ]', '[ ? ]'];  }
  return (
    <div>
      {playerCount === turn && bettingRound !== 5 && (
        <span className={style.turn}>******************</span>
      )}

      <span>{` PLAYER ${playerCount}`}</span>

      {playerCount === turn && bettingRound !== 5 && (
        <span className={style.turn}>******************</span>
      )}

      <div className={style.bettingLine}>{`CHIPS: ${chips} --- CURRENT BET: ${bet}`}</div>

      <div className={hand}>
        {hand[1] === '[ ? ]' && (
          <span>{hand[0]}</span>
        )}
        {hand[0].indexOf('♦') === -1 && hand[0].indexOf('♥') === -1 && hand[0] !== '[ ? ]' && (
          <span>
            <span> [ </span>
            <span className={style.black}>{hand[0]}</span>
            <span> ] </span>
          </span>
        )}
        {hand[0].indexOf('♣') === -1 && hand[0].indexOf('♠') === -1 && hand[0] !== '[ ? ]' && (
          <span>
            <span> [ </span>
            <span className={style.red}>{hand[0]}</span>
            <span> ] </span>
          </span>
        )}

        <span> , </span>

        {hand[1] === '[ ? ]' && (
          <span>{hand[1]}</span>
        )}
        {hand[1].indexOf('♦') === -1 && hand[1].indexOf('♥') === -1 && hand[1] !== '[ ? ]' && (
          <span>
            <span> [ </span>
            <span className={style.black}>{hand[1]}</span>
            <span> ] </span>
          </span>
        )}
        {hand[1].indexOf('♣') === -1 && hand[1].indexOf('♠') === -1 && hand[1] !== '[ ? ]' && (
          <span>
            <span> [ </span>
            <span className={style.red}>{hand[1]}</span>
            <span> ] </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Player;
