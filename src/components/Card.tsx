import { observer } from 'mobx-react';
import React from 'react';
import { CardNameSymbol, SuitSymbol } from '../types';
import "./styles/Card.css";


export interface CardProps {
    value: CardNameSymbol,
    symbol: SuitSymbol,
    isFaded: boolean,
    isHidden: boolean,
}

const Card: React.FC<CardProps> = observer(({ value, symbol, isFaded, isHidden }) => {
    const redSuits: SuitSymbol[] = ["♦", "♥"];
    const isRed = redSuits.includes(symbol);
    const shownCardClassNames = `card ${isRed ? "red" : "black"} ${isFaded ? "fadedCard" : ""}`;
    const hiddenCardClassNames = `card cardOutside`;

    if (isHidden) {
        return <div className={hiddenCardClassNames}></div>
    }
    // <div className={cardClassNames} >
    return (
        <div className={shownCardClassNames} >
            <div className="card-value">
                {value}
            </div>
            <div className="card-symbol">
                {symbol}
            </div>
            <div className="card-value reverse" >
                {value}
            </div>
        </div>
    )
});
export default Card;

