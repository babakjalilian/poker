import { observer } from "mobx-react";
import React from "react";
import { CardSymbol, SuitSymbol } from "../../../types";
import "./Card.scss";

export interface CardProps {
    value: CardSymbol;
    suit: SuitSymbol;
    isFaded: boolean;
    isHidden: boolean;
}

const Card: React.FC<CardProps> = observer(
    ({ value, suit, isFaded, isHidden }) => {
        const redSuits: SuitSymbol[] = ["♦", "♥"];
        const isRed = redSuits.includes(suit);
        const shownCardClassNames = `card ${isRed ? "red" : "black"} ${isFaded ? "card-faded" : ""}`;

        if (isHidden) {
            return <div className="card card-hidden"></div>;
        }
        // <div className={cardClassNames} >
        return (
            <div className={shownCardClassNames}>
                <div className="card-value">{value}</div>
                <div className="card-suit">{suit}</div>
            </div>
        );
    }
);
export default Card;
