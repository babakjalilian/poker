import { observer } from "mobx-react";
import React from "react";
import store from "../../../Store";
import Card from "../card/Card";
import "./GameTable.scss";

const GameTable: React.FC = observer(() => {
    return (
        <div className="gameTable noSelect">
            <div className="tableCardsContainer">
                {store.cardsOnTheDesk?.map(({ suitName, cardSymbol, suitSymbol, cardName, isFaded, isHidden }) => {
                    return <Card key={`${suitName}_${cardName}`}
                        value={cardSymbol}
                        suit={suitSymbol}
                        isFaded={isFaded}
                        isHidden={isHidden}
                    />
                })}
                <br />
            </div>
            <div className="tableInfo">
                <div>{store?.sumOfBets} €</div>
            </div>
            <div className="gameInfo">
                <ul>
                    <li>Player-1 wins with [pair]</li>
                </ul>
            </div>
        </div>
    );
});
export default GameTable;
