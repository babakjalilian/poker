import { makeAutoObservable } from 'mobx';
import { cardNames, suitNames } from '../Consts';
import { type DeckType } from '../types';
import Card from './Card';

export class Deck implements DeckType {
  cards = [];

  constructor () {
    this.cards = suitNames
      .map((suitName) => {
        return cardNames.map((cardName) => {
          return new Card(suitName, cardName);
        });
      }).flat();

    makeAutoObservable(this);
  }

  pickRandomCard (): Card {
    const allCards = this.cards;
    const amountOfFreeCards = allCards.length;
    const randomCardIndex = Math.floor(Math.random() * (amountOfFreeCards - 1));
    const randomCard = allCards[randomCardIndex];
    const cardsLeft = allCards.filter((_, id) => id !== randomCardIndex);
    this.cards = cardsLeft;
    return randomCard;
  }
}
