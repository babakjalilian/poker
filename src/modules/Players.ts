import { makeAutoObservable } from "mobx";
import { humanPlayerNames } from "../Consts";
import { StoreType } from "../types";
import { Player } from "./Player";

export class Players {
    playerList: Player[]; // static list of players which entered the game (on game start we delete ones who cant participate)
    playersStillInThisRound: Player[]; // everyone who has not folded since the start of the game
    playersLeftToReact: Player[]; // everyone who has not folded and is not all in

    bigBlindPlayer: Player;
    smallBlindPlayer: Player;
    activePlayer: Player;

    constructor(amountOfHumanPlayers: number, initialMoney: number) {
        const playerList = Array.from({ length: amountOfHumanPlayers }, (_, i) => {
            const playerName = humanPlayerNames[i];
            const id = i;
            return new Player(
                playerName,
                id,
                initialMoney
            );
        });
        this.playerList = playerList;
        this.playersStillInThisRound = playerList;
        this.playersLeftToReact = playerList;

        this.bigBlindPlayer = playerList[0];
        this.smallBlindPlayer = playerList[1];
        this.activePlayer = this.smallBlindPlayer;

        makeAutoObservable(this);
    }

    passMove(store: StoreType) {
        const isEveryoneAllInOrFold = this.playerList.every(player => player.isAllIn || player.hasFolded);
        store.isEveryoneAllInOrFold = isEveryoneAllInOrFold;
        if (isEveryoneAllInOrFold) {
            this.showAllCards();
            return store.startNextRound();
        }

        this.updatePlayerAbilities(store);

        const areThereAnyPlayersToReact = this.playersLeftToReact.length > 0;
        if (!areThereAnyPlayersToReact) {
            store.startNextRound();
            return;
        }

        this.activePlayer = this.getNextActivePlayer();
    }

    updatePlayerAbilities(store: StoreType) {
        // player can't continue playing in this round if: hasFolded
        this.playersStillInThisRound = this.playerList.filter(player => !player.hasFolded);
        // if everyone else folds, the last player wins

        // player can react to the bet if: !isAllIn && !hasFolded
        this.playersLeftToReact = this.playersStillInThisRound.filter(player => !player.isAllIn).filter(player => !player.hasReacted || player.hasReacted && player.sumOfPersonalBetsInThisRound < store.maxSumOfIndividualBets);
        this.playersLeftToReact.forEach(player => {
            player.hasReacted = false;
            player.canCheck = player.sumOfPersonalBetsInThisRound === store.maxSumOfIndividualBets;
            player.canSupportBet = (player.sumOfPersonalBetsInThisRound + player.moneyLeft) >= store.maxSumOfIndividualBets;
            player.canRaise = (player.sumOfPersonalBetsInThisRound + player.moneyLeft) > store.maxSumOfIndividualBets;
            player.betToPayToContinue = store.maxSumOfIndividualBets - player.sumOfPersonalBetsInThisRound;
        });
    }

    getNextActivePlayer() {
        const { activePlayer, playersLeftToReact } = this;
        const consecutivePlayer = playersLeftToReact.find(({ id }) => id > activePlayer.id);
        const nextPlayer = consecutivePlayer ? consecutivePlayer : playersLeftToReact[0];
        return nextPlayer;
    }

    showAllCards() {
        this.playerList.filter(player => !player.hasFolded).forEach(player => player.showCards());
    }



}
