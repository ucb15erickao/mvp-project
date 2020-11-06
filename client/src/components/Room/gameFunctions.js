const shuffleDeck = () => {
  const deck = ['A♣', 'A♦',  'A♥',  'A♠',  '2♣',  '2♦', '2♥', '2♠', '3♣',  '3♦',  '3♥',  '3♠',  '4♣', '4♦', '4♥', '4♠',  '5♣',  '5♦',  '5♥',  '5♠', '6♣', '6♦', '6♥',  '6♠',  '7♣',  '7♦',  '7♥', '7♠', '8♣', '8♦',  '8♥',  '8♠',  '9♣',  '9♦', '9♥', '9♠', '10♣', '10♦', '10♥', '10♠', 'J♣', 'J♦', 'J♥', 'J♠',  'Q♣',  'Q♦',  'Q♥',  'Q♠', 'K♣', 'K♦', 'K♥',  'K♠'];
  for (let i = 0, { length } = deck; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * length);
    const currentCard = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = currentCard;
  }
  return deck;
};

const deal = (deck) => {
  return [deck.pop(), deck];
};

const determineWinner = (player1, player2) => {
  const [score1, hand1] = player1;
  const [score2, hand2] = player2;
  if (score1 > score2) {  console.log('hand1:', hand1); return 1  }
  else if (score1 < score2) {  console.log('hand2:', hand2); return 2  }
  else {
    for (let i = 0; i < 5; i++) {
      if (Number(hand1[i]) > Number(hand2[i])) {  console.log(`hand1[${i}]: ${hand1[i]}`); return 1  }
      else if (Number(hand1[i]) < Number(hand2[i])) {  console.log(`secondHand[${i}]: ${hand2[i]}`); return 2  }
    }
  }
};

const getCardValue = (card) => {
  let value = 0, rank = card[0];
  if (Number.isNaN(Number(rank)) === true) {
    if (rank === 'A') {  value += 14  }
    else if (rank === 'K') {  value += 13  }
    else if (rank === 'Q') {  value += 12  }
    else if (rank === 'J') {  value += 11  }
  } else {
    rank = Number(card.slice(0, card.length - 1));
    value += rank;
  }
  const suit = card[card.length - 1];
  if (suit === '♣') {  value += 0.1  }
  else if (suit === '♦') {  value += 0.2  }
  else if (suit === '♥') {  value += 0.3  }
  else if (suit === '♠') {  value += 0.4  }
  return JSON.stringify(value);
};

const getCardFromValue = (value) => {
  let card = '', separated = value.split('.');
  const rank = separated[0], suit = separated[1];
  if (rank > 10) {
    const letters = ['J', 'Q', 'K', 'A'];
    card += letters[rank - 11];
  } else {  card += rank  }
  if (suit === '1') {  card += '♣'  }
  else if (suit === '2') {  card += '♦'  }
  else if (suit === '3') {  card += '♥'  }
  else if (suit === '4') {  card += '♠'  }
  return card;
};

const convertHand = (hand) => {
  const cards = [];
  for (let i = 0; i < 5; i++) {  cards.push(getCardFromValue(hand[i]))  }
  return cards;
}

const pick5 = (cards) => {
  const values = [];
  for (let i = 0; i < cards.length; i += 1) {  values.push(getCardValue(cards[i]))  }
  values.sort((a, b) => {  return b - a  });
  console.log('sorted values:', values);
  const flushes = findFlush(values);
  const straights = findStraight(values);
  if (straights.length > 0 && flushes.length > 0) {
    const straightFlushes = findSF(flushes, straights);
    if (straightFlushes.length > 0) {  return [9, straightFlushes[0]]  }
  }
  const repeats = findRepeats(values);
  for (let i = 0; i < repeats.length; i += 1) {
    if (repeats[i].length === 4) {  return [8, fillHand(repeats[i], values)]  }
  }
  const fullHouses = findFH(repeats);
  if (fullHouses.length > 0) {  return [7, fullHouses[0]]  }
  if (flushes.length > 0) {  return [6, flushes[0]]  }
  if (straights.length > 0) {  return [5, straights[0]]  }
  for (let i = 0, { length } = repeats; i < length; i += 1) {
    if (repeats[i].length === 3) {  return [4, fillHand(repeats[i], values)]  }
  }
  const twoPairs = findTP(repeats);
  if (twoPairs.length > 0) {  return [3, fillHand(twoPairs[0], values)]  }
  if (repeats.length > 0) {  return [2, fillHand(repeats[0], values)]  }
  return [1, values.slice(0, 5)];
};

const findStraight = (cards) => {
  const straights = {};
  const buildStraights = (straight, remainder) => {
    if (straight.length === 5) {
      const str = JSON.stringify(straight);
      if (straights[str] === undefined) {  straights[str] = straight  }
    } else {
      let currentValue = null;
      const lastItem = straight[straight.length - 1];
      if (lastItem) {  currentValue = lastItem.slice(0, lastItem.length - 1)  }
      for (let i = 0; i < remainder.length; i++) {
        const compareValue = remainder[i].slice(0, remainder[i].length - 1);
        if (!currentValue || Number(currentValue) - compareValue === 1) {
          const copy = remainder.slice();
          const removed = copy.splice(i, 1);
          buildStraights(straight.concat(removed), copy);
        }
      }
    }
  };
  buildStraights([], cards);
  console.log('straights:', Object.values(straights));
  return Object.values(straights);
};

const findFlush = (cards) => {
  const flushes = {};
  const buildFlushes = (flush, remainder) => {
    if (flush.length === 5) {
      flush.sort((a, b) => {  return b - a  });
      const str = JSON.stringify(flush);
      if (flushes[str] === undefined) {  flushes[str] = flush  }
    } else {
      let currentValue = null;
      const lastItem = flush[flush.length - 1];
      if (lastItem) {  currentValue = lastItem.slice(lastItem.length - 2)  }
      for (let i = 0; i < remainder.length; i++) {
        const compareValue = remainder[i].slice(remainder[i].length - 2);
        if (!currentValue || Number(currentValue) - compareValue === 0) {
          const copy = remainder.slice();
          const removed = copy.splice(i, 1);
          buildFlushes(flush.concat(removed), copy);
        }
      }
    }
  };
  buildFlushes([], cards);
  console.log('flushes:', Object.values(flushes));
  return Object.values(flushes);
};

const findSF = (flushes, straights) => {
  const straightFlushes = [];
  if (flushes.length === 0 || straights.length === 0) {  return straightFlushes  }
  else {
    for (let i = 0; i < flushes.length; i += 1) {
      for (let j = 0; j < straights.length; j += 1) {
        if (JSON.stringify(flushes[i]) === JSON.stringify(straights[j])) {  straightFlushes.push(straights[j])  }
      }
    }
  }
  return straightFlushes;
};

const findRepeats = (cards) => {
  const repeats = {};
  for (let i = 0; i < cards.length; i++) {
    const currentSet = [cards[i]];
    const currentValue = cards[i].slice(0, cards[i].length - 1);
    const copy = cards.slice(i + 1);
    for (let j = 0; j < copy.length; j++) {
      const compareValue = copy[j].slice(0, copy[j].length - 1);
      if (Number(currentValue) - compareValue === 0) {
        currentSet.push(copy[j]);
      }
    }
    if (currentSet.length > 1) {
      currentSet.sort((a, b) => {  return b - a  });
      const str = JSON.stringify(currentSet);
      if (repeats[str] === undefined) {  repeats[str] = currentSet  }
    }
  }
  console.log('repeats:', Object.values(repeats));
  return Object.values(repeats);
};

const findFH = (multiples) => {
  const fullHouses = [];
  return fullHouses;
};

const findTP = (multiples) => {
  const twoPairs = [];
  return twoPairs;
};

const findHP = (multiples) => {
  const highPair = [];
  return highPair;
};

const fillHand = (combo, allCards) => {
  const fullHand = [];
  for (let i = 0; i < combo.length; i++) {
    fullHand.push(combo[i]);
    allCards.splice(allCards.indexOf(combo[i]), 1);
  }
  allCards.sort((a, b) => {  return b - a  });
  for (let i = 0, { length } = fullHand; i < (5 - length); i++) {
    fullHand.push(allCards[i]);
  }
  console.log('fullHand:', fullHand);
  return fullHand;
};

module.exports = { shuffleDeck, deal, determineWinner, pick5, convertHand };
