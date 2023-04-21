import React from "react";
import cardType from "../../../stores/Card";
import Card from "../card/Card";
import "./Player.scss";
import { observer } from "mobx-react";

interface PlayerProps {
    playerId: 0 | 1 | 2 | 3;
    name: string;
    hasFolded: boolean;
    isActivePlayer: boolean;
    isWinner: boolean;
    isBigBlindPlayer: boolean;
    isSmallBlindPlayer: boolean;
    cards: cardType[];
    moneyLeft: number;
    sumOfPersonalBetsInThisRound: number;
}

const Player: React.FC<PlayerProps> = observer((
    {
        playerId,
        name,
        hasFolded,
        isActivePlayer,
        isWinner,
        isBigBlindPlayer,
        isSmallBlindPlayer,
        cards,
        moneyLeft,
        sumOfPersonalBetsInThisRound
    }
) => {
    return (
        <div className={`player noSelect  player-${playerId} ${hasFolded ? "folded" : ""}`}>
            <div className={`player-info ${isActivePlayer ? "player-info-active" : ""} ${isWinner ? "player-info-winner" : ""}`}>
                <div className={`player-info-body`}>
                    <div className="player-cards">
                        {
                            cards.map(({ suitName, suitSymbol, cardName, cardSymbol, isFaded, isHidden }) => {
                                return <Card key={`${suitName}_${cardName}`} value={cardSymbol} suit={suitSymbol} isFaded={isFaded} isHidden={isHidden} />
                            })
                        }
                    </div>
                    <div className="player-name">{name}</div>
                    <div className="player-money-left">{moneyLeft} €</div>
                </div>
            </div>
            <div className="player-bet">
                {sumOfPersonalBetsInThisRound} €
                {isBigBlindPlayer && <div className='big-blind'>BIG BLIND</div>}
                {isSmallBlindPlayer && <div className='small-blind'>SMALL BLIND</div>}
            </div>
        </div>
    );
});
export default Player;
