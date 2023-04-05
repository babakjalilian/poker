import { makeAutoObservable } from "mobx";
import { PageName, StoreType } from "./types";

class Store implements StoreType {
  currentPage: PageName = "Menu";

  amountOfHumanPlayers: number = 3;
  minimumBet = 10;
  initialDeposit = 100;

  constructor() {
    makeAutoObservable(this);
  }

  startInitialGame() {
    console.log("game started");
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
}

const store = new Store();
export default store;
