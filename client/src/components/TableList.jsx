import React from 'react';
import style from '../style.css';

const TableList = ({ changePage, updateInput, joinTable, tables }) => {
  return (
    <div className={style.container}>
      <div className={style.room}>
        <h1 className={style.titleBar}>Open Tables</h1>
        <button className={style.returnToLobby} onClick={() => { changePage('lobby') }}>RETURN TO CASINO LOBBY</button>
        <div className={style.lobby}>
          <div>Select a table:</div>
          {Object.keys(tables).map((key, i) => {
            if (tables[key].length < 2) {
              return (
                <div className={style.nameForm}>
                  <span>{Number(key) + 1}</span>
                  <button onClick={() => { joinTable(key) }}>Join Game</button>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default TableList;
