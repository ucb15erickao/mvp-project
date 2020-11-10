import React from 'react';
import style from '../../style.css';

const Chips = ({ chips, bet, bettingRound }) => (
  <div className={style.bettingLine}>
    <span className={style.monospace}>&lt;&lt;</span>
    {` CHIPS : `}
    <div className={style.currency}>
      {chips < 0
        ? <span className={style.red}>{chips}</span>
        : <span>{chips}</span>
      }
    </div>
    {` `}
    <span className={style.monospace}>&gt;&gt;-</span>

    {`-`}
    <span className={style.monospace}>{`-`}</span>
    {`-`}

    <span className={style.monospace}>-&lt;&lt;</span>
    {` CURRENT BET : `}
    <div className={style.currency}>
      {bettingRound === 1 && bet === 1 && (
        <span className={style.ante}>
          {`{`}<span className={style.anteText}>ante</span>{`}`}
        </span>
      )}
      {chips < 0
        ? <span className={style.noBet}>{bet}</span>
        : <span>{bet}</span>
      }
    </div>
    {` `}
    <span className={style.monospace}>&gt;&gt;</span>
  </div>
);

export default Chips;
