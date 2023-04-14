import { makeAutoObservable } from "mobx";
import { BET_ACTION, COMBINATIONS, POKER_ROUNDS } from './Consts';
import { Card } from "./modules/Card";
import { Deck } from "./modules/Deck";
import { Player } from "./modules/Player";
import { Players } from "./modules/Players";
import { PageName } from "./types";

class Store {
    currentPage: PageName = "Menu";

    amountOfHumanPlayers: number = 3;
    players: Players;
    minimumBet = 10;
    initialDeposit = 100;
    maxSumOfIndividualBets = 0; // maxmimum amount of bets of one person in this round
    sumOfBets = 0; // the sum to split between winners of the round
    isEveryoneAllInOrFold = true;
    deck: Partial<Deck> = {}; // array of cards to pick from
    cardsOnTheDesk: Card[] = [];
    winners: Player[];
    gameInfo: string[];
    isGameActive = false; // game state, set false on end and true on start
    activeRound: POKER_ROUNDS;

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
        console.log("game started");
        this.players = new Players(this.amountOfHumanPlayers, this.initialDeposit);
        this.isEveryoneAllInOrFold = false;
        this.deck = new Deck();
        this.cardsOnTheDesk = [];
        this.isGameActive = true;
        this.winners = [];
        this.gameInfo = [];
        this.maxSumOfIndividualBets = 0;
        this.sumOfBets = 0;

        this.startRound_BlindCall()
    }

    continueGame() {
        this.performContinuingGameReset();
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
            player.betToPayToContinue = 0;
            player.hasReacted = false;
            player.isAllIn = false;
            player.hasFolded = false;
            player.canCheck = false;
            player.canSupportBet = false;
            player.canRaise = false;
        });

        const playersWhoCanContinuePlaying = playerList.filter(player => player.moneyLeft >= this.blinds.bigBlind);

        this.players.playerList = playersWhoCanContinuePlaying;
        this.isEveryoneAllInOrFold = false;

        this.deck = new Deck();
        this.cardsOnTheDesk = [];

        this.isGameActive = true;
        this.winners = [];
        this.gameInfo = [];

        this.maxSumOfIndividualBets = 0;
        this.sumOfBets = 0;

        this.players.passBlinds();
    }

    startRound_BlindCall() {
        this.activeRound = POKER_ROUNDS.BLIND_CALL;
        /* big and small blinds */
        const { smallBlind, bigBlind } = this.blinds;
        const { smallBlindPlayer, bigBlindPlayer } = this.players;
        bigBlindPlayer.placeBet(bigBlind, this, BET_ACTION.BIG_BLIND);
        smallBlindPlayer.placeBet(smallBlind, this, BET_ACTION.SMALL_BLIND);

        /* give cards to players */
        const playerList = this.players.playerList;
        for (const player of playerList) {
            for (let i = 0; i <= 1; i++) {
                const randomCard = this.deck.pickRandomCard();
                player.pickCard(randomCard);
            }
        }

        /* players decide whether to continue playing with these cards or fold (starting from the small blind player) */
        this.players.updatePlayerAbilities(this);
        this.players.activePlayer = this.players.smallBlindPlayer;
    }

    startNextRound(): any {
        /* cleanup before the round */
        if (!this.isEveryoneAllInOrFold) {
            this.players.playersStillInThisRound.forEach(player => {
                player.canCheck = true;
                player.canSupportBet = true;
                player.canRaise = true;
                player.hasReacted = false;
            });
        }

        const { activeRound } = this;

        switch (activeRound) {
            case POKER_ROUNDS.BLIND_CALL: {
                this.activeRound = POKER_ROUNDS.FLOP;
                for (let i = 0; i <= 2; i++) {
                    setTimeout(() => {
                        const randomCard = this.deck.pickRandomCard();
                        this.cardsOnTheDesk.push(randomCard);
                    }, i * 500);
                }
                break;
            }
            case POKER_ROUNDS.FLOP: {
                this.activeRound = POKER_ROUNDS.TURN;
                const randomCard = this.deck.pickRandomCard();
                this.cardsOnTheDesk.push(randomCard);
                break;
            }
            case POKER_ROUNDS.TURN: {
                this.activeRound = POKER_ROUNDS.RIVER;
                const randomCard = this.deck.pickRandomCard();
                this.cardsOnTheDesk.push(randomCard);
                break;
            }
            case POKER_ROUNDS.RIVER: {
                this.isGameActive = false;
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

            this.players.updatePlayerAbilities(this);
            const nextActivePlayer = this.players.getNextActivePlayer();
            this.players.activePlayer = nextActivePlayer;
        }

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

    endGame() {
        this.showGameResults();
        setTimeout(() => {
            this.unfadeAllCards();
            this.payWinners();

            if (this.mustGameBeRestarted) {
                this.gameInfo.push(`Game over. Automatic restart incoming.`);
                this.cardsOnTheDesk = [];
                return setTimeout(() => {
                    return this.startInitialGame();
                }, 3000);
            }

            return this.continueGame();

        }, 5000)

    }

    showGameResults() {
        this.players.showAllCards();
        this.players.getWinnersOfRound(this);

        this.winners = this.winners.filter(player => player.winAmount);
        const { winners } = this;

        for (const winner of winners) {
            this.fadeAllCards();
            winner.bestCombinationCards.forEach(card => card.isFaded = false);
            break;
        }
    }

    payWinners() {
        this.winners.forEach(winner => {
            winner.moneyLeft += winner.winAmount;
            winner.winAmount = 0;
        });
    }

    fadeAllCards() {
        this.allCards.forEach(card => card.fade());
    }

    unfadeAllCards() {
        this.allCards.forEach(card => card.unfade());
    }
}

export default Store;
