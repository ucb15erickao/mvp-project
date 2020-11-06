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

const determineWinner = (firstHand, secondHand) => {
  for (let i = 0; i < 5; i++) {
    if (Number(firstHand[i]) >= Number(secondHand[i])) {  return 1  }
    else if (Number(secondHand[i]) > Number(firstHand[i])) {  return 2  }
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
    console.log('rank:', rank);
    value += rank;
  }
  const suit = card[card.length - 1];
  if (suit === '♣') {  value += 0.1  }
  else if (suit === '♦') {  value += 0.2  }
  else if (suit === '♥') {  value += 0.3  }
  else if (suit === '♠') {  value += 0.4  }
  return JSON.stringify(value);
};

const getCardFromValue = () => {
  //
};

const pick5 = (cards) => {
  const values = [];
  for (let i = 0; i < cards.length; i += 1) {  values.push(getCardValue(cards[i]));  }
  values.sort((a, b) => {  return b - a;  });
  console.log('sorted values:', values);

  const flushes = findFlush(values);
  const straights = findStraight(values);
  if (straights.length > 0 && flushes.length > 0) {
    const straightFlushes = findSF(flushes, straights);
    if (straightFlushes.length > 0) {  return straightFlushes[0];  }
  }

  const repeats = findRepeat(values);
  for (let i = 0; i < repeats.length; i += 1) {
    if (repeats[i].length === 4) {  return fillHand(repeats[i], values);  }
  }

  const fullHouses = findFH(repeats);
  if (fullHouses.length > 0) {  return fullHouses[0];  }

  if (flushes.length > 0) {  return flushes[0];  }
  if (straights.length > 0) {  return straights[0];  }

  for (let i = 0, { length } = repeats; i < length; i += 1) {
    if (repeats[i].length === 3) {  return fillHand(repeats[i], values);  }
  }

  const twoPairs = findTP(repeats);
  if (twoPairs.length > 0) {  return fillHand(twoPairs[0], values);  }

  const highPair = findHP(repeats);
  if (highPair.length > 0) {  return fillHand(highPair, values);  }

  return cards.slice(0, 5);
};

const findStraight = (cards) => {
  const straights = [];
  for (let i = 0; i < cards.length; i += 1) {
    const copy = cards.slice();
    copy.splice(i, 1);
    const container = [];
    const currentValue = cards[i].slice(0, cards[i].length - 1);
    container.push(cards[i]);
    for (let j = 0; j < copy.length; j += 1) {
      const compareValue = copy[j].slice(0, copy[j].length - 1);
      if (currentValue - compareValue <= 4) {  container.push(copy[j]);  }
      if (container.length === 5) {  straights.push(container); break;  }
    }
    const buildStraight = (straight, remainder) => {
      if (straight.length === 5) {  straights.push(container)  } else {
        //
      }
    }
  }
  console.log(`straights: ${straights}`);
  return straights;
};

const findFlush = (cards) => {
  const flushes = [];
  for (let i = 0; i < cards.length; i += 1) {
    const copy = cards.slice();
    copy.splice(i, 1);
    const container = [];
    const currentSuit = cards[i].slice(cards[i].length - 1);
    container.push(cards[i]);
    for (let j = 0; j < copy.length; j += 1) {
      const compareSuit = copy[j].slice(copy[j].length - 1);
      if (currentSuit === compareSuit) {  container.push(copy[j]);  }
      if (container.length === 5) {  flushes.push(container); break;  }
    }
  }
  console.log(`flushes: ${flushes}`);
  return flushes;
};

const findSF = (flushes, straights) => {
  const straightFlushes = [];
  if (flushes.length === 0 || straights.length === 0) {  return straightFlushes;  }
  else {
    for (let i = 0; i < flushes.length; i += 1) {
      for (let j = 0; j < straights.length; j += 1) {
        if (JSON.stringify(flushes[i]) === JSON.stringify(straights[j])) {  straightFlushes.push(straights[j]);  }
      }
    }
  }
  return straightFlushes;
};

const findRepeat = () => {
  const repeats = [];
  return repeats;
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
  return fullHand;
};

module.exports = { shuffleDeck, deal, determineWinner, pick5 };
