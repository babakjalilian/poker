import { type CardCost, type CardName, type CardSymbol, type SuitName, type SuitSymbol } from './types';

export const suitNames: SuitName[] = ['diamonds', 'clubs', 'hearts', 'spades'];
export const suitSymbols: Record<SuitName, SuitSymbol> = {
  diamonds: '♦',
  clubs: '♣',
  hearts: '♥',
  spades: '♠'
};
export const cardNames: CardName[] = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];

export const cardSymbols: Record<CardName, CardSymbol> = {
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
  ace: 'A'
};
export const cardCosts: Record<CardName, CardCost> = {
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
  ace: 14
};

export const humanPlayerNames: string[] = ['player-1', 'player-2', 'player-3', 'player-4'];

export enum POKER_ROUNDS {
  BLIND_CALL = 'BLIND_CALL', // 0 cards on the table
  FLOP = 'FLOP', // 3 cards on the table
  TURN = 'TURN', // 4 cards on the table
  RIVER = 'RIVER', // 5 cards on the table
}

export enum BET_ACTION {
  RAISE = 'RAISE',
  SUPPORT = 'SUPPORT',
  ALL_IN = 'ALL_IN',
  BIG_BLIND = 'BIG_BLIND',
  SMALL_BLIND = 'SMALL_BLIND',
}

export enum COMBINATIONS {
  HIGH_CARD = 'HIGH_CARD',
  PAIR = 'PAIR',
  TWO_PAIRS = 'TWO_PAIRS',
  THREE_OF_KIND = 'THREE_OF_KIND',
  STRAIGHT = 'STRAIGHT',
  FLUSH = 'FLUSH',
  FULL_HOUSE = 'FULL_HOUSE',
  FOUR_OF_KIND = 'FOUR_OF_KIND',
  STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
  ROYAL_FLUSH = 'ROYAL_FLUSH',
}

export enum COMBINATION_NAMES_HUMAN {
  HIGH_CARD = 'high card',
  PAIR = 'pair',
  TWO_PAIRS = 'two pairs',
  THREE_OF_KIND = 'three of kind',
  STRAIGHT = 'straight', // add ace - two ... street
  FLUSH = 'flush',
  FULL_HOUSE = 'full house',
  FOUR_OF_KIND = 'four of kind',
  STRAIGHT_FLUSH = 'straight flush',
  ROYAL_FLUSH = 'royal flush',
}
