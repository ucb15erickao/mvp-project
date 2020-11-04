import React from 'react';
import style from '../../style.css';

const HUD = ({ clicker, changeBet, playerCount, turn, bettingRound, currentBets, player, opponent }) => {
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
    let minimum = 1;
    if (currentBets[currentBets.length - 1] === 'bet') {
      minimum = opponent.bet - player.bet + 1;
    }
    console.log('minimum:', minimum);
    const bets = [];
    for (let i = minimum, { chips } = player; i <= chips; i++) {
      bets.push(i);
    }
    return (
      <div className={style.HUD}>
        <button onClick={clicker} value='check'>CHECK / CALL</button>

        <div>
          <label className={style.bettingLine}> ADJUST BET: </label>
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
