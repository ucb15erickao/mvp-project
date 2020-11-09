import React from 'react';
import style from '../../style.css';

const Chips = ({ chips, bet, bettingRound }) => (
  <div className={style.bettingLine}>
    <span className={style.monospace}>&lt;&lt;</span>
    <span> CHIPS : </span>
    <div className={style.currency}>
      {chips < 0 && (<span className={style.red}>{chips}</span>)}
      {chips >= 0 && (<span>{chips}</span>)}
    </div>
    <span> </span>
    <span className={style.monospace}>&gt;&gt;-</span>
    <span>-</span>
    <span className={style.monospace}>-</span>
    <span>-</span>
    <span className={style.monospace}>-&lt;&lt;</span>
    <span> CURRENT BET : </span>
    <div className={style.currency}>
      {bettingRound === 1 && bet === 1 && (
        <span className={style.ante}>[ante]</span>
      )}
      {chips < 0 && (<span className={style.noBet}>{bet}</span>)}
      {chips >= 0 && (<span>{bet}</span>)}
    </div>
    <span> </span>
    <span className={style.monospace}>&gt;&gt;</span>
  </div>
);

export default Chips;
