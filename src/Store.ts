import { makeAutoObservable } from "mobx";
import { BET_ACTION, POKER_ROUNDS } from './Consts';
import { Card } from "./modules/Card";
import { Deck } from "./modules/Deck";
import { Player } from "./modules/Player";
import { Players } from "./modules/Players";
import { PageName, StoreType } from "./types";

class Store implements StoreType {
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
    constructor() {
        makeAutoObservable(this);
    }


    setPlayersCount(amountOfPlayers: number) {
        this.amountOfHumanPlayers = amountOfPlayers;
    }

    setMinimumBet(minimumBet: number) {
        this.minimumBet = minimumBet;
    }

    setInitialDeposit(initialDeposit: number) {
        this.initialDeposit = initialDeposit;
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
                this.showGameResults();
                break
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

    showGameResults() {
        this.players.showAllCards();
    }
}

const store = new Store();
export default store;
