import { makeAutoObservable } from "mobx";
import { cardCosts, COMBINATIONS, humanPlayerNames, suitNames, suitSymbols } from "../Consts";
import { CardCost, PlayersAtCombinations } from "../types";
import { getCardsInFlushIfThereIsAny, getCardsInStraightIfThereIsAny, getDescSortedArrayofCards } from "../utils";
import { Card } from "./Card";
import { Player } from "./Player";

export class Players {
    playerList: Player[]; // static list of players which entered the game (on game start we delete ones who cant participate)
    bigBlindPlayer: Player;
    smallBlindPlayer: Player;
    activePlayer: Player;
    winners: Player[] = [];

    // maxmimum amount of bets of one person in this round
    get maxSumOfIndividualBets(): number {
        return Math.max(...this.playerList.map(player => player.sumOfPersonalBetsInThisRound));
    }

    // everyone who has not folded since the start of the game
    get playersStillInThisRound(): Player[] {
        return this.playerList.filter(player => !player.hasFolded);
    }

    // everyone who has not folded and is not all in
    get playersLeftToReact(): Player[] {
        return this.playersStillInThisRound.filter(player => !player.isAllIn).filter(player => !player.hasReacted || player.hasReacted && player.sumOfPersonalBetsInThisRound < this.maxSumOfIndividualBets);
    }

    constructor(amountOfHumanPlayers: number, initialMoney: number) {
        const playerList = Array.from({ length: amountOfHumanPlayers }, (_, i) => {
            const playerName = humanPlayerNames[i];
            const id = i;
            return new Player(
                playerName,
                id,
                initialMoney,
                this
            );
        });
        this.playerList = playerList;
        this.smallBlindPlayer = playerList[0];
        this.bigBlindPlayer = playerList[1];
        this.activePlayer = this.smallBlindPlayer;
        this.winners = [];

        makeAutoObservable(this);
    }

    passBlinds() {
        const { smallBlindPlayer: prevSmallBlindPlayer, playerList: accessiblePlayers } = this;
        const prevSmallBlindPlayerIndex = accessiblePlayers.findIndex(player => player.id === prevSmallBlindPlayer.id);
        this.smallBlindPlayer = accessiblePlayers[prevSmallBlindPlayerIndex + 1] || accessiblePlayers[0];
        const smallBlindPlayerIndex = accessiblePlayers.findIndex(player => player.id === this.smallBlindPlayer.id);
        this.bigBlindPlayer = accessiblePlayers[smallBlindPlayerIndex + 1] || accessiblePlayers[0];
    }


    // updatePlayerAbilities(store: Store) {
    //     // TODO: this maybe could be removed
    //     // if everyone else folds, the last player wins
    //     if (this.playersStillInThisRound.length === 1) {
    //         console.log('🚀 ~ file: Players.ts ~ line 82 ~ Players ~ updatePlayerAbilities ~ this.playersStillInThisRound.length', this.playersStillInThisRound.length)
    //         return store.endGame();
    //     }
    // }

    getNextActivePlayer() {
        const { activePlayer, playersLeftToReact } = this;
        const consecutivePlayer = playersLeftToReact.find(({ id }) => id > activePlayer.id);
        const nextPlayer = consecutivePlayer ? consecutivePlayer : playersLeftToReact[0];
        return nextPlayer;
    }

    showAllCards() {
        this.playerList.filter(player => !player.hasFolded).forEach(player => player.showCards());
    }

    getWinnersOfRound(cardsOnTheDesk: Card[]) {
        const sidePots = this.calculateSidePots();
        sidePots.forEach(pot => {
            this.getWinnerOfPot(pot.money, cardsOnTheDesk, pot.playersEligible)
        })
        return this.winners.filter(player => player.winAmount > 0);
    }

    private calculateSidePots() {
        const players = [...this.playerList];
        let pots = [];
        let previousAllIn = 0
        players.sort((a, b) => a.sumOfPersonalBetsInThisRound - b.sumOfPersonalBetsInThisRound).forEach(p => {
            if (p.isAllIn) {
                let pot = { name: `${p.name}-allIn`, money: 0, playersEligible: [] }
                let allInMonyByPlayer = p.sumOfPersonalBetsInThisRound;
                if (allInMonyByPlayer > previousAllIn) {
                    players.forEach(player => {
                        let moneyToAdd: number = 0

                        if (player.sumOfPersonalBetsInThisRound > previousAllIn && player.sumOfPersonalBetsInThisRound <= allInMonyByPlayer) {
                            moneyToAdd = player.sumOfPersonalBetsInThisRound - previousAllIn
                        } else if (player.sumOfPersonalBetsInThisRound > allInMonyByPlayer) {
                            moneyToAdd = allInMonyByPlayer - previousAllIn;
                        }

                        pot.money += moneyToAdd;

                        if (!player.hasFolded && moneyToAdd > 0) {
                            pot.playersEligible.push(player);
                        }
                    })

                    pots.push(pot);
                    previousAllIn = allInMonyByPlayer;
                }
            }
        })

        let extraPot = { name: `extra-pot`, money: 0, playersEligible: [] }

        players.forEach(player => {
            if (player.sumOfPersonalBetsInThisRound > previousAllIn) {

                let extraMoney = player.sumOfPersonalBetsInThisRound - previousAllIn;
                extraPot.money += extraMoney;
                if (!player.hasFolded) {
                    extraPot.playersEligible.push(player);
                }
            }
        })

        if (extraPot.money > 0) {
            pots.push(extraPot);
        }

        return pots;

    }

    private getWinnerOfPot(potMoney: number, cardsOnTheDesk: Card[], playersEligibleInThisPot: Player[]) {
        // if there is only one player left, he is the winner
        if (playersEligibleInThisPot.length === 1) {
            const player = playersEligibleInThisPot[0];
            this.UpdateWinners(this.winners, player, potMoney);
            return;
        }

        // there is more than one player so check players for winner of the pot
        const playersAtCombination: PlayersAtCombinations = this.checkPlayersHandCombinations(playersEligibleInThisPot, [...cardsOnTheDesk])
        const combinations = [COMBINATIONS.ROYAL_FLUSH, COMBINATIONS.STRAIGHT_FLUSH, COMBINATIONS.FOUR_OF_KIND, COMBINATIONS.FULL_HOUSE, COMBINATIONS.FLUSH, COMBINATIONS.STRAIGHT, COMBINATIONS.THREE_OF_KIND, COMBINATIONS.TWO_PAIRS, COMBINATIONS.PAIR, COMBINATIONS.HIGH_CARD];
        for (const combinationName of combinations) {
            const playersWithThisCombination = playersAtCombination[combinationName];
            const amountOfPlayersWithThisCombination = playersWithThisCombination.length;

            if (amountOfPlayersWithThisCombination === 0) {
                continue;
            } else if (amountOfPlayersWithThisCombination === 1) {
                const player = playersWithThisCombination[0];
                this.UpdateWinners(this.winners, player, potMoney);
                return;
            } else {
                this.resolveTieInSameCombination(playersWithThisCombination, potMoney);
                return;
            }
        }
    }

    private checkPlayersHandCombinations(players: Player[], cardsOnDesk: Card[]): PlayersAtCombinations {
        const uniqueSuitSymbols = suitNames.map(suit => suitSymbols[suit]);
        let playersWithHigheCard: Player[] = [];
        let playersWithOnePair: Player[] = [];
        let playersWithTwoPairs: Player[] = [];
        let playersWithThreeOfKind: Player[] = [];
        let playersWithFourOfKind: Player[] = [];
        let playersWithFullHouse: Player[] = [];
        let playersWithRoyalFlush: Player[] = [];
        let playersWithStraightFlush: Player[] = [];
        let playersWithFlush: Player[] = [];
        let playersWithStraight: Player[] = [];
        players.forEach(player => {
            const cardsToCheckForCombinations = [...cardsOnDesk, ...player.cards].sort(getDescSortedArrayofCards);
            const cardCostsToCheckForCombinations = cardsToCheckForCombinations.map(({ cardCost }) => cardCost);

            const uniqueCardCosts = [...new Set(cardCostsToCheckForCombinations)];
            const cardsOfUniqueCardCosts = uniqueCardCosts.map(uniqueCardCost => cardsToCheckForCombinations.filter(({ cardCost }) => cardCost === uniqueCardCost));

            const cardsWithPairs = cardsOfUniqueCardCosts.filter(cardsWithMatchingCosts => cardsWithMatchingCosts.length === 2);

            const cardsWithThreeOfKinds = cardsOfUniqueCardCosts.filter((cardsWithMatchingCosts) => cardsWithMatchingCosts.length === 3);

            const cardsWithFourOfKinds = cardsOfUniqueCardCosts.filter((cardsWithMatchingCosts) => cardsWithMatchingCosts.length === 4)

            const cardsInStraight = getCardsInStraightIfThereIsAny(cardsToCheckForCombinations);

            const cardsWithFlush = getCardsInFlushIfThereIsAny({ cardsToCheck: cardsToCheckForCombinations, uniqueSuitSymbols });

            const cardsInStraightFlush = cardsWithFlush.length ? getCardsInStraightIfThereIsAny(cardsWithFlush) : [];

            // STRAIGHT_FLUSH AND ROYAL FLUSH
            if (cardsInStraightFlush.length) {
                if (cardsInStraightFlush[0].cardCost === cardCosts["ace"]) {
                    // ROYAL FLUSH
                    playersWithRoyalFlush.push(player);
                    const combinationCards = cardsInStraightFlush;
                    player.bestCombinationName = COMBINATIONS.ROYAL_FLUSH;
                    player.bestCombinationCards = combinationCards;
                } else {
                    // STRAIGHT_FLUSH
                    playersWithStraightFlush.push(player);
                    const combinationCards = cardsInStraightFlush;
                    player.bestCombinationName = COMBINATIONS.STRAIGHT_FLUSH;
                    player.bestCombinationCards = combinationCards;
                }
            } else if (cardsWithFourOfKinds.length > 0) {
                // FOUR_OF_KIND
                playersWithFourOfKind.push(player);
                const combinationCards = cardsWithFourOfKinds[0];
                const kickerCards = cardsToCheckForCombinations.filter(card => !combinationCards.includes(card)).slice(0, 1);
                player.bestCombinationName = COMBINATIONS.FOUR_OF_KIND;
                player.bestCombinationCards = [...combinationCards, ...kickerCards];
            } else if (cardsWithPairs.length > 0 && cardsWithThreeOfKinds.length === 1) {
                // FULL_HOUSE
                playersWithFullHouse.push(player);
                const combinationCards = [...cardsWithThreeOfKinds[0], ...cardsWithPairs[0]];
                player.bestCombinationName = COMBINATIONS.FULL_HOUSE;
                player.bestCombinationCards = combinationCards;
            } else if (cardsWithFlush.length) {
                // FLUSH
                playersWithFlush.push(player);
                const combinationCards = cardsWithFlush;
                player.bestCombinationName = COMBINATIONS.FLUSH;
                player.bestCombinationCards = combinationCards;
            } else if (cardsInStraight.length) {
                // STRAIGHT
                playersWithStraight.push(player);
                const combinationCards = cardsInStraight;
                player.bestCombinationName = COMBINATIONS.STRAIGHT;
                player.bestCombinationCards = combinationCards;
            } else if (cardsWithPairs.length === 0 && cardsWithThreeOfKinds.length === 1 && cardsWithFourOfKinds.length === 0) {
                // THREE_OF_KIND
                playersWithThreeOfKind.push(player);
                const combinationCards = cardsWithThreeOfKinds[0];
                const kickerCards = cardsToCheckForCombinations.filter(card => !combinationCards.includes(card)).slice(0, 2);
                player.bestCombinationName = COMBINATIONS.THREE_OF_KIND;
                player.bestCombinationCards = [...combinationCards, ...kickerCards];
            } else if (cardsWithPairs.length >= 2 && cardsWithThreeOfKinds.length === 0) {
                // TWO PAIRS
                playersWithTwoPairs.push(player);
                const biggerPair = cardsWithPairs[0][0] > cardsWithPairs[1][0] ? cardsWithPairs[0] : cardsWithPairs[1];
                const smallerPair = cardsWithPairs[0][0] > cardsWithPairs[1][0] ? cardsWithPairs[1] : cardsWithPairs[0];
                const combinationCards = [...biggerPair, ...smallerPair];
                const kickerCards = cardsToCheckForCombinations.filter(card => !combinationCards.includes(card)).slice(0, 1);
                player.bestCombinationName = COMBINATIONS.TWO_PAIRS;
                player.bestCombinationCards = [...combinationCards, ...kickerCards];
            } else if (cardsWithPairs.length === 1 && cardsWithThreeOfKinds.length === 0 && cardsWithFourOfKinds.length === 0) {
                // PAIR
                playersWithOnePair.push(player);
                const combinationCards = cardsWithPairs[0];
                const kickerCards = cardsToCheckForCombinations.filter(card => !combinationCards.includes(card)).slice(0, 3);
                player.bestCombinationName = COMBINATIONS.PAIR;
                player.bestCombinationCards = [...combinationCards, ...kickerCards];
            } else {
                // HIGH_CARD
                playersWithHigheCard.push(player);
                const kickerCards = cardsToCheckForCombinations.slice(0, 5);
                player.bestCombinationName = COMBINATIONS.HIGH_CARD;
                player.bestCombinationCards = [...kickerCards];
            }

        });

        const playersAtCombination: PlayersAtCombinations = {
            [COMBINATIONS.ROYAL_FLUSH]: playersWithRoyalFlush,
            [COMBINATIONS.STRAIGHT_FLUSH]: playersWithStraightFlush,
            [COMBINATIONS.FOUR_OF_KIND]: playersWithFourOfKind,
            [COMBINATIONS.FULL_HOUSE]: playersWithFullHouse,
            [COMBINATIONS.FLUSH]: playersWithFlush,
            [COMBINATIONS.STRAIGHT]: playersWithStraight,
            [COMBINATIONS.THREE_OF_KIND]: playersWithThreeOfKind,
            [COMBINATIONS.TWO_PAIRS]: playersWithTwoPairs,
            [COMBINATIONS.PAIR]: playersWithOnePair,
            [COMBINATIONS.HIGH_CARD]: playersWithHigheCard,
        };

        return playersAtCombination;
    }

    private resolveTieInSameCombination(playersWithSameCardCombination: Player[], potMoney: number) {
        // Checking combination and kicker cards for breaking tie
        for (let i = 0; i < 5; i++) {
            const highestTieBreakerCardCost: CardCost = Math.max(...playersWithSameCardCombination.map(player => player.bestCombinationCards[i].cardCost)) as CardCost;
            const players = playersWithSameCardCombination.filter(player => player.bestCombinationCards[i].cardCost === highestTieBreakerCardCost);
            if (players.length === 1) {
                this.UpdateWinners(this.winners, players[0], potMoney);
                return
            } else {
                playersWithSameCardCombination = [...players];
                continue;
            }
        }
        // there is still a tie so we split the pot
        if (playersWithSameCardCombination.length > 1) {
            this.splitPotBetweenPlayers(playersWithSameCardCombination, potMoney)
            return;
        }
    }

    private splitPotBetweenPlayers(players: Player[], moneyInPot: number) {
        const approxSumToWin = Math.floor(moneyInPot / players.length);
        for (const player of players) {
            this.UpdateWinners(this.winners, player, approxSumToWin);
        }
        return;
    }

    private UpdateWinners(winners: Player[], player: Player, winMoney: number) {
        const alreadyIsWinnerPlayerIndex = winners.findIndex(p => p.id === player.id)
        if (alreadyIsWinnerPlayerIndex > -1) {
            let winner = winners[alreadyIsWinnerPlayerIndex];
            winner.winAmount += winMoney;
            winners.splice(alreadyIsWinnerPlayerIndex, 1, winner);
        } else {
            player.winAmount = winMoney;
            winners.push(player)
        }
    }

}
