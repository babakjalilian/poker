import { makeAutoObservable } from "mobx";
import { BET_ACTION, COMBINATIONS } from "../Consts";
import Store from "../Store";
import { PlayerType } from "../types";
import { Card } from "./Card";
import { Players } from './Players';
import { getGameEventText } from "../utils";

export class Player implements PlayerType {
    id = 0;
    name = "";
    cards: Card[] = [];
    bestCombinationName = COMBINATIONS.HIGH_CARD;
    bestCombinationCards = [];
    sumOfPersonalBetsInThisRound = 0; // sum of money the player has bet in this round
    winAmount = 0;
    moneyLeft = 0;
    hasReacted = false;
    isAllIn = false;
    hasFolded = false;

    /* player controls enable state */
    get canCheck(): boolean {
        return this.sumOfPersonalBetsInThisRound === this.players.maxSumOfIndividualBets;
    }

    get canSupportBet(): boolean {
        return (this.sumOfPersonalBetsInThisRound + this.moneyLeft) >= this.players.maxSumOfIndividualBets;
    }

    get canRaise(): boolean {
        return (this.sumOfPersonalBetsInThisRound + this.moneyLeft) > this.players.maxSumOfIndividualBets;
    }

    // money left to bet to continue playing
    get betToPayToContinue(): number {
        return this.players.maxSumOfIndividualBets - this.sumOfPersonalBetsInThisRound;
    }

    constructor(name: string, id: number, moneyLeft: number, private players: Players) {
        this.id = id;
        this.name = name;
        this.moneyLeft = moneyLeft;
        this.sumOfPersonalBetsInThisRound = 0;
        this.hasReacted = false;
        this.isAllIn = false;
        this.hasFolded = false;

        makeAutoObservable(this);
    }

    fold(store: Store) {
        this.hasFolded = true;
        this.hasReacted = true;
        store.logGameEvent(`${this.name}: folds`);
        store.passMove();
    }

    check(store: Store) {
        this.hasReacted = true;
        store.logGameEvent(`${this.name}: checks`);
        store.passMove();
    }

    supportBet(store: Store) {
        this.hasReacted = true;
        const { betToPayToContinue } = this;
        this.placeBet(betToPayToContinue, store, BET_ACTION.SUPPORT);
    }

    raiseBet(store: Store, bet: number) {
        this.hasReacted = true;
        this.placeBet(bet, store, BET_ACTION.RAISE);
    }

    allIn(store: Store) {
        this.isAllIn = true;
        this.hasReacted = true;
        const { moneyLeft } = this;
        this.placeBet(moneyLeft, store, BET_ACTION.ALL_IN);
    }

    placeBet(betAmount: number, store: Store, betAction: BET_ACTION) {
        const { moneyLeft, name } = this;
        const canThePlayerBet = moneyLeft >= betAmount;
        if (!canThePlayerBet) {
            return alert(`Player "${name}" can not bet ${betAmount}! ${betAction} \n Place a proper bet!`);
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

    pickCard(cardToTake: Card) {
        cardToTake.isHidden = true;
        this.cards.push(cardToTake);
    }

    showCards() {
        this.cards.forEach(card => card.show());
    }

    hideCards() {
        this.cards.forEach(card => card.hide());
    }
}