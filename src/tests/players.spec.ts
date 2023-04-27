import { COMBINATIONS } from '../Consts';
import Card from '../stores/Card';
import { Players } from '../stores/Players';
import type Store from '../stores/Store';

describe('players', () => {
  describe('player initialisation', () => {
    it('should create a player', () => {
      const initialMoney = 100;
      const players = new Players(1, 100);
      expect(players.playerList).toEqual([
        {
          ...players.playerList[0],
          name: 'player-1',
          id: 0,
          moneyLeft: initialMoney,
          cards: []
        }]);
    });
  });

  describe('combinations', () => {
    describe('high card', () => {
      it('player with high card wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'six'),
          new Card('spades', 'queen')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.HIGH_CARD,
            winAmount: 300
          }
        ]);
      });
    });

    describe('pair', () => {
      it('2 players have the different pair - one player with highest pair wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'jack'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'ace'),
          new Card('hearts', 'six')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the different pair - two players win, because the one with highest card pair is all in', () => {
        console.warn('tests incoming!');
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'ace'),
          new Card('spades', 'six')
        ];
        player1.isAllIn = true;
        player1.sumOfPersonalBetsInThisRound = 150;
        // player1.sumToWinIfPlayerGoesAllIn = sumToWinIfPlayerGoesAllIn_1;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'jack'),
          new Card('hearts', 'six')
        ];

        player2.sumOfPersonalBetsInThisRound = 200;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 300
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 50
          }
        ]);
      });

      it('2 players have the same pair - one player with highest card wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'eight'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'eight'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'six')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 450
          }
        ]);
      });
      it('2 players have the same pair and same kicker cards - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'king'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'seven'),
          new Card('spades', 'seven')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'seven'),
          new Card('clubs', 'seven')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 225
          },
          {
            ...winners[1],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 225
          }
        ]);
      });
      it('2 players have the same pair and same kicker cards - both players win, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'king'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'seven'),
          new Card('spades', 'seven')
        ];
        player1.isAllIn = true;
        player1.sumOfPersonalBetsInThisRound = 100;
        // player1.sumToWinIfPlayerGoesAllIn = sumToWinIfPlayerGoesAllIn_1;

        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 200;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'seven'),
          new Card('clubs', 'seven')
        ];

        player3.sumOfPersonalBetsInThisRound = 200;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.PAIR,
            winAmount: 350
          }
        ]);
      });
    });

    describe('two pairs', () => {
      it('2 players have different two pairs - one player with highest big pair wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'three'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'nine'),
          new Card('hearts', 'jack')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'seven'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 450
          }
        ]);
      });
      it('2 players have different two pairs but same big pair - one player with highest small pair wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'three'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'seven'),
          new Card('hearts', 'jack')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'three'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 450
          }
        ]);
      });
      it('2 players have the same two pairs - one player with highest kicker card wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'three'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'seven'),
          new Card('hearts', 'jack')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'seven'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 450
          }
        ]);
      });
      it('2 players have the same two pairs and same kicker card - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'seven'),
          new Card('hearts', 'queen')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'seven'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 225
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 225
          }
        ]);
      });

      it('2 players have the same two pairs and same kicker card - both players win, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'seven'),
          new Card('hearts', 'jack')
        ];
        player1.sumOfPersonalBetsInThisRound = 100;
        player1.isAllIn = true;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'seven'),
          new Card('spades', 'jack')
        ];
        player2.sumOfPersonalBetsInThisRound = 200;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 200;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.TWO_PAIRS,
            winAmount: 350
          }
        ]);
      });
    });

    describe('three of kind', () => {
      it('1 player wins with three of kind', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'seven'),
          new Card('hearts', 'jack')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'eight'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 450
          }
        ]);
      });

      it('2 players have different three of kinds - the one with the highest three of kinds wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'nine'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'king'),
            new Card('hearts', 'queen')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'eight'),
          new Card('diamonds', 'eight')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'ace'),
          new Card('hearts', 'ace')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the same three of kind - player with highest kicker cards wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'eight'),
          new Card('hearts', 'queen')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'eight'),
          new Card('hearts', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the same three of kind and the same kicker cards - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'eight'),
          new Card('hearts', 'queen')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'eight'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 225
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 225
          }
        ]);
      });
      it('2 players have the same three of kind and the same kicker cards - both players win, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'eight'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'eight'),
          new Card('hearts', 'queen')
        ];
        player1.sumOfPersonalBetsInThisRound = 100;
        player1.isAllIn = true;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'eight'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'king')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.THREE_OF_KIND,
            winAmount: 250
          }
        ]);
      });
    });

    describe('straight', () => {
      it('one straight - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'jack'),
            new Card('clubs', 'eight'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'ace'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ten'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'six'),
          new Card('clubs', 'six')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 450
          }
        ]);
      });

      it('one baby straight - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'two'),
            new Card('clubs', 'three'),
            new Card('clubs', 'four'),
            new Card('hearts', 'five'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'king'),
          new Card('spades', 'seven')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ace'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'seven'),
          new Card('clubs', 'seven')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 450
          }
        ]);
      });

      it('one straight and one baby straight - player with straight wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'two'),
            new Card('clubs', 'three'),
            new Card('clubs', 'four'),
            new Card('hearts', 'five'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'king'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ace'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('diamonds', 'seven'),
          new Card('clubs', 'seven')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 450
          }
        ]);
      });

      it('two straights - player with highest straight wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('hearts', 'seven'),
            new Card('clubs', 'eight'),
            new Card('hearts', 'nine'),
            new Card('spades', 'ten'),
            new Card('clubs', 'ace')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'jack'),
          new Card('hearts', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 300
          }
        ]);
      });

      it('two equal straights - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('hearts', 'seven'),
            new Card('clubs', 'eight'),
            new Card('hearts', 'nine'),
            new Card('spades', 'ten'),
            new Card('clubs', 'ace')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'six'),
          new Card('hearts', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);

        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 150
          }
        ]);
      });

      it('two equal straights -  both players win, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('hearts', 'seven'),
            new Card('clubs', 'eight'),
            new Card('hearts', 'nine'),
            new Card('spades', 'ten'),
            new Card('clubs', 'ace')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 100;
        player1.isAllIn = true;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'six'),
          new Card('hearts', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);

        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 100
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT,
            winAmount: 150
          }
        ]);
      });
    });

    describe('flush', () => {
      it('one flush - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('clubs', 'four'),
            new Card('clubs', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'king'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('clubs', 'six'),
          new Card('clubs', 'ten')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 300
          }
        ]);
      });

      it('two flushes - players with the highest wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('hearts', 'two'),
            new Card('clubs', 'four'),
            new Card('clubs', 'king'),
            new Card('clubs', 'seven'),
            new Card('clubs', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('clubs', 'two'),
          new Card('spades', 'three')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('clubs', 'ace'),
          new Card('spades', 'two')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 300
          }
        ]);
      });

      it('one flush on the table - all [3] players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('clubs', 'jack'),
            new Card('clubs', 'ace'),
            new Card('clubs', 'seven'),
            new Card('clubs', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'two'),
          new Card('spades', 'three')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'four'),
          new Card('spades', 'two')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('hearts', 'three'),
          new Card('spades', 'five')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(3);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 150
          },
          {
            ...winners[2],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 150
          }
        ]);
      });

      it('one flush on the table - all [3] players win, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('clubs', 'jack'),
            new Card('clubs', 'ace'),
            new Card('clubs', 'seven'),
            new Card('clubs', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'two'),
          new Card('spades', 'three')
        ];
        player1.sumOfPersonalBetsInThisRound = 100;
        player1.isAllIn = true;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'four'),
          new Card('spades', 'two')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player3.cards = [
          new Card('hearts', 'three'),
          new Card('spades', 'five')
        ];

        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(3);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 100
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 150
          },
          {
            ...winners[2],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.FLUSH,
            winAmount: 150
          }
        ]);
      });
    });

    describe('full house', () => {
      it('one full house - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'king'),
          new Card('spades', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'two'),
          new Card('diamonds', 'seven')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the different full houses - the one with the highest three of kinds wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'king'),
            new Card('hearts', 'seven'),
            new Card('spades', 'seven')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'two'),
          new Card('clubs', 'ace')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'three'),
          new Card('diamonds', 'seven')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the different full houses but same three of kinds - the one with the highest pair wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'three'),
            new Card('diamonds', 'king'),
            new Card('hearts', 'seven'),
            new Card('spades', 'seven')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('clubs', 'seven'),
          new Card('spades', 'two')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('diamonds', 'seven'),
          new Card('spades', 'three')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 300
          }
        ]);
      });

      it('2 players have the same full house - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'ace'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'two'),
          new Card('clubs', 'seven')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'two'),
          new Card('diamonds', 'seven')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          }
        ]);
      });

      it('full house is on the table - all players [3] wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'seven'),
            new Card('diamonds', 'seven')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('clubs', 'king'),
          new Card('clubs', 'ace')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('clubs', 'queen'),
          new Card('clubs', 'king')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player2.cards = [
          new Card('hearts', 'ace'),
          new Card('hearts', 'king')
        ];
        player3.sumOfPersonalBetsInThisRound = 150;

        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(3);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          },
          {
            ...winners[2],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          }
        ]);
      });
      it('full house is on the table - all players [3] wins, but player-1 gets less money since he is all in', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'seven'),
            new Card('diamonds', 'seven')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('clubs', 'king'),
          new Card('clubs', 'ace')
        ];
        player1.sumOfPersonalBetsInThisRound = 100;
        player1.isAllIn = true;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('clubs', 'queen'),
          new Card('clubs', 'king')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player2.cards = [
          new Card('hearts', 'ace'),
          new Card('hearts', 'king')
        ];
        player3.sumOfPersonalBetsInThisRound = 150;

        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(3);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 100
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          },
          {
            ...winners[2],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.FULL_HOUSE,
            winAmount: 150
          }
        ]);
      });
    });

    describe('four of kinds', () => {
      it('one four of kinds - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'seven'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'queen'),
          new Card('spades', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'two'),
          new Card('diamonds', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
            winAmount: 300
          }
        ]);
      });

      it('1x four of kinds on the table, same kicker card - two players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'two'),
            new Card('clubs', 'three')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('diamonds', 'five'),
          new Card('spades', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'five'),
          new Card('diamonds', 'king')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
            winAmount: 150
          }
        ]);
      });

      it('1x four of kinds on the table, different kicker card - one player with highest kicker card wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'two'),
            new Card('clubs', 'three')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('diamonds', 'five'),
          new Card('spades', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'five'),
          new Card('diamonds', 'ace')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;

        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
            winAmount: 300
          }
        ]);
      });

      it('2 player have different four of kinds - one player with highest four of kinds wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('clubs', 'two'),
            new Card('hearts', 'two'),
            new Card('diamonds', 'two'),
            new Card('hearts', 'three'),
            new Card('clubs', 'three')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('diamonds', 'two'),
          new Card('spades', 'king')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'three'),
          new Card('diamonds', 'three')
        ];

        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
            winAmount: 300
          }
        ]);
      });
    });

    describe('straight flush', () => {
      it('one straight flush - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'nine'),
            new Card('spades', 'ten'),
            new Card('spades', 'jack'),
            new Card('spades', 'queen'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'king'),
          new Card('hearts', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ten'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
            winAmount: 300
          }
        ]);
      });

      it('one straight flush on the table - all players [3] win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'nine'),
            new Card('spades', 'ten'),
            new Card('spades', 'jack'),
            new Card('spades', 'queen'),
            new Card('spades', 'king')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(3, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('hearts', 'four'),
          new Card('hearts', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ten'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        // player-3
        const player3 = players.playerList[2];
        player2.cards = [
          new Card('hearts', 'nine'),
          new Card('clubs', 'queen')
        ];
        player3.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(3);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
            winAmount: 150
          },
          {
            ...winners[2],
            name: 'player-3',
            bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
            winAmount: 150
          }
        ]);
      });

      it('two different straight flushes - player with the highest wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'nine'),
            new Card('spades', 'ten'),
            new Card('spades', 'jack'),
            new Card('spades', 'queen'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'eight'),
          new Card('hearts', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('spades', 'king'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
            winAmount: 300
          }
        ]);
      });
    });

    describe('royal flush', () => {
      it('royal flush - one player wins', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'ten'),
            new Card('spades', 'jack'),
            new Card('spades', 'queen'),
            new Card('spades', 'king'),
            new Card('hearts', 'nine')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'ace'),
          new Card('hearts', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ten'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(1);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.ROYAL_FLUSH,
            winAmount: 300
          }
        ]);
      });

      it('royal flush on the table - both players win', () => {
        const store = {
          cardsOnTheDesk: [
            new Card('spades', 'ten'),
            new Card('spades', 'jack'),
            new Card('spades', 'queen'),
            new Card('spades', 'king'),
            new Card('spades', 'ace')
          ],
          winners: []
        } as unknown as Store;
        const players = new Players(2, 1000);
        // player-1
        const player1 = players.playerList[0];
        player1.cards = [
          new Card('spades', 'two'),
          new Card('hearts', 'six')
        ];
        player1.sumOfPersonalBetsInThisRound = 150;
        // player-2
        const player2 = players.playerList[1];
        player2.cards = [
          new Card('hearts', 'ten'),
          new Card('hearts', 'queen')
        ];
        player2.sumOfPersonalBetsInThisRound = 150;
        const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
        expect(winners).toHaveLength(2);
        expect(winners).toEqual([
          {
            ...winners[0],
            name: 'player-1',
            bestCombinationName: COMBINATIONS.ROYAL_FLUSH,
            winAmount: 150
          },
          {
            ...winners[1],
            name: 'player-2',
            bestCombinationName: COMBINATIONS.ROYAL_FLUSH,
            winAmount: 150
          }
        ]);
      });
    });
  });

  describe('combination comparisons', () => {
    it('royal flush wins over straight flush', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('spades', 'queen'),
          new Card('spades', 'king'),
          new Card('hearts', 'nine')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('spades', 'ace'),
        new Card('hearts', 'six')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('spades', 'nine'),
        new Card('hearts', 'queen')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.ROYAL_FLUSH,
          winAmount: 300
        }
      ]);
    });

    it('straight flush wins over four of kinds', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('spades', 'queen'),
          new Card('spades', 'king'),
          new Card('hearts', 'ten')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('spades', 'nine'),
        new Card('hearts', 'six')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'ten'),
        new Card('diamonds', 'ten')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
          winAmount: 300
        }
      ]);
    });

    it('four of kinds wins over full house', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('hearts', 'ten'),
          new Card('diamonds', 'three'),
          new Card('spades', 'jack'),
          new Card('hearts', 'jack')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'ten'),
        new Card('diamonds', 'ten')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'jack'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
          winAmount: 300
        }
      ]);
    });

    it('full house wins over flush', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'ten'),
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('hearts', 'king')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'two'),
        new Card('spades', 'three')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'jack'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.FULL_HOUSE,
          winAmount: 300
        }
      ]);
    });

    it('flush wins over straight', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('hearts', 'seven'),
        new Card('diamonds', 'king')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'eight')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.FLUSH,
          winAmount: 300
        }
      ]);
    });

    it('straight wins over three of kind', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'nine')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'two'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.STRAIGHT,
          winAmount: 300
        }
      ]);
    });

    it('three of kind wins over two pairs', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'four'),
        new Card('diamonds', 'king')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'nine')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.THREE_OF_KIND,
          winAmount: 300
        }
      ]);
    });

    it('two pairs wins over one pair', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'king'),
        new Card('diamonds', 'queen')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'jack'),
        new Card('spades', 'six')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.TWO_PAIRS,
          winAmount: 300
        }
      ]);
    });

    it('one pair wins over high card', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'jack')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'king'),
        new Card('diamonds', 'queen')
      ];
      player1.sumOfPersonalBetsInThisRound = 150;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'queen'),
        new Card('spades', 'six')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(1);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.PAIR,
          winAmount: 300
        }
      ]);
    });
  });

  describe('combination compare when higher combination is all in', () => {
    it('royal flush wins over straight flush, but money is split since royal flush in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('spades', 'queen'),
          new Card('spades', 'king'),
          new Card('hearts', 'nine')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('spades', 'ace'),
        new Card('hearts', 'six')
      ];
      player1.isAllIn = true;
      player1.sumOfPersonalBetsInThisRound = 100;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('spades', 'nine'),
        new Card('hearts', 'queen')
      ];

      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      console.warn(winners);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.ROYAL_FLUSH,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
          winAmount: 50
        }
      ]);
    });
    it('straight flush wins over four of kinds, but money is split since straight flush in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('spades', 'queen'),
          new Card('spades', 'king'),
          new Card('hearts', 'ten')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('spades', 'nine'),
        new Card('hearts', 'six')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'ten'),
        new Card('diamonds', 'ten')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.STRAIGHT_FLUSH,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
          winAmount: 50
        }
      ]);
    });

    it('four of kinds wins over full house, but money is split since four of kinds in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('hearts', 'ten'),
          new Card('diamonds', 'three'),
          new Card('spades', 'jack'),
          new Card('hearts', 'jack')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'ten'),
        new Card('diamonds', 'ten')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'jack'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.FOUR_OF_KIND,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.FULL_HOUSE,
          winAmount: 50
        }
      ]);
    });

    it('full house wins over flush, but money is split since full house in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'ten'),
          new Card('spades', 'ten'),
          new Card('spades', 'ten'),
          new Card('spades', 'jack'),
          new Card('hearts', 'king')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'jack'),
        new Card('diamonds', 'king')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'two'),
        new Card('spades', 'three')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.FULL_HOUSE,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.FLUSH,
          winAmount: 50
        }
      ]);
    });

    it('flush wins over straight, but money is split since flush in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('spades', 'six'),
          new Card('hearts', 'king')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'eight')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('hearts', 'seven'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.FLUSH,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.STRAIGHT,
          winAmount: 50
        }
      ]);
    });

    it('straight wins over three of kind, but money is split since straight in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'two'),
        new Card('diamonds', 'king')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'nine')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;
      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.STRAIGHT,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.THREE_OF_KIND,
          winAmount: 50
        }
      ]);
    });

    it('three of kind wins over two pairs, but money is split since three of kind in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'three'),
        new Card('spades', 'nine')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'four'),
        new Card('diamonds', 'king')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.THREE_OF_KIND,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.TWO_PAIRS,
          winAmount: 50
        }
      ]);
    });

    it('two pairs wins over one pair, but money is split since two pairs in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'three')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'jack'),
        new Card('spades', 'six')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'king'),
        new Card('diamonds', 'queen')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.TWO_PAIRS,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.PAIR,
          winAmount: 50
        }
      ]);
    });

    it('one pair wins over high card, but money is split since one pair in all in', () => {
      const store = {
        cardsOnTheDesk: [
          new Card('spades', 'three'),
          new Card('spades', 'four'),
          new Card('spades', 'five'),
          new Card('hearts', 'six'),
          new Card('hearts', 'jack')
        ],
        winners: []
      } as unknown as Store;
      const players = new Players(2, 1000);
      // player-1
      const player1 = players.playerList[0];
      player1.cards = [
        new Card('clubs', 'queen'),
        new Card('spades', 'six')
      ];
      player1.sumOfPersonalBetsInThisRound = 100;
      player1.isAllIn = true;
      // player-2
      const player2 = players.playerList[1];
      player2.cards = [
        new Card('clubs', 'king'),
        new Card('diamonds', 'queen')
      ];
      player2.sumOfPersonalBetsInThisRound = 150;

      const winners = players.getWinnersOfRound(store.cardsOnTheDesk);
      expect(winners).toHaveLength(2);
      expect(winners).toEqual([
        {
          ...winners[0],
          name: 'player-1',
          bestCombinationName: COMBINATIONS.PAIR,
          winAmount: 200
        },
        {
          ...winners[1],
          name: 'player-2',
          bestCombinationName: COMBINATIONS.HIGH_CARD,
          winAmount: 50
        }
      ]);
    });
  });
});
