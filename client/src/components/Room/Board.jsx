import React from 'react';

import style from '../../style.css';

const Board = ({ playerCount, prevFirstBet, board }) => {
  return (
    <div className={style.board}>
      <div>
        {playerCount !== prevFirstBet && (
          <div>DEALER</div>
        )}
        {playerCount === prevFirstBet && (
          <div className={style.hidden}>DEALER</div>
        )}
      </div>

      <div>
        BOARD: {board.map((card, i) => {
        if (card === '') {
          if (i === 4) {
            return (<span key={`${i}: ${card}`}>{' [?]'}</span>);
          }
          return (<span key={`${i}: ${card}`}>{' [?] ,'}</span>);
        } else if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
          if (i === 4) {
            return (<span key={`${i}: ${card}`} className={style.black}>{` ${card}`}</span>);
          }
          return (
            <span key={`${i}: ${card}`}>
              <span className={style.black}>{` ${card}`}</span>
              <span> ,</span>
            </span>
          );
        } else {
          if (i === 4) {
            return (<span key={`${i}: ${card}`} className={style.red}>{` ${card}`}</span>);
          }
          return (
            <span key={`${i}: ${card}`}>
              <span className={style.red}>{` ${card}`}</span>
              <span> ,</span>
            </span>
          );
        }
      })}
      </div>

      <div>
        {playerCount === prevFirstBet && (
          <div>DEALER</div>
        )}
        {playerCount !== prevFirstBet && (
          <div className={style.hidden}>DEALER</div>
        )}
      </div>
    </div>
  );
};

export default Board;
