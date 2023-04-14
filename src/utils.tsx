import { Card } from "./modules/Card";
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

    // const cardCostsAlreadyChecked: CardCost[] = [], cardsToCheck: Card[] = [];
    // let cardsInStraight: Card[] = [];
    // let previousCardCost = 0, amountOfCardsInPotentialStraight = 0;
    // const isAceBetweenCards = !!rawCardsToCheck.filter(({ cardCost }) => cardCost === 14).length;
    // rawCardsToCheck.forEach(card => {
    //     const { cardCost } = card;
    //     if (!cardCostsAlreadyChecked.includes(cardCost)) {
    //         cardCostsAlreadyChecked.push(cardCost);
    //         cardsToCheck.push(card);
    //     }
    // });
    // for (const card of cardsToCheck) {
    //     const areCardsConsecutive = card.cardCost === previousCardCost - 1;
    //     if (areCardsConsecutive) {
    //         amountOfCardsInPotentialStraight++;
    //         cardsInStraight.push(card);
    //         const doCardsLookLikeBabyStraight = isAceBetweenCards && cardsInStraight[0].cardCost === 5 && cardsInStraight.length === 4;
    //         if (doCardsLookLikeBabyStraight) {
    //             const aceCard = rawCardsToCheck.find(card => card.cardCost === 14)!;
    //             return [...cardsInStraight, aceCard];
    //         }
    //     } else {
    //         amountOfCardsInPotentialStraight = 1;
    //         cardsInStraight = [card];
    //     }
    //     previousCardCost = card.cardCost;
    //     if (cardsInStraight.length === 5) {
    //         return cardsInStraight;
    //     }
    // }
    return straightCards;
}