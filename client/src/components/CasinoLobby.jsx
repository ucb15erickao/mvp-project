import React from 'react';
import style from '../style.css';

const CasinoLobby = ({ changePage, updateInput, setName, name }) => {
  return (
    <div className={style.container}>
      <div className={style.room}>
        <h1 className={style.titleBar}>Texas Hold'em</h1>
        <div className={style.lobby}>

          <div className={style.nameForm}>
            {name === ''
              ? <label>ENTER YOUR NAME:</label>
              : <label>CHANGE YOUR NAME:</label>
            }
            <input id="nameInput" className={style.nameInput} onChange={(e) => { updateInput(e.target.value) }}></input>
            <br/>
            <br/>
            <button onClick={setName}>SUBMIT</button>
          </div>

          {name === ''
            ? <div>
                <div>WELCOME TO THE CASINO! PUT A NAMETAG ON TO PLAY.</div>
                <br/>
                <div className={style.lobbyButtons}>
                  <button disabled>FIND A RANDOM GAME</button>
                  <button disabled>JOIN A PRIVATE GAME</button>
                </div>
              </div>
            : <div>
                <div>
                  {`WELCOME,`}
                  <span className={style.name}>{name}</span>
                  {`!`}
                </div>
                <br/>
                <div className={style.lobbyButtons}>
                  <button onClick={() => { console.log('public') }}>FIND A PUBLIC TABLE</button>
                  <button onClick={() => { changePage('private') }}>JOIN A PRIVATE TABLE</button>
                </div>
              </div>
          }

        </div>
      </div>
    </div>
  );
}

export default CasinoLobby;
