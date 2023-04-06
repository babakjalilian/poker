import { observer } from "mobx-react";
import React from "react";
import Card from "../card/Card";
import "./Player.scss";

interface PlayerProps {
    playerId: 0 | 1 | 2 | 3;
}

const Player: React.FC<PlayerProps> = observer(({ playerId }) => {
    return (
        <div className={`player noSelect player-${playerId}`}>
            <div className="playerInfo">
                {/* <div className="playerInfoText">
                    {store.players?.bigBlindPlayer === playerAtThisSlot && "big blind"}
                    {store.players?.smallBlindPlayer === playerAtThisSlot && "small blind"}
                </div> */}
                <div className="playerInfoBody">
                    <div className="playerCards">
                        <Card
                            key={`5-♣`}
                            value={"5"}
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
                    </div>
                    <div className="playerName">Player-{`${playerId}`}</div>
                    <div className="playerMoneyLeft">100 €</div>
                </div>
            </div>
            <div className="playerBet">
                150 €<div className="big-blind">BIG BLIND</div>
                {/* {store.players?.bigBlindPlayer === playerAtThisSlot &&<div className='big-blind'>BIG BLIND</div>}
            {store.players?.smallBlindPlayer === playerAtThisSlot &&<div className='small-blind'>SMALL BLIND</div>} */}
            </div>
        </div>
    );
});
export default Player;
