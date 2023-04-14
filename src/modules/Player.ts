import { makeAutoObservable } from "mobx";
import { BET_ACTION, COMBINATIONS } from "../Consts";
import Store from "../Store";
import { PlayerType } from "../types";
import { Card } from "./Card";

export class Player implements PlayerType {
    id = 0;
    name = "";
    cards: Card[] = [];
    bestCombinationName = COMBINATIONS.HIGH_CARD;
    bestCombinationCards = [];
    betToPayToContinue = 0; // money left to bet to continue playing
    sumOfPersonalBetsInThisRound = 0; // sum of money the player has bet in this round
    winAmount = 0;
    moneyLeft = 0;
    hasReacted = false;
    isAllIn = false;
    hasFolded = false;
    /* player controls enable state */
    canCheck = false;
    canSupportBet = false;
    canRaise = false;

    constructor(name: string, id: number, moneyLeft: number) {
        this.id = id;
        this.name = name;
        this.moneyLeft = moneyLeft;
        this.betToPayToContinue = 0;
        this.sumOfPersonalBetsInThisRound = 0;
        this.hasReacted = false;
        this.isAllIn = false;
        this.hasFolded = false;
        this.canCheck = false;
        this.canSupportBet = false;
        this.canRaise = false;

        makeAutoObservable(this);
    }

    fold(store: Store) {
        this.hasFolded = true;
        store.players.passMove(store);
    }

    check(store: Store) {
        this.hasReacted = true;
        store.players.passMove(store);
    }

    supportBet(store: Store) {
        this.hasReacted = true;
        const { betToPayToContinue } = this;
        this.placeBet(betToPayToContinue, store, BET_ACTION.SUPPORT);
    }

    raiseBet(store: Store, bet: number) {
        store.players.playersLeftToReact.filter(player => player !== this && !player.isAllIn && player.moneyLeft > 0).forEach(player => {
            // everyone still playing has to react to the bet raise
            player.hasReacted = false;
        });
        this.placeBet(bet, store, BET_ACTION.RAISE);
    }

    allIn(store: Store) {
        const { moneyLeft } = this;
        store.players.playersStillInThisRound.filter(player => player !== this && !player.isAllIn && player.moneyLeft > 0).forEach(player => {
            // everyone still playing has to react to the bet raise
            player.hasReacted = false;
        });
        this.isAllIn = true;
        this.hasReacted = true;
        this.placeBet(moneyLeft, store, BET_ACTION.ALL_IN);
    }

    placeBet(betAmount: number, store: Store, betAction: BET_ACTION) {
        const { moneyLeft, name } = this;
        const canThePlayerBet = moneyLeft >= betAmount;
        if (!canThePlayerBet) {
            return alert(`Player "${name}" can not bet ${betAmount}! ${betAction} \n Place a proper bet!`);
        }

        if (![BET_ACTION.SMALL_BLIND, BET_ACTION.BIG_BLIND].includes(betAction)) {
            this.hasReacted = true;
        }
        this.moneyLeft -= betAmount;
        this.sumOfPersonalBetsInThisRound += betAmount;
        store.sumOfBets += betAmount;
        if (this.sumOfPersonalBetsInThisRound > store.maxSumOfIndividualBets) {
            store.maxSumOfIndividualBets = this.sumOfPersonalBetsInThisRound;
        }

        if (this.moneyLeft === 0) {
            this.isAllIn = true;
        }

        store.players.passMove(store);

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