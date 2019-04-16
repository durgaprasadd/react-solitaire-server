class Pile {
  constructor() {
    this.cards = [];
  }
  addCard(card) {
    this.cards.push(card);
  }
  addCards(cards) {
    cards.forEach(card => this.addCard(card));
  }
  getLastCard() {
    return this.cards[this.cards.length - 1];
  }

  getCard(id) {
    return this.cards[this.cards.length - id];
  }

  getCardValue(id) {
    if (this.getCard(id)) {
      return this.getCard(id).value;
    }
    return 0;
  }

  getCardColor(id) {
    return this.getCard(id).color;
  }

  getLastCardValue() {
    if (this.getLastCard()) {
      return this.getLastCard().value;
    }
    return 0;
  }
  getLastCardColor() {
    return this.getLastCard().color;
  }
  getLastCardSuit() {
    return this.getLastCard().suit;
  }
  drawCard() {
    return this.cards.pop();
  }
  drawCards(noOfCards) {
    let result = new Array(noOfCards).fill(1);
    result = result.map(x => this.drawCard());
    result.reverse();
    return result;
  }
  isDraggable() {
    return this.cards.length > 0;
  }
  blockLastCard() {
    this.getLastCard().blockCard();
  }
  revealLastCard() {
    this.getLastCard().revealCard();
  }

  isAddableToStackPile(value) {
    if (this.getLastCardValue() === 0)
      return value === 13;
    return this.getLastCardValue() === value + 1;
  }

  isAddableToReservedPile(value) {
    return this.getLastCardValue() === value - 1;
  }

  isAlternateColor(color) {
    if (this.getLastCard())
      return this.getLastCardColor() !== color;
    return true;
  }
  isSameSuit(suit) {
    if (this.getLastCard())
      return this.getLastCardSuit() === suit;
    return true;
  }
  isEmpty() {
    return this.cards.length === 0;
  }
}

export default Pile;