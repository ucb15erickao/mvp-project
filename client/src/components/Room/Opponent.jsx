import React from 'react';
import style from '../../style.css';

const Opponent = ({ playerCount, prevFirstBet, opponent, turn, bettingRound, currentBets }) => {
  return (
    <div className={style.opponent}>
      <div>
        {prevFirstBet !== playerCount && (
          <span className={style.betTracker}>(FIRST BET THIS ROUND)</span>
        )}
        <div>
          {playerCount !== turn && bettingRound !== 5 && (
            <span className={style.turn}>******************</span>
          )}

          <span>{` OPPONENT`}</span>

          {playerCount !== turn && bettingRound !== 5 && (
            <span className={style.turn}>******************</span>
          )}

          <div className={style.bettingLine}>
            {`CHIPS: ${opponent.chips} -------- CURRENT BET: ${opponent.bet}`}
            {bettingRound === 0 && opponent.bet === 1 && (
              <span> (ante) </span>
            )}
          </div>
        </div>
      </div>

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
