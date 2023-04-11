import { CardCost, CardName, CardSymbol, SuitName, SuitSymbol } from "./types";

export const suitNames: SuitName[] = ["diamonds", "clubs", "hearts", "spades"];
export const suitSymbols: Partial<Record<SuitName, SuitSymbol>> = {
  diamonds: "♦",
  clubs: "♣",
  hearts: "♥",
  spades: "♠",
};
export const cardNames: CardName[] = [
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "jack",
  "queen",
  "king",
  "ace",
];

export const cardSymbols: Partial<Record<CardName, CardSymbol>> = {
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  jack: "J",
  queen: "Q",
  king: "K",
  ace: "A",
};
export const cardCosts: Partial<Record<CardName, CardCost>> = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  jack: 11,
  queen: 12,
  king: 13,
  ace: 14,
};
