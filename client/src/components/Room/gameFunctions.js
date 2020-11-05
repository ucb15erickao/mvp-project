const shuffleDeck = () => {
  const deck = ['A♣', 'A♦',  'A♥',  'A♠',  '2♣',  '2♦', '2♥', '2♠', '3♣',  '3♦',  '3♥',  '3♠',  '4♣', '4♦', '4♥', '4♠',  '5♣',  '5♦',  '5♥',  '5♠', '6♣', '6♦', '6♥',  '6♠',  '7♣',  '7♦',  '7♥', '7♠', '8♣', '8♦',  '8♥',  '8♠',  '9♣',  '9♦', '9♥', '9♠', '10♣', '10♦', '10♥', '10♠', 'J♣', 'J♦', 'J♥', 'J♠',  'Q♣',  'Q♦',  'Q♥',  'Q♠', 'K♣', 'K♦', 'K♥',  'K♠'];
  for (let i = 0, {length} = deck; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const currentCard = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = currentCard;
  }
  return deck;
};

const deal = (deck) => {
  const draw = deck.pop();
  return [draw, deck];
};

const pick5 = (cards) => {
  console.log('cards 1:', cards);
  for (let i = 0; i < cards.length; i++) {
    const cardString = cards[i];
    cards[i] = cardConverter(cardString);
  }
  console.log('cards 2:', cards);
  cards.sort((a, b) => {  return b - a;  });
  console.log('cards 3:', cards);
  return cards.slice(0, 5);
};

const determineWinner = (firstHand, secondHand) => {
  for (let i = 0; i < 5; i++) {
    if (firstHand[i] > secondHand[i]) {
      return firstHand;
    } else if (secondHand[i] > firstHand[i]) {
      return secondHand;
    }
  }
};

const cardConverter = (card) => {
  let value = 0;
  if (Number.isNaN(Number(card[0])) === true) {
    if (card[0] === 'A') {
      value += 14;
    } else if (card[0] === 'K') {
      value += 13;
    } else if (card[0] === 'Q') {
      value += 12;
    } else if (card[0] === 'J') {
      value += 11;
    }
  } else {
    const int = Number(card.slice(0, card.length - 1));
    console.log('int:', int);
    value += int;
  }
  const decimalSymbol = card[card.length - 1];
  if (decimalSymbol === '♣') {
    value += 0.1;
  } else if (decimalSymbol === '♦') {
    value += 0.2;
  } else if (decimalSymbol === '♥') {
    value += 0.3;
  } else if (decimalSymbol === '♠') {
    value += 0.4;
  }
  return value;
};

module.exports = { shuffleDeck, deal, pick5, determineWinner };
