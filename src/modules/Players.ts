import { makeAutoObservable } from "mobx";
import { cardCosts, COMBINATIONS, humanPlayerNames, suitNames, suitSymbols } from "../Consts";
import Store from "../Store";
import { CardCost, PlayersAtCombinations } from "../types";
import { getCardsInFlushIfThereIsAny, getCardsInStraightIfThereIsAny, getDescSortedArrayofCards } from "../utils";
import { Card } from "./Card";
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

    passBlinds() {
        const { bigBlindPlayer: prevBigBlindPlayer, playerList: accessiblePlayers } = this;
        const prevBigBlindPlayerIndex = accessiblePlayers.findIndex(player => player.id === prevBigBlindPlayer.id);
        this.bigBlindPlayer = accessiblePlayers[prevBigBlindPlayerIndex + 1] || accessiblePlayers[0];
        const bigBlindPlayerIndex = accessiblePlayers.findIndex(player => player.id === this.bigBlindPlayer.id);
        this.smallBlindPlayer = accessiblePlayers[bigBlindPlayerIndex + 1] || accessiblePlayers[0];
    }

    passMove(store: Store) {
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

    updatePlayerAbilities(store: Store) {
        // player can't continue playing in this round if: hasFolded
        this.playersStillInThisRound = this.playerList.filter(player => !player.hasFolded);
        // if everyone else folds, the last player wins
        if (this.playersStillInThisRound.length === 1) {
            return store.endGame();
        }

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

    getWinnersOfRound(store: Store) {
        const sidePots = this.calculateSidePots();
        if (sidePots.length) {
            sidePots.forEach(pot => {
                let potMoney = pot.money;
                let players = pot.playersEligible.map(player => {
                    return player.name
                })
                this.getWinnerOfPot(pot.money, store, pot.playersEligible)
            })
        }
    }

    private calculateSidePots() {
        const { playerList } = this;
        let pots = [];
        let previousAllIn = 0
        playerList.sort((a, b) => a.sumOfPersonalBetsInThisRound - b.sumOfPersonalBetsInThisRound).forEach(p => {
            if (p.isAllIn) {
                let pot = { name: `${p.name}-allIn`, money: 0, playersEligible: [] }
                let allInMonyByPlayer = p.sumOfPersonalBetsInThisRound;
                if (allInMonyByPlayer > previousAllIn) {
                    playerList.forEach(player => {
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

        playerList.forEach(player => {
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

    private getWinnerOfPot(potMoney: number, store: Store, playersEligibleInThisPot: Player[]) {
        // if there is only one player left, he is the winner
        if (playersEligibleInThisPot.length === 1) {
            const player = playersEligibleInThisPot[0];
            this.UpdateWinnersInStore(player, potMoney, store);
            return;
        }

        // there is more than one player so check players for winner of the pot
        const playersAtCombination: PlayersAtCombinations = this.checkPlayersHandCombinations(playersEligibleInThisPot, [...store.cardsOnTheDesk])
        const combinations = [COMBINATIONS.ROYAL_FLUSH, COMBINATIONS.STRAIGHT_FLUSH, COMBINATIONS.FOUR_OF_KIND, COMBINATIONS.FULL_HOUSE, COMBINATIONS.FLUSH, COMBINATIONS.STRAIGHT, COMBINATIONS.THREE_OF_KIND, COMBINATIONS.TWO_PAIRS, COMBINATIONS.PAIR, COMBINATIONS.HIGH_CARD];
        for (const combinationName of combinations) {
            const playersWithThisCombination = playersAtCombination[combinationName];
            const amountOfPlayersWithThisCombination = playersWithThisCombination.length;

            if (amountOfPlayersWithThisCombination === 0) {
                continue;
            } else if (amountOfPlayersWithThisCombination === 1) {
                const player = playersWithThisCombination[0];
                this.UpdateWinnersInStore(player, potMoney, store);
                return;
            } else {
                this.resolveTieInSameCombination(playersWithThisCombination, potMoney, store);
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

    private resolveTieInSameCombination(playersWithSameCardCombination: Player[], potMoney: number, store: Store) {
        // Checking combination and kicker cards for breaking tie
        for (let i = 0; i < 5; i++) {
            const highestTieBreakerCardCost: CardCost = Math.max(...playersWithSameCardCombination.map(player => player.bestCombinationCards[i].cardCost)) as CardCost;
            const players = playersWithSameCardCombination.filter(player => player.bestCombinationCards[i].cardCost === highestTieBreakerCardCost);
            if (players.length === 1) {
                this.UpdateWinnersInStore(players[0], potMoney, store);
                return
            } else {
                playersWithSameCardCombination = [...players];
                continue;
            }
        }
        // there is still a tie so we split the pot
        if (playersWithSameCardCombination.length > 1) {
            this.splitPotBetweenPlayers(playersWithSameCardCombination, potMoney, store)
            return;
        }
    }

    private splitPotBetweenPlayers(players: Player[], moneyInPot: number, store: Store) {
        const approxSumToWin = Math.floor(moneyInPot / players.length);
        for (const player of players) {
            this.UpdateWinnersInStore(player, approxSumToWin, store);
        }
        return;
    }

    private UpdateWinnersInStore(player: Player, winMoney: number, store: Store) {
        const alreadyIsWinnerPlayerIndex = store.winners.findIndex(p => p.id === player.id)
        if (alreadyIsWinnerPlayerIndex > -1) {
            let winner = store.winners[alreadyIsWinnerPlayerIndex];
            winner.winAmount += winMoney;
            store.winners.splice(alreadyIsWinnerPlayerIndex, 1, winner);
        } else {
            player.winAmount = winMoney;
            store.winners.push(player)
        }
    }



}
