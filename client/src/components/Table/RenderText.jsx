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
                {`[ `}
                {card.indexOf('♦') === -1 && card.indexOf('♥') === -1
                  ? <span className={style.black}>
                      <span className={style.monospace}>{ card.slice(0, card.length - 1) }</span>
                      { card.slice(card.length - 1) }
                    </span>
                  : <span className={style.red}>
                      <span className={style.monospace}>{ card.slice(0, card.length - 1) }</span>
                      { card.slice(card.length - 1) }
                    </span>
                }
                {` ]`}
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
          { card.slice(0, card.length - 1) }
          <span className={style.monospace}>{ card.slice(card.length - 1) }</span>
        </span>
      : <span className={style.red}>
          { card.slice(0, card.length - 1) }
          <span className={style.monospace}>{ card.slice(card.length - 1) }</span>
        </span>
    }
  </span>
);

render.smallCards = (cards) => (
  <span className={style.cardMessage}>
    {`[ `}
    {cards.map((card, i) => (
      <span key={`${i}: ${card}`}>
        { render.smallCard(card, i) }
        {i < 4 && ( <span className={style.comma}>{` , `}</span> )}
      </span>
    ))}
    {` ]`}
  </span>
);

render.betTracker = () => (
  <span>
    {`{`}<span className={style.betText}>BET</span>{`}`}
  </span>
);


render.winMessage = (winning, losing, pot) => (
  <span className={style.winMessage}>

    <span className={style.cardMessage}>
      {`[ `}
      { render.smallCard(winning.high) }
      <span className={style.highCard}>{` - HIGH`}</span>
      {` ]`}
    </span>

    {` `}{ render.pokerHands[winning.score] }
    {` `}{ render.smallCards(winning.hand) }
    {` BEATS `}

    <span className={style.cardMessage}>
      {`[ `}
      { render.smallCard(losing.high) }
      <span className={style.highCard}>{` - HIGH`}</span>
      {` ]`}
    </span>

    {` `}{ render.pokerHands[losing.score] }
    {` `}{ render.smallCards(losing.hand) }
    {` FOR THE POT `}
    { render.textPot(pot) }

  </span>
);


render.tieMessage = (winning, losing, pot) => (
  <span className={style.winMessage}>

    <span className={style.cardMessage}>
      {`[ `}
      { render.smallCard(winning.high) }
      <span className={style.highCard}>{` - HIGH`}</span>
      {` ]`}
    </span>

    {` `}{ render.pokerHands[winning.score] }
    {` `}{ render.smallCards(winning.hand) }
    {` TIES `}

    <span className={style.cardMessage}>
      {`[ `}
      { render.smallCard(losing.high) }
      <span className={style.highCard}>{` - HIGH`}</span>
      {` ]`}
    </span>

    {` `}{ render.pokerHands[losing.score] }
    {` `}{ render.smallCards(losing.hand) }
    {` FOR A SPLIT POT `}
    { render.textPot(pot / 2) }

  </span>
);


render.textPot = (winnings) => (
  <span className={style.potMessage}>
    {`{`}<span className={style.currencyMessage}>{winnings}</span>{`}`}
  </span>
);

export default render;
