import React, { Component } from 'react';
import { Cards, EmptyCard, Default } from './cardsData/cards'
import Card from './models/card'
import './App.css';
import Pile from './models/pile';
import Game from './models/game';
import lodash from 'lodash';

const defaultCard = new Card(Default);
const emptyCard = new Card(EmptyCard);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { game: this.initializeGame(), message: '' };
  }

  initializePile() {
    const pile = new Pile();
    const shuffledCards = lodash.shuffle(Cards);
    shuffledCards.forEach(card => pile.addCard(new Card(card)));
    return pile;
  }

  initializeReservedPiles(game, range) {
    for (let index = 0; index < range; index++) {
      game.addReservedPile(new Pile());
    }
  }

  initializeStackPiles(game, range) {
    for (let index = 0; index < range; index++) {
      const pile = new Pile();
      for (let i = 0; i <= index; i++) {
        pile.addCard(game.drawCard())
        pile.blockLastCard();
      }
      pile.revealLastCard();
      game.addStackPile(pile);
    }
  }

  initializeGame() {
    const game = new Game();
    game.addShuffledPile(this.initializePile());
    this.initializeReservedPiles(game, 4);
    this.initializeStackPiles(game, 7);
    game.setShowCardPile(new Pile());
    return game;
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drag(event) {
    event.dataTransfer.setData("id", event.target.id);
  }


  dropInReservedPile(destination, event) {
    event.preventDefault();
    const src = event.dataTransfer.getData("id");
    this.setState(state => {
      const { game } = state;
      game.addCardToReservedPile(destination, src)
      return { game }
    })
  }

  dropInStackPile(destination, event) {
    event.preventDefault();
    const src = event.dataTransfer.getData("id");
    this.setState(state => {
      const { game } = state;
      game.addCardToStackPile(destination, src)
      return { game }
    })
  }

  changeCard() {
    this.setState(state => {
      let { game, message } = state;
      game.changeCard();
      return { game, message };
    })
  }

  placeCard(src, noOfCards) {
    this.setState(state => {
      const { game } = state;
      game.moveToPossiblePile(src, noOfCards);
      return { game };
    })
  }
  showTopMostCard() {
    let card = this.state.game.getTopMostCard();
    if (!card) card = emptyCard;
    return <div id="showCard" onDoubleClick={this.placeCard.bind(this, "showCard")} className="card" style={this.getColor(card)} draggable={this.state.game.showCardPile.isDraggable()} onDragStart={this.drag}>{card.getUnicode()}</div>;
  }

  showAllReservedPiles() {
    const piles = this.state.game.reservedPiles;
    return piles.map((pile, index) => {
      let card = pile.getLastCard();
      if (!card) card = emptyCard;
      return <div className="card" style={this.getColor(card)} id={"reserved_" + index} onDrop={this.dropInReservedPile.bind(this, index)} onDragOver={this.allowDrop} draggable={pile.isDraggable()} onDragStart={this.drag}>{card.getUnicode()}</div>
    })
  }

  getColor(card) {
    return { color: card.color }
  }

  showAllStackCards(pile, index) {
    const totalCards = pile.cards.length;
    if (totalCards === 0) return <div className="stackCard">{emptyCard.getUnicode()}</div>;
    return pile.cards.map((card, i) => {
      const dblClickHandler = this.placeCard.bind(this, index, (totalCards - i));
      if (i + 1 === totalCards) {
        card.revealCard();
      }
      if (card.isBlocked()) return <div className="stackCard" style={this.getColor(card)} draggable="false">{card.getUnicode()}</div>
      return <div id={"stackPile_" + index + "_" + (totalCards - i)} onDoubleClick={dblClickHandler} className="stackCard" style={this.getColor(card)} draggable={pile.isDraggable()} onDragStart={this.drag} > {card.getUnicode()}</div>
    })
  }

  showAllStackPiles() {
    const piles = this.state.game.stackPiles;
    return piles.map((pile, index) => {
      return <div id={index} onDrop={this.dropInStackPile.bind(this, index)} onDragOver={this.allowDrop} className="stack">{this.showAllStackCards(pile, index)}</div>
    })
  }
  render() {
    return <div>
      <div>{this.state.message}</div>
      <div className="main">
        <div className="deck">
          <div className="card" onClick={this.changeCard.bind(this)}>{defaultCard.getUnicode()}</div>
          {this.showTopMostCard()}
        </div>
        <div className="deck">
          {this.showAllReservedPiles()}
        </div>
      </div>
      <div className="stackPile">
        {this.showAllStackPiles()}
      </div>
    </div>;
  }
}

export default App;
