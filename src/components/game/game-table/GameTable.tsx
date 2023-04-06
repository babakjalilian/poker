import { observer } from "mobx-react";
import React from "react";
import Card from "../card/Card";
import "./GameTable.css";

const GameTable: React.FC = observer(() => {
    return (
        <div className="gameTable noSelect">
            <div className="tableCardsContainer">
                <Card
                    key={`5-♣`}
                    value={"5"}
                    suit={"♣"}
                    isFaded={false}
                    isHidden={false}
                />
                <Card
                    key={`6-♥`}
                    value={"6"}
                    suit={"♥"}
                    isFaded={false}
                    isHidden={false}
                />
                <Card
                    key={`9-♣`}
                    value={"9"}
                    suit={"♣"}
                    isFaded={false}
                    isHidden={false}
                />
                <Card
                    key={`9-♥`}
                    value={"9"}
                    suit={"♥"}
                    isFaded={false}
                    isHidden={false}
                />
                <Card
                    key={`Q-♥`}
                    value={"Q"}
                    suit={"♥"}
                    isFaded={false}
                    isHidden={false}
                />
                <br />
            </div>
            <div className="tableInfo">
                <div>500 €</div>
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
