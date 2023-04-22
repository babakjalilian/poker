import { makeAutoObservable } from 'mobx';
import {
  cardCosts,
  cardNames,
  cardSymbols,
  suitNames,
  suitSymbols
} from '../Consts';
import {
  type CardCost,
  type CardName,
  type CardSymbol,
  type CardType,
  type SuitName,
  type SuitSymbol
} from '../types';

export default class Card implements CardType {
  suitName: SuitName = suitNames[0];
  suitSymbol: SuitSymbol;
  cardName = cardNames[0];
  cardSymbol: CardSymbol;
  isHidden = false;
  cardCost: CardCost;
  isFaded = false;

  constructor (suitName: SuitName, cardName: CardName) {
    this.suitName = suitName;
    this.suitSymbol = suitSymbols[suitName];
    this.cardName = cardName;
    this.cardSymbol = cardSymbols[cardName];
    this.cardCost = cardCosts[cardName];
    makeAutoObservable(this);
  }

  fade (): void {
    this.isFaded = true;
  }

  unfade (): void {
    this.isFaded = false;
  }

  hide (): void {
    this.isHidden = true;
  }

  show (): void {
    this.isHidden = false;
  }
}
