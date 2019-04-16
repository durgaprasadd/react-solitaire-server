class Game {
  constructor() {
    this.deck = null;
    this.reservedPiles = [];
    this.showCardPile = null;
    this.stackPiles = [];
  }
  addShuffledPile(pile) {
    this.deck = pile;
  }
  addReservedPile(pile) {
    this.reservedPiles.push(pile);
  }
  addStackPile(pile) {
    this.stackPiles.push(pile);
  }
  setShowCardPile(pile) {
    this.showCardPile = pile;
  }

  reloadDeck() {
    if (this.showCardPile.isEmpty()) return;
    this.deck.addCard(this.showCardPile.drawCard());
    return this.reloadDeck();
  }

  changeCard() {
    if (this.deck.isEmpty()) {
      return this.reloadDeck()
    }
    this.showCardPile.addCard(this.drawCard());
  }

  drawCard() {
    return this.deck.drawCard();
  }

  getTopMostCard() {
    return this.showCardPile.getLastCard();

  }
  addCardToReservedPile(id, des) {
    des = des.split("_")
    if (des.includes("showCard"))
      return this.addCardToReservedPileFromWaste(id);
    if (des.includes("stackPile"))
      return this.addCardToFoundationFromTableau(id, des[1], +des[2]);
  }

  addCardToStackPile(id, des) {
    des = des.split("_");
    if (des.includes("showCard"))
      return this.addCardToStackPileFromWaste(id);
    if (des.includes("reserved"))
      return this.addCardToStackPileFromFoundation(id, des[1]);
    return this.addCardToTableauFromTableau(id, des[1], +des[2]);
  }

  addCardToStackPileFromWaste(id) {
    const pile = this.stackPiles[id];
    const srcPile = this.showCardPile;
    const isAddable = pile.isAddableToStackPile(srcPile.getLastCardValue());
    const isAlternateColor = pile.isAlternateColor(srcPile.getLastCardColor());
    if (isAddable && isAlternateColor)
      pile.addCard(srcPile.drawCard())
    return isAddable && isAlternateColor;
  }

  addCardToReservedPileFromWaste(id) {
    const pile = this.reservedPiles[id];
    const srcPile = this.showCardPile;
    const isAddable = pile.isAddableToReservedPile(srcPile.getLastCardValue());
    const isSameSuit = pile.isSameSuit(srcPile.getLastCardSuit());
    if (isAddable && isSameSuit)
      pile.addCard(srcPile.drawCard())
    return isAddable && isSameSuit;
  }

  addCardToStackPileFromFoundation(id, des) {
    const pile = this.stackPiles[id];
    const srcPile = this.reservedPiles[des];
    const isAddable = pile.isAddableToStackPile(srcPile.getLastCardValue());
    const isAlternateColor = pile.isAlternateColor(srcPile.getLastCardColor());
    if (isAddable && isAlternateColor)
      pile.addCard(srcPile.drawCard());
    return isAddable && isAlternateColor;
  }

  addCardToFoundationFromTableau(id, des, noOfCards) {
    if (noOfCards > 1)
      return false;
    const pile = this.reservedPiles[id];
    const srcPile = this.stackPiles[des];
    const isAddable = pile.isAddableToReservedPile(srcPile.getLastCardValue());
    const isSameSuit = pile.isSameSuit(srcPile.getLastCardSuit());
    if (isAddable && isSameSuit)
      pile.addCard(srcPile.drawCard())
    return isAddable && isSameSuit;
  }

  addCardToTableauFromTableau(id, des, noOfCards) {
    const pile = this.stackPiles[id];
    const srcPile = this.stackPiles[des];
    const isAddable = pile.isAddableToStackPile(srcPile.getCardValue(noOfCards));
    const isAlternateColor = pile.isAlternateColor(srcPile.getCardColor(noOfCards));
    if (isAddable && isAlternateColor)
      pile.addCards(srcPile.drawCards(noOfCards));
    return isAddable && isAlternateColor;
  }

  isDraggable(pile) {
    return pile.isDraggable();
  }

  moveToPossiblePile(src, noOfCards) {
    if (src === "showCard") {
      let result = this.reservedPiles.some((x, id) => this.addCardToReservedPileFromWaste(id));
      result = result || this.stackPiles.some((x, id) => this.addCardToStackPileFromWaste(id));
      return result;
    }
    let result = this.reservedPiles.some((x, id) => this.addCardToFoundationFromTableau(id, src, noOfCards));
    result = result || this.stackPiles.some((x, id) => this.addCardToTableauFromTableau(id, src, noOfCards));
    return result;
  }
}

export default Game;