import { BET_ACTION } from "./Consts";
import { Card } from "./stores/Card";
import { SuitSymbol } from "./types";

export const getDescSortedArrayofCards = (cardA: Card, cardB: Card): any => {
    const { cardCost: cardCost_1 } = cardA;
    const { cardCost: cardCost_2 } = cardB;
    return cardCost_2 - cardCost_1;
}


export const getCardsInFlushIfThereIsAny = ({ cardsToCheck, uniqueSuitSymbols }: { cardsToCheck: Card[], uniqueSuitSymbols: SuitSymbol[] }): Card[] => {
    const cardsWithFlush = uniqueSuitSymbols.map(uniqueSuitSymbol => {
        return cardsToCheck.filter(({ suitSymbol }) => suitSymbol === uniqueSuitSymbol);
    }).filter(cardsOfSameSuit => cardsOfSameSuit.length >= 5);
    if (cardsWithFlush.length) {
        return cardsWithFlush[0].sort(getDescSortedArrayofCards).slice(0, 5);
    }
    return [];
}

export const getCardsInStraightIfThereIsAny = (rawCardsToCheck: Card[]): Card[] => {
    let straightCards: Card[] = [];
    const order = "AKQJT98765432A";
    const descSortedCarts = rawCardsToCheck.sort(getDescSortedArrayofCards);
    let uniqueSortedCardSymbols = [...new Set(descSortedCarts.map(({ cardSymbol }) => cardSymbol === "10" ? 'T' : cardSymbol))].join("");
    if (uniqueSortedCardSymbols.includes("A")) {
        uniqueSortedCardSymbols = uniqueSortedCardSymbols.concat("A");
    }
    for (let index = 0; index <= 3; index++) {
        const chapter = uniqueSortedCardSymbols.slice(index, index + 5);
        if (chapter.length === 5 && order.indexOf(chapter) > -1) {
            if (straightCards.length === 0) {
                chapter.split("").forEach(symbol => {
                    const card = descSortedCarts.find(({ cardSymbol }) => cardSymbol === symbol || (symbol === "T" && cardSymbol === "10"));
                    straightCards.push(card);
                })
            }
        }
    }
    return straightCards;
}

export function getGameEventText(name: string, betAmount: number, betAction: BET_ACTION) {
    switch (betAction) {
        case BET_ACTION.RAISE: {
            return `${name}: raises bet (+${betAmount})`
        }
        case BET_ACTION.SUPPORT: {
            return `${name}: supports bet (+${betAmount})`
        }
        case BET_ACTION.ALL_IN: {
            return `${name}: goes all in (+${betAmount})`
        }
        case BET_ACTION.BIG_BLIND: {
            return `${name}: big blind (+${betAmount})`
        }
        case BET_ACTION.SMALL_BLIND: {
            return `${name}: small blind (+${betAmount})`
        }
        default:
            console.error(`unsupported betAction: "${betAction}"`);
            return `unsupported betAction: "${betAction}"`;
    }
}
