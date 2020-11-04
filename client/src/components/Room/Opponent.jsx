import React from 'react';
import style from '../../style.css';

const Opponent = ({ playerCount, opponent, turn, bettingRound }) => {
  return (
    <div className={style.opponent}>
      {playerCount !== turn && bettingRound !== 5 && (
        <span className={style.turn}>******************</span>
      )}

      <span>{` OPPONENT`}</span>

      {playerCount !== turn && bettingRound !== 5 && (
        <span className={style.turn}>******************</span>
      )}

      <div className={style.bettingLine}>{`CHIPS: ${opponent.chips} --- CURRENT BET: ${opponent.bet}`}</div>

      <div>
        {opponent.hand.map((card, i) => {
          if (bettingRound === 5) {
            if (card.indexOf('♦') === -1 && card.indexOf('♥') === -1) {
              if (i === 0) {
                return (
                  <span key={`${i}: ${card}`}>
                    <span> [</span>
                    <span className={style.black}>{card}</span>
                    <span>] ,</span>
                  </span>
                );
              }
              return (
                <span key={`${i}: ${card}`}>
                  <span> [</span>
                  <span className={style.black}>{card}</span>
                  <span>] </span>
                </span>
              );
            }
            if (i === 0) {
              return (
                <span key={`${i}: ${card}`}>
                  <span> [</span>
                  <span className={style.red}>{card}</span>
                  <span>] ,</span>
                </span>
              );
            }
            return (
              <span key={`${i}: ${card}`}>
                <span> [</span>
                <span className={style.red}>{card}</span>
                <span>] </span>
              </span>
            );
          }
          if (i === 0) {
            return (<span key={`${i}: ${card}`}>{' [ ? ] ,'}</span>);
          }
          return (<span key={`${i}: ${card}`}>{' [ ? ]'}</span>);
        })}
      </div>
    </div>
  );
};

export default Opponent;
