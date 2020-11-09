import React from 'react';
import style from '../../style.css';

const NameTag = ({ player, gameOver, winner, playerCount, prevFirstBet }) => (
  <div className={style.nameTag}>
    {((prevFirstBet === playerCount && player) || (prevFirstBet !== playerCount && !player)) && winner === 0 && gameOver === false && (
      <span className={style.startRound}>{`******************|||||||| `}</span>
    )}
    <span> (( </span>
    {player === true
      ? <span className={style.label}>{`PLAYER `}{playerCount}</span>
      : <span className={style.label}>{`OPPONENT`}</span>
    }
    <span> ))</span>
    {((prevFirstBet === playerCount && player) || (prevFirstBet !== playerCount && !player)) && winner === 0 && gameOver === false && (
      <span className={style.startRound}>{` ||||||||******************`}</span>
    )}
  </div>
);

export default NameTag;
