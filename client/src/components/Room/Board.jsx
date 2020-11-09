import React from 'react';
import Cards from './Cards';
import style from '../../style.css';

const Board = ({ playerCount, gameOver, prevFirstBet, pot, board }) => {
  if (gameOver === false) {
    return (
      <div className={style.board}>

        <div className={style.dealer}>
          {playerCount !== prevFirstBet
            ? <span>
                <span>(( </span>
                <span className={style.label}>DEALER</span>
                <span> ))</span>
              </span>
            : <span className={style.hidden}>
                <span>(( </span>
                <span className={style.hiddenLabel}>DEALER</span>
                <span> ))</span>
              </span>
          }
        </div>

        <div>
          <Cards location={'board'} hand={board} winner={null} currentBets={null} />
          <div className={style.pot}>
            <span className={style.monospace}>{`<<<`}</span>
            <span>{`  CURRENT POT :  `}</span>
            <span className={style.currency}>{pot}</span>
            <span className={style.monospace}>{`  >>>`}</span>
          </div>
        </div>

        <div className={style.dealer}>
          {playerCount === prevFirstBet
            ? <span>
                <span>(( </span>
                <span className={style.label}>DEALER</span>
                <span> ))</span>
              </span>
            : <span className={style.hidden}>
                <span>(( </span>
                <span className={style.hiddenLabel}>DEALER</span>
                <span> ))</span>
              </span>
          }
        </div>

      </div>
    );

  } else {
    return (
      <div className={style.gameOver}>
        <span className={style.cards}>GAME OVER</span>
      </div>
    );
  }
};

export default Board;
