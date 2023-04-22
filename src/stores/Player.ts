import { makeAutoObservable } from 'mobx';
import { BET_ACTION, COMBINATIONS } from '../Consts';
import { type PlayerType } from '../types';
import { getGameEventText } from '../utils';
import type Card from './Card';
import { type Players } from './Players';
import type Store from './Store';

export class Player implements PlayerType {
  id = 0;
  name = '';
  cards: Card[] = [];
  bestCombinationName = COMBINATIONS.HIGH_CARD;
  bestCombinationCards: Card[] = [];
  sumOfPersonalBetsInThisRound = 0; // sum of money the player has bet in this round
  winAmount = 0;
  moneyLeft = 0;
  hasReacted = false;
  isAllIn = false;
  hasFolded = false;

  /* player controls enable state */
  get canCheck (): boolean {
    return this.sumOfPersonalBetsInThisRound === this.players.maxSumOfIndividualBets;
  }

  get canSupportBet (): boolean {
    return (this.sumOfPersonalBetsInThisRound + this.moneyLeft) >= this.players.maxSumOfIndividualBets;
  }

  get canRaise (): boolean {
    return (this.sumOfPersonalBetsInThisRound + this.moneyLeft) > this.players.maxSumOfIndividualBets;
  }

  // money left to bet to continue playing
  get betToPayToContinue (): number {
    return this.players.maxSumOfIndividualBets - this.sumOfPersonalBetsInThisRound;
  }

  constructor (name: string, id: number, moneyLeft: number, private readonly players: Players) {
    this.id = id;
    this.name = name;
    this.moneyLeft = moneyLeft;
    this.sumOfPersonalBetsInThisRound = 0;
    this.hasReacted = false;
    this.isAllIn = false;
    this.hasFolded = false;

    makeAutoObservable(this);
  }

  fold (store: Store): void {
    this.hasFolded = true;
    this.hasReacted = true;
    store.logGameEvent(`${this.name}: folds`);
    store.passMove();
  }

  check (store: Store): void {
    this.hasReacted = true;
    store.logGameEvent(`${this.name}: checks`);
    store.passMove();
  }

  supportBet (store: Store): void {
    this.hasReacted = true;
    const { betToPayToContinue } = this;
    this.placeBet(betToPayToContinue, store, BET_ACTION.SUPPORT);
  }

  raiseBet (store: Store, bet: number): void {
    this.hasReacted = true;
    this.placeBet(bet, store, BET_ACTION.RAISE);
  }

  allIn (store: Store): void {
    this.isAllIn = true;
    this.hasReacted = true;
    const { moneyLeft } = this;
    this.placeBet(moneyLeft, store, BET_ACTION.ALL_IN);
  }

  placeBet (betAmount: number, store: Store, betAction: BET_ACTION): void {
    const { moneyLeft, name } = this;
    const canThePlayerBet = moneyLeft >= betAmount;
    if (!canThePlayerBet) {
      alert(`Player "${name}" can not bet ${betAmount}! ${betAction} \n Place a proper bet!`); return;
    }

    this.moneyLeft -= betAmount;
    this.sumOfPersonalBetsInThisRound += betAmount;
    store.sumOfBets += betAmount;

    if (this.moneyLeft === 0) {
      this.isAllIn = true;
    }

    const gameEventText = getGameEventText(name, betAmount, betAction);
    store.logGameEvent(gameEventText);

    store.passMove();
  }

  pickCard (cardToTake: Card): void {
    cardToTake.isHidden = true;
    this.cards.push(cardToTake);
  }

  showCards (): void {
    this.cards.forEach(card => { card.show(); });
  }

  hideCards (): void {
    this.cards.forEach(card => { card.hide(); });
  }
}
