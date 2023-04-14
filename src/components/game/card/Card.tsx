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
        return (
            <div className={`card ${isHidden ? "card-hidden" : ""}`}>
                <div className="card-inner">
                    <div className={`card-front ${isRed ? "red" : "black"} ${isFaded ? "card-faded" : ""}`}>
                        <div className="card-value">{value}</div>
                        <div className="card-suit">{suit}</div>
                    </div>
                    <div className="card-back"></div>
                </div>
            </div>
        );
    }
);
export default Card;
