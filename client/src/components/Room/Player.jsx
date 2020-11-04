import React from 'react';

import style from '../../style.css';

const Player = ({ playerCount, player, turn }) => {
  const { hand, chips } = player;
  return (
    <div>
      {playerCount === turn && (
        <span className={style.turn}>***CURRENT TURN***</span>
      )}
      <span>{` PLAYER ${playerCount}: ${chips} CHIPS`}</span>
      <div className={hand}>
        {hand[0].indexOf('♦') === -1 && hand[0].indexOf('♥') === -1 && (
          <span className={style.black}>{hand[0]} </span>
        )}
        {hand[0].indexOf('♣') === -1 && hand[0].indexOf('♠') === -1 && (
          <span className={style.red}>{hand[0]} </span>
        )}

        {hand[1].indexOf('♦') === -1 && hand[1].indexOf('♥') === -1 && (
          <span className={style.black}>{hand[1]}</span>
        )}
        {hand[1].indexOf('♣') === -1 && hand[1].indexOf('♠') === -1 && (
          <span className={style.red}>{hand[1]}</span>
        )}
      </div>
    </div>
  );
};

export default Player;
