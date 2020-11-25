import React from 'react';
import style from '../style.css';

const PrivateTables = ({ changePage, privateGame }) => {
  return (
    <div className={style.container}>
      <div className={style.room}>
        <h1 className={style.titleBar}>Texas Hold'em Private Tables</h1>
        <button className={style.returnToLobby} onClick={() => { changePage('lobby') }}>RETURN TO CASINO LOBBY</button>
        <div className={style.lobby}>
          <button onClick={() => { privateGame('new') }}>START A NEW PRIVATE GAME</button>
          <button onClick={() => { privateGame('join') }}>ENTER PRIVATE GAME CODE</button>
        </div>
      </div>
    </div>
  );
}

export default PrivateTables;
