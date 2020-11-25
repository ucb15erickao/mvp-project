import React from 'react';
import render from './RenderText';
import style from '../../style.css';

const Cards = ({ location, hand, winner, currentBets }) => {
  if (location === 'player') {
    return (
      <div className={style.cards}>
        { render.largeCard(hand[0]) }
        <span className={style.monospace}>{` `}</span>
        {`,`}
        <span className={style.monospace}>{` `}</span>
        { render.largeCard(hand[1]) }
      </div>
    );
  } else if (location === 'opponent') {
    return (
      <div className={style.cards}>
        {(winner !== 0 && currentBets.indexOf('fold') === -1)
          ? <span>
              { render.largeCard(hand[0]) }
              <span className={style.monospace}>{` `}</span>
              {`,`}
              <span className={style.monospace}>{` `}</span>
              { render.largeCard(hand[1]) }
            </span>
          : <span>
              { render.largeCard('?') }
              <span className={style.monospace}>{` `}</span>
              {`,`}
              <span className={style.monospace}>{` `}</span>
              { render.largeCard('?') }
            </span>
        }
      </div>
    );
  } else {
    return (
      <div className={style.cards}>
        {hand.map((card, i) => {
          if (i < 4) {
            return (
              <span key={`${i}: ${card}`}>
                { render.largeCard(card) }
                <span className={style.monospace}>{` `}</span>
                {`,`}
                <span className={style.monospace}>{` `}</span>
              </span>
            );
          }
          return ( <span key={`${i}: ${card}`}>{ render.largeCard(card) }</span> );
        })}
      </div>
    );
  }
};

export default Cards;
