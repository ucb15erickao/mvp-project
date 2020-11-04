import React from 'react';

import style from '../../style.css';

const HUD = ({ clicker, playerCount, bettingRound, turn }) => {
  if (bettingRound === 5) {
    return (
      <div className={style.HUD}>
        <button onClick={clicker} value='check'>PLAY AGAIN</button>
      </div>
    );
  } else if (playerCount === turn) {
    return (
      <div className={style.HUD}>
        <button onClick={clicker} value='check'>CHECK / CALL</button>
        <button onClick={clicker} value='bet'>BET</button>
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
