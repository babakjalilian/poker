import { Card } from "./modules/Card";
import Store from "./Store";

export type PageName = "Menu" | "Game" | "Settings";
export type SuitName = "diamonds" | "clubs" | "hearts" | "spades";
export type SuitSymbol = "♦" | "♣" | "♥" | "♠";
export type CardName =
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "jack"
  | "queen"
  | "king"
  | "ace";
export type CardSymbol =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";
export type CardCost =
  | 0
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type StoreType = typeof Store;

export interface CardConstructorArgs {
  suitName: SuitName;
  cardName: CardName;
}

export interface CardType {
  suitName: SuitName;
  suitSymbol: SuitSymbol;
  cardName: CardName;
  cardSymbol: CardSymbol;
  isHidden: boolean;
  cardCost: CardCost;
  isFaded: boolean;

  fade: () => any;
  unfade: () => any;
}

export interface DeckType {
  cards: Card[];
  pickRandomCard: () => Card;
}
