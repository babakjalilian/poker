import { makeAutoObservable } from "mobx";
import { BET_ACTION, COMBINATIONS, COMBINATION_NAMES_HUMAN, POKER_ROUNDS } from './Consts';
import { Card } from "./stores/Card";
import { Deck } from "./stores/Deck";
import { Player } from "./stores/Player";
import { Players } from "./stores/Players";
import { PageName } from "./types";

class Store {
    currentPage: PageName = "Menu";

    amountOfHumanPlayers: number = 3;
    players: Players;
    minimumBet = 10;
    initialDeposit = 100;
    sumOfBets = 0; // the sum to split between winners of the round
    deck: Partial<Deck> = {}; // array of cards to pick from
    cardsOnTheDesk: Card[] = [];
    winners: Player[];
    gameInfo: string[];
    isGameActive = false; // game state, set false on end and true on start
    activeRound: POKER_ROUNDS;
    isRoundFinished: boolean = false;
    gameLog = [];

    get blinds() {
        return {
            smallBlind: this.minimumBet,
            bigBlind: this.minimumBet * 2,
        }
    }

    get allPlayerCards() {
        return this.players.playerList.map(player => player.cards).flat();
    }

    get allCards() {
        const cardsOnTheDesk = this.cardsOnTheDesk;
        return [...this.allPlayerCards, ...cardsOnTheDesk];
    }

    get mustGameBeRestarted() {
        const playersWhoCanContinuePlaying = this.players.playerList.filter(player => player.moneyLeft >= this.blinds.bigBlind);
        return playersWhoCanContinuePlaying.length === 1;
    }

    constructor() {
        makeAutoObservable(this);
    }

    startInitialGame() {
        this.players = new Players(this.amountOfHumanPlayers, this.initialDeposit);
        this.deck = new Deck();
        this.cardsOnTheDesk = [];
        this.isGameActive = true;
        this.winners = [];
        this.gameInfo = [];
        this.gameLog = [];
        this.sumOfBets = 0;
        this.isRoundFinished = false;
        this.logGameEvent("<<<< GAME START >>>>");
        this.startRound_BlindCall()
    }

    continueGame() {
        this.performContinuingGameReset();
        this.logGameEvent("<<<< GAME START >>>>");
        this.startRound_BlindCall();
    }

    performContinuingGameReset() {
        const { playerList } = this.players;
        playerList.forEach(player => {
            player.cards = [];
            player.bestCombinationName = COMBINATIONS.HIGH_CARD;
            player.bestCombinationCards = [];
            player.winAmount = 0;
            player.sumOfPersonalBetsInThisRound = 0;
            player.hasReacted = false;
            player.isAllIn = false;
            player.hasFolded = false;
        });

        const playersWhoCanContinuePlaying = playerList.filter(player => player.moneyLeft >= this.blinds.bigBlind);
        this.players.playerList = playersWhoCanContinuePlaying;
        this.deck = new Deck();
        this.cardsOnTheDesk = [];
        this.isGameActive = true;
        this.winners = [];
        this.players.winners = [];
        this.gameInfo = [];
        this.sumOfBets = 0;
        this.isRoundFinished = false;

        this.players.passBlinds();
    }

    startRound_BlindCall() {
        this.activeRound = POKER_ROUNDS.BLIND_CALL;
        this.logGameEvent("<<< BLIND CALL >>>");
        /* big and small blinds */
        const { smallBlind, bigBlind } = this.blinds;
        const { smallBlindPlayer, bigBlindPlayer } = this.players;
        smallBlindPlayer.placeBet(smallBlind, this, BET_ACTION.SMALL_BLIND);
        bigBlindPlayer.placeBet(bigBlind, this, BET_ACTION.BIG_BLIND);

        /* give cards to players */
        const playerList = this.players.playerList;
        for (const player of playerList) {
            for (let i = 0; i <= 1; i++) {
                const randomCard = this.deck.pickRandomCard();
                player.pickCard(randomCard);
            }
        }

        this.players.activePlayer = this.players.bigBlindPlayer;
        this.players.activePlayer = this.players.getNextActivePlayer();
    }

    startNextRound(): any {
        /* cleanup before the round */
        if (this.players.playersStillInThisRound.filter(player => !player.isAllIn).length > 1) {
            this.players.playersStillInThisRound.forEach(player => {
                player.hasReacted = false;
            });
        }

        const { activeRound } = this;

        switch (activeRound) {
            case POKER_ROUNDS.BLIND_CALL: {
                this.activeRound = POKER_ROUNDS.FLOP;
                for (let i = 0; i <= 2; i++) {
                    const randomCard = this.deck.pickRandomCard();
                    this.cardsOnTheDesk.push(randomCard);
                }
                this.logGameEvent("<<< FLOP >>>");
                break;
            }
            case POKER_ROUNDS.FLOP: {
                this.activeRound = POKER_ROUNDS.TURN;
                this.logGameEvent("<<< TURN >>>");
                const randomCard = this.deck.pickRandomCard();
                this.cardsOnTheDesk.push(randomCard);
                break;
            }
            case POKER_ROUNDS.TURN: {
                this.activeRound = POKER_ROUNDS.RIVER;
                this.logGameEvent("<<< RIVER >>>");
                const randomCard = this.deck.pickRandomCard();
                this.cardsOnTheDesk.push(randomCard);
                break;
            }
            case POKER_ROUNDS.RIVER: {
                this.endGame();
                break;
            }
            default: {
                console.error("Unhandled activeRound: ", activeRound);
                break;
            }
        }

        if (activeRound !== POKER_ROUNDS.RIVER) {
            if (this.players.playersStillInThisRound.filter(player => !player.isAllIn).length <= 1) {
                return this.startNextRound();
            }

            let nextActivePlayer = this.players.smallBlindPlayer;
            if (this.players.playerList.length === 2) {
                nextActivePlayer = this.players.bigBlindPlayer;
            }
            this.players.activePlayer = nextActivePlayer;
            if (nextActivePlayer.isAllIn || nextActivePlayer.hasFolded) {
                nextActivePlayer = this.players.getNextActivePlayer();
                this.players.activePlayer = nextActivePlayer;
            }
        }
    }

    passMove() {
        const isEveryoneAllInOrFold = this.players.playerList.every(player => player.isAllIn || player.hasFolded);
        if (isEveryoneAllInOrFold) {
            this.players.showAllCards();
            return this.startNextRound();
        }

        if (this.players.playersStillInThisRound.length === 1) {
            return this.endGame();
        }

        const areThereAnyPlayersToReact = this.players.playersLeftToReact.length > 0;
        if (!areThereAnyPlayersToReact) {
            this.startNextRound();
            return;
        }

        this.players.activePlayer = this.players.getNextActivePlayer();
    }

    endGame() {
        this.isGameActive = false;
        this.isRoundFinished = true;
        this.showGameResults();
        this.payWinners();
        if (this.mustGameBeRestarted) {
            this.gameInfo.push(`Game is over and ${this.winners[0].name} won the game.`);
        }
    }

    showGameResults() {
        this.players.showAllCards();
        this.fadeAllCards();
        this.winners = this.players.getWinnersOfRound(this.cardsOnTheDesk);
        this.logWinners();

        for (const winner of this.winners) {
            winner.bestCombinationCards.forEach(card => card.isFaded = false);
        }
    }

    payWinners() {
        this.winners.forEach(winner => {
            winner.moneyLeft += winner.winAmount;
            winner.winAmount = 0;
        });
    }

    logWinners() {
        this.winners.forEach(winner => {
            const { name, winAmount, bestCombinationName } = winner;
            const message = `${name} wins ${winAmount}€ [${COMBINATION_NAMES_HUMAN[bestCombinationName]}]`;
            this.logGameEvent(message);
            this.gameInfo.push(message);
        });
    }

    logGameEvent(event: string) {
        const date = new Date();
        const eventTime = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
        const gameEvent = `${eventTime}: ${event}`;
        this.gameLog.push(gameEvent);
        const logBody = document.getElementById('gameLog');
        logBody?.lastElementChild.scrollIntoView();
    }

    setCurrentPage(pageToShow: PageName) {
        this.currentPage = pageToShow;
    }

    setInitialDeposit(initialDeposit: number) {
        this.initialDeposit = initialDeposit;
    }

    setMinimumBet(minimumBet: number) {
        this.minimumBet = minimumBet;
    }

    setPlayersCount(amountOfPlayers: number) {
        this.amountOfHumanPlayers = amountOfPlayers;
    }

    fadeAllCards() {
        this.allCards.forEach(card => card.fade());
    }

    unfadeAllCards() {
        this.allCards.forEach(card => card.unfade());
    }
}

export default Store;
