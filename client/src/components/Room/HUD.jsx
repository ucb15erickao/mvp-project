import React from 'react';

import style from '../../style.css';

const HUD = ({ clicker, playerCount, bettingRound, turn }) => {
  if (playerCount === turn) {
    return (
      <div className={style.HUD}>
        <button onClick={clicker} value='check'>CHECK</button>
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
