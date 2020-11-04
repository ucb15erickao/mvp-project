import React from 'react';
import style from '../../style.css';

const HUD = ({ clicker, changeBet, playerCount, turn, bettingRound, currentBets, player }) => {
  const bets = [];
  for (let i = 1, { chips } = player; i <= chips; i++) {
    bets.push(i);
  }
  if (bettingRound === 5) {
    if (currentBets.length === 1 && Number(currentBets[0]) === playerCount) {
      return (
        <div className={style.HUD}>
          <button disabled>WAITING FOR OPPONENT</button>
        </div>
      );
    } else {
      return (
        <div className={style.HUD}>
          <button onClick={clicker} value={playerCount}>PLAY AGAIN</button>
        </div>
      );
    }
  } else if (playerCount === turn) {
    return (
      <div className={style.HUD}>
        <button onClick={clicker} value='check'>CHECK / CALL</button>

        <div>
          <label className={style.bettingLine}> Adjust Bet: </label>
          <select onChange={changeBet}>
            {bets.map(amount => (
              <option value={amount}>{amount}</option>
            ))}
          </select>
          <button className={style.betButton} onClick={clicker} value='bet'>BET</button>
        </div>

        <button onClick={clicker} value='fold'>FOLD</button>
      </div>
    );
  } else {
    return (
      <div className={style.HUD}>
        <span>WAITING FOR OPPONENT...</span>
      </div>
    )
  }

};

export default HUD;
