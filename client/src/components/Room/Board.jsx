import React from 'react';
import style from '../../style.css';

const Board = ({ playerCount, gameOver, prevFirstBet, pot, board }) => {
  if (gameOver === false) {
    return (
      <div className={style.board}>

        <div className={style.dealer}>
          {playerCount !== prevFirstBet && (
            <div> (( DEALER )) </div>
          )}
          {playerCount === prevFirstBet && (
            <div className={style.hidden}> (( DEALER )) </div>
          )}
        </div>

        <div>
          <div>
            BOARD :  {board.map((card, i) => {
              if (card === '') {
                if (i === 4) {
                  return (<span className={style.cards} key={`${i}: ${card}`}>{'[ - ]'}</span>);
                }
                return (<span className={style.cards} key={`${i}: ${card}`}>{'[ - ] , '}</span>);
              } else if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
                if (i === 4) {
                  return (
                    <span className={style.cards} key={`${i}: ${card}`}>
                      <span> [ </span>
                      <span className={style.black}>{card}</span>
                      <span> ] </span>
                    </span>
                  );
                }
                return (
                  <span className={style.cards} key={`${i}: ${card}`}>
                    <span> [ </span>
                    <span className={style.black}>{card}</span>
                    <span> ] , </span>
                  </span>
                );
              } else {
                if (i === 4) {
                  return (
                    <span className={style.cards} key={`${i}: ${card}`}>
                      <span> [ </span>
                      <span className={style.red}>{card}</span>
                      <span> ] </span>
                    </span>
                  );
                }
                return (
                  <span className={style.cards} key={`${i}: ${card}`}>
                    <span> [ </span>
                    <span className={style.red}>{card}</span>
                    <span> ] , </span>
                  </span>
                );
              }
            })}
          </div>
          <div className={style.pot}>{`<<<  CURRENT POT :  ${pot}  >>>`}</div>
        </div>

        <div className={style.dealer}>
          {playerCount === prevFirstBet && (
            <div> (( DEALER )) </div>
          )}
          {playerCount !== prevFirstBet && (
            <div className={style.hidden}> (( DEALER )) </div>
          )}
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
