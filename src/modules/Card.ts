import { makeAutoObservable } from "mobx";
import {
  cardCosts,
  cardNames,
  cardSymbols,
  suitNames,
  suitSymbols,
} from "../Consts";
import {
  CardConstructorArgs,
  CardCost,
  CardSymbol,
  CardType,
  SuitName,
  SuitSymbol,
} from "../types";

export class Card implements CardType {
  suitName: SuitName = suitNames[0];
  suitSymbol: SuitSymbol;
  cardName = cardNames[0];
  cardSymbol: CardSymbol;
  isHidden = false;
  cardCost: CardCost;
  isFaded = false;

  constructor({ suitName, cardName }: CardConstructorArgs) {
    this.suitName = suitName;
    this.suitSymbol = suitSymbols[suitName]!;
    this.cardName = cardName;
    this.cardSymbol = cardSymbols[cardName]!;
    this.cardCost = cardCosts[cardName];
    makeAutoObservable(this);
  }

  fade() {
    this.isFaded = true;
  }

  unfade() {
    this.isFaded = false;
  }

  hide() {
    this.isHidden = true;
  }
  show() {
    this.isHidden = false;
  }
}
