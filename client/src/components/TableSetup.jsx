import React from 'react';
import style from '../style.css';

const TableSetup = ({ changePage, updateInput, createTable }) => {
  return (
    <div className={style.container}>
      <div className={style.room}>
        <h1 className={style.titleBar}>Start A New Table</h1>
        <button className={style.returnToLobby} onClick={() => { changePage('lobby') }}>
          RETURN TO CASINO LOBBY
        </button>
        <div className={style.nameForm}>
          <label>ENTER PASSWORD (optional):</label>
          <input id="nameInput" className={style.nameInput} onChange={(e) => { updateInput(e.target.value) }}></input>
          <button onClick={() => { createTable() }}>ENTER GAME</button>
        </div>
      </div>
    </div>
  );
}

export default TableSetup;
