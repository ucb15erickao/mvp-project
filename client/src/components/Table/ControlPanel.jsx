import React from 'react';
import style from '../../style.css';

const ControlPanel = ({ clicker, changeBet, gameOver, winner, playerCount, turn, bettingRound, currentBets, player, opponent }) => {
  if (gameOver === true || winner !== 0 || bettingRound === 0) {
    if (Number(currentBets[currentBets.length - 1]) === playerCount) {
      return (
        <div className={style.ControlPanel}>
          <button disabled>WAITING FOR OPPONENT</button>
        </div>
      );
    } else if (gameOver === true) {
      return (
        <div className={style.ControlPanel}>
          <button onClick={clicker} value={playerCount}>CLICK TO PLAY AGAIN</button>
        </div>
      );
    } else {
      return (
        <div className={style.ControlPanel}>
          <button onClick={clicker} value={playerCount}>CONTINUE</button>
        </div>
      );
    }


  } else if (playerCount === turn) {
    const bets = [];
    for (let i = player.minBet, { chips } = player; i <= chips; i++) {
      bets.push(i);
    }
    return (
      <div className={style.ControlPanel}>
        {currentBets.length === 0 ||  (currentBets.length === 1 && currentBets[0] === 'check')
          ? <button onClick={clicker} value='check'>CHECK</button>
          : <button onClick={clicker} value='call'>CALL</button>
        }

        <div>
          <label className={style.betLabel}>{` ADJUST BET : `}</label>
          <select className={style.betMenu} onChange={changeBet}>
            {bets.map((amount, i) => {
              if (i === 0) {
                return ( <option key={amount} value={amount} selected>{amount}</option> );
              }
              return ( <option key={amount} value={amount}>{amount}</option> );
            })}
          </select>
          {bets.length > 0
            ? <button className={style.betButton} onClick={clicker} value='bet'>BET</button>
            : <button className={style.betButton} disabled>BET</button>
          }
        </div>

        <button onClick={clicker} value='fold'>FOLD</button>
      </div>
    );


  } else {
    return ( <div className={style.ControlPanel}>{`WAITING FOR OPPONENT...`}</div> );
  }

};

export default ControlPanel;
