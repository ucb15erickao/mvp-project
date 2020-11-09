import React from 'react';
import style from '../../style.css';
const render = {};

render.pokerHands = ['HIGH CARD', 'PAIR', 'TWO PAIR', '3 OF A KIND', 'STRAIGHT', 'FLUSH', 'FULL HOUSE', '4 OF A KIND', 'STRAIGHT FLUSH', 'ROYAL FLUSH'];

render.largeCard = (card) => (
  <span className={style.cards}>
    {card === ''
      ? <span>
          {`[ `}<span className={style.monospace}>-</span>{` ]`}
        </span>
      : <span>
          {card === '?'
            ? <span>
                {`[ `}<span className={style.monospace}>?</span>{` ]`}
              </span>
            : <span>
                <span>[ </span>
                {card.indexOf('♦') === -1 && card.indexOf('♥') === -1
                  ? <span className={style.black}>
                      <span className={style.monospace}>{card.slice(0, card.length - 1)}</span>
                      <span>{card.slice(card.length - 1)}</span>
                    </span>
                  : <span className={style.red}>
                      <span className={style.monospace}>{card.slice(0, card.length - 1)}</span>
                      <span>{card.slice(card.length - 1)}</span>
                    </span>
                }
                <span> ]</span>
              </span>
          }
        </span>
    }
  </span>
);

render.smallCards = (cards) => (
  <span className={style.cardMessage}>
    <span>[ </span>
    <span>
      {cards.map((card, i) => (
        <span key={`${i}: ${card}`}>
          {card.indexOf('♦') === -1 && card.indexOf('♥') === -1
            ? <span className={style.black}>
                <span>{card.slice(0, card.length - 1)}</span>
                <span className={style.monospace}>{card.slice(card.length - 1)}</span>
              </span>
            : <span className={style.red}>
                <span>{card.slice(0, card.length - 1)}</span>
                <span className={style.monospace}>{card.slice(card.length - 1)}</span>
              </span>
          }
          {i < 4 && (
            <span className={style.comma}> , </span>
          )}
        </span>
      ))}
    </span>
    <span> ]</span>
  </span>
);

render.textPot = (winnings) => (
  <span className={style.potMessage}>
    &lt;
    <span className={style.currencyMessage}>{winnings}</span>
    &gt;
  </span>
);

export default render;