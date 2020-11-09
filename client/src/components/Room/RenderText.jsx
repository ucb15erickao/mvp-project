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

render.smallCard = (card, i) => (
  <span key={`${i}: ${card}`} className={style.cardMessage}>
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
  </span>
);

render.smallCards = (cards) => (
  <span className={style.cardMessage}>
    <span>{`[ `}</span>
      {cards.map((card, i) => (
        <span key={`${i}: ${card}`}>
          { render.smallCard(card, i)}
          {i < 4 && (
            <span className={style.comma}> , </span>
          )}
        </span>
      ))}
    <span>{` ]`}</span>
  </span>
);

render.betTracker = () => (
  <span>
    {`{`}
    <span className={style.betText}>BET</span>
    {`}`}
  </span>
);

render.winMessage = (winning, losing, pot) => (
  <span className={style.winMessage}>
    <span className={style.cardMessage}>
      <span>{`[ `}</span>
      <span>{render.smallCard(winning.high)}</span>
      <span className={style.highCard}>{` - HIGH`}</span>
      <span>{` ]`}</span>
    </span>
    <span> {render.pokerHands[winning.score]} </span>
    { render.smallCards(winning.hand)}
    <span>{` BEATS `}</span>
    <span className={style.cardMessage}>
      <span>{`[ `}</span>
      <span>{render.smallCard(losing.high)}</span>
      <span className={style.highCard}>{` - HIGH`}</span>
      <span>{` ] `}</span>
    </span>
    <span> {render.pokerHands[losing.score]} </span>
    { render.smallCards(losing.hand)}
    <span>{` FOR THE POT `}</span>
    { render.textPot(pot)}
  </span>
);

render.tieMessage = (winning, losing, pot) => (
  <span className={style.winMessage}>
    <span className={style.cardMessage}>
      <span>{`[ `}</span>
      <span>{render.smallCard(winning.high)}</span>
      <span className={style.highCard}>{` - HIGH`}</span>
      <span>{` ]`}</span>
    </span>
    <span> {render.pokerHands[winning.score]} </span>
    { render.smallCards(winning.hand)}
    <span>{` TIES `}</span>
    <span className={style.cardMessage}>
      <span>{`[ `}</span>
      <span>{render.smallCard(losing.high)}</span>
      <span className={style.highCard}>{` - HIGH`}</span>
      <span>{` ] `}</span>
    </span>
    <span> {render.pokerHands[losing.score]} </span>
    { render.smallCards(losing.hand)}
    <span>{` FOR A SPLIT POT `}</span>
    { render.textPot(pot / 2)}
  </span>
);

render.textPot = (winnings) => (
  <span className={style.potMessage}>
    {`{`}
    <span className={style.currencyMessage}>{winnings}</span>
    {`}`}
  </span>
);

export default render;