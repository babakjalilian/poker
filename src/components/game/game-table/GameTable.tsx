import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../../useStore";
import Card from "../card/Card";
import "./GameTable.scss";



const GameTable: React.FC = observer(() => {
    const store = useStore();
    return (
        <div className="gameTable noSelect">
            <div className="tableCardsContainer">
                <div className="placeholder-container">
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                </div>
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
