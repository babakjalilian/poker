import { Players } from "../modules/Players";



describe("players", () => {
  describe("player initialisation", () => {
    it("should create a player", () => {
      const initialMoney = 100;
      const players = new Players(1, 100);
      expect(players.playerList).toEqual([
        {
          ...players.playerList[0],
          name: "player-1",
          id: 0,
          moneyLeft: initialMoney,
          cards: [],
        }]);
    });
  });
});