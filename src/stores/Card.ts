import { makeAutoObservable } from "mobx";
import {
    cardCosts,
    cardNames,
    cardSymbols,
    suitNames,
    suitSymbols
} from "../Consts";
import {
    CardCost,
    CardName,
    CardSymbol,
    CardType,
    SuitName,
    SuitSymbol
} from "../types";

export default class Card implements CardType {
    suitName: SuitName = suitNames[0];
    suitSymbol: SuitSymbol;
    cardName = cardNames[0];
    cardSymbol: CardSymbol;
    isHidden = false;
    cardCost: CardCost;
    isFaded = false;

    constructor(suitName: SuitName, cardName: CardName) {
        this.suitName = suitName;
        this.suitSymbol = suitSymbols[suitName]!;
        this.cardName = cardName;
        this.cardSymbol = cardSymbols[cardName]!;
        this.cardCost = cardCosts[cardName];
        makeAutoObservable(this);
    }

    fade() {
        this.isFaded = true;
    }

    unfade() {
        this.isFaded = false;
    }

    hide() {
        this.isHidden = true;
    }

    show() {
        this.isHidden = false;
    }
}
