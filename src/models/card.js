class Card {
  constructor({ suit, color, value, unicode }) {
    this.suit = suit;
    this.color = color;
    this.value = value;
    this.unicode = unicode;
    this.isBlockedCard = false;
    this.actualUnicode = unicode;
    this.actualColor = color;
  }
  getUnicode() {
    return this.unicode;
  }
  blockCard() {
    this.isBlockedCard = true;
    this.unicode = "\u{1F0A0}";
    this.color = "black";
  }
  revealCard() {
    this.isBlockedCard = false;
    this.unicode = this.actualUnicode;
    this.color = this.actualColor;
  }
  isBlocked() {
    return this.isBlockedCard;
  }
}

export default Card;