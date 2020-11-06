import React from 'react';
import style from '../../style.css';

const Opponent = ({ playerCount, gameOver, winner, prevFirstBet, opponent, turn, bettingRound, currentBets }) => {
  return (
    <div className={style.opponentContainer}>

      <div className={style.bettingLine}>
        {opponent.chips < 0 && (
          <span>
            <span className={style.lost}>{`< CHIPS : ${opponent.chips} >`}</span>
            <span>{` ----- < CURRENT BET :  ${opponent.bet}`}</span>
          </span>
        )}
        {opponent.chips >= 0 && (
          <span>{`< CHIPS : ${opponent.chips} > ----- < CURRENT BET :  ${opponent.bet}`}</span>
        )}
        {bettingRound === 1 && opponent.bet === 1 && (
          <span className={style.ante}> [ante]</span>
        )}
        <span> &gt;</span>
      </div>


      <div className={style.opponent}>
        {prevFirstBet !== playerCount && winner === 0 && gameOver === false && (
          <span className={style.startRound}>******************|||||||| </span>
        )}

        <span>{` (( OPPONENT ))`}</span>
        {winner !== 0 && winner !== playerCount && (
          <span> WINS THE CURRENT POT!</span>
        )}

        {prevFirstBet !== playerCount && winner === 0 && gameOver === false && (
          <span className={style.startRound}> ||||||||******************</span>
        )}
      </div>


      <div className={style.BTcontainer}>
        {playerCount !== turn && winner === 0 && gameOver === false && bettingRound > 0 && (
          <div className={style.betTracker}>[BET]</div>
        )}
        {(playerCount === turn || winner > 0 || gameOver === true || bettingRound === 0) && (
          <div className={style.betTrackerHidden}>[BET]</div>
        )}
      </div>


      <div className={style.cards}>
        {opponent.hand.map((card, i) => {
          if (winner !== 0 && currentBets.indexOf('fold') === -1) {
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
          if (card === '') {
            if (i === 0) {
              return (<span key={`${i}: ${card}`}>{' [ - ] ,'}</span>);
            }
            return (<span key={`${i}: ${card}`}>{' [ - ]'}</span>);
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
