import { makeAutoObservable } from "mobx";
import { PageName, StoreType } from "./types";

class Store implements StoreType {
    currentPage: PageName = "Menu";

    constructor() {
        makeAutoObservable(this);
    }

    startInitialGame() {
        console.log("game started")
    }
}

const store = new Store();
export default store;