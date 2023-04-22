import { type BET_ACTION, type COMBINATIONS } from './Consts';
import type Card from './stores/Card';
import { type Player } from './stores/Player';
import type Store from './stores/Store';

export type PageName = 'Menu' | 'Game' | 'Settings';
export type SuitName = 'diamonds' | 'clubs' | 'hearts' | 'spades';
export type SuitSymbol = '♦' | '♣' | '♥' | '♠';
export type CardName = 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'ten' | 'jack' | 'queen' | 'king' | 'ace';
export type CardSymbol = | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type CardCost = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type PlayersAtCombinations = Partial<Record<COMBINATIONS, Player[]>>;

export interface Pot {
  name: string
  money: number
  playersEligible: Player[]
}
export interface CardType {
  suitName: SuitName
  suitSymbol: SuitSymbol
  cardName: CardName
  cardSymbol: CardSymbol
  isHidden: boolean
  cardCost: CardCost
  isFaded: boolean

  fade: () => any
  unfade: () => any
  hide: () => any
  show: () => any
}

export interface DeckType {
  cards: Card[]
  pickRandomCard: () => Card
}

export interface PlayerType {
  id: number
  name: string
  cards: Card[]
  bestCombinationCards: Card[]
  bestCombinationName: COMBINATIONS
  winAmount: number
  moneyLeft: number
  betToPayToContinue: number
  sumOfPersonalBetsInThisRound: number
  hasReacted: boolean
  isAllIn: boolean
  hasFolded: boolean
  canCheck: boolean
  canSupportBet: boolean
  canRaise: boolean

  fold: (store: Store) => void
  check: (store: Store) => void
  supportBet: (store: Store) => void
  raiseBet: (store: Store, bet: number) => void
  allIn: (store: Store) => void
  placeBet: (betAmount: number, store: Store, betAction: BET_ACTION) => void
  pickCard: (cardToTake: Card) => void
  showCards: (cardToTake: Card) => void
  hideCards: (cardToTake: Card) => void
}
